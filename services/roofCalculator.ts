import type { SolarApiData, RoofReport, Point3D, Edge } from '../types';
import {
  SQ_METERS_TO_SQ_FEET,
  SQ_FEET_PER_SQUARE,
  WASTE_FACTOR_PERCENT,
  BUNDLES_PER_SQUARE,
  STARTER_LINEAR_FEET_PER_BUNDLE,
  RIDGE_CAP_LINEAR_FEET_PER_BUNDLE,
  ICE_WATER_SQ_FEET_PER_ROLL,
  UNDERLAYMENT_SQ_FEET_PER_ROLL,
  DRIP_EDGE_FEET_PER_PIECE,
  METERS_TO_FEET
} from '../constants';

// --- Helper Functions ---

function calculateDistance(p1: Point3D, p2: Point3D): number {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2) +
    Math.pow(p2.z - p1.z, 2)
  );
}

function getEdgeKey(p1: Point3D, p2: Point3D): string {
  const p1Str = `${p1.x.toFixed(3)},${p1.y.toFixed(3)},${p1.z.toFixed(3)}`;
  const p2Str = `${p2.x.toFixed(3)},${p2.y.toFixed(3)},${p2.z.toFixed(3)}`;
  return p1Str < p2Str ? `${p1Str}|${p2Str}` : `${p2Str}|${p1Str}`;
}

function getCentroid(vertices: Point3D[]): Point3D {
  if (vertices.length === 0) return { x: 0, y: 0, z: 0 };
  const sum = vertices.reduce((acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y, z: acc.z + v.z }), { x: 0, y: 0, z: 0 });
  return {
    x: sum.x / vertices.length,
    y: sum.y / vertices.length,
    z: sum.z / vertices.length,
  };
}

/**
 * Calculates a normal vector from pitch and azimuth.
 * Azimuth convention: 0° = North (+Y), 90° = East (+X).
 * Converts compass azimuth to a standard mathematical angle for trigonometric functions.
 */
function getNormal(pitch: number, azimuth: number): Point3D {
    const pitchRad = pitch * Math.PI / 180;
    // Convert compass degrees (0=N) to math degrees (0=E), then to radians.
    const mathAzimuthRad = (450 - azimuth) % 360 * Math.PI / 180;

    const nx = Math.sin(pitchRad) * Math.cos(mathAzimuthRad);
    const ny = Math.sin(pitchRad) * Math.sin(mathAzimuthRad);
    const nz = Math.cos(pitchRad);

    return { x: nx, y: ny, z: nz };
}

// --- Main Calculation Logic ---

export function calculateReport(data: SolarApiData): RoofReport {
  if (!data || !data.solarPotential) {
    throw new Error("Invalid solar data structure received.");
  }
  const { wholeRoofStats, roofSegmentStats } = data.solarPotential;

  if (!roofSegmentStats || roofSegmentStats.length === 0) {
    throw new Error("No roof segments found in the data.");
  }

  // 1. Calculate Area (Robustly)
  let totalAreaMeters: number;

  if (wholeRoofStats && typeof wholeRoofStats.areaMeters === 'number') {
    totalAreaMeters = wholeRoofStats.areaMeters;
  } else {
    // Fallback: sum up the areas from individual segments.
    totalAreaMeters = roofSegmentStats.reduce((sum, segment) => {
      const area = segment?.stats?.areaMeters ?? 0;
      return sum + area;
    }, 0);
  }

  if (totalAreaMeters === 0) {
    throw new Error("Could not determine total roof area from the provided data.");
  }
  
  const totalAreaSqFt = totalAreaMeters * SQ_METERS_TO_SQ_FEET;
  const totalSquares = totalAreaSqFt / SQ_FEET_PER_SQUARE;
  const totalSquaresWithWaste = totalSquares * (1 + WASTE_FACTOR_PERCENT / 100);

  // 2. Calculate Dominant Pitch (Improved Accuracy)
  const pitchMap: { [pitch: string]: number } = {};
  roofSegmentStats.forEach(segment => {
    if (segment && typeof segment.pitchDegrees === 'number' && segment.stats && typeof segment.stats.areaMeters === 'number') {
        const pitchIn12 = Math.round(12 * Math.tan(segment.pitchDegrees * Math.PI / 180));
        const pitchKey = `${Math.max(1, pitchIn12)}`; // Ensure pitch is at least 1/12
        pitchMap[pitchKey] = (pitchMap[pitchKey] || 0) + segment.stats.areaMeters;
    }
  });

  const dominantPitchKey = Object.keys(pitchMap).length > 0
    ? Object.entries(pitchMap).sort((a, b) => b[1] - a[1])[0][0]
    : '0';
  
  const pitchAnalysis = Object.entries(pitchMap).map(([pitch, areaMeters]) => ({
    pitch: Number(pitch),
    areaSqFt: areaMeters * SQ_METERS_TO_SQ_FEET,
  })).sort((a, b) => b.areaSqFt - a.areaSqFt);


  // 3. Linear Measurements (Robust Vector-Based Logic)
  const normals = roofSegmentStats.map(seg => getNormal(seg.pitchDegrees, seg.azimuthDegrees));
  const centroids = roofSegmentStats.map(seg => getCentroid(seg.vertices));

  const edgesMap = new Map<string, Edge[]>();
  roofSegmentStats.forEach((segment, segmentId) => {
    if (!segment.vertices) return;
    for (let i = 0; i < segment.vertices.length; i++) {
      const p1 = segment.vertices[i];
      const p2 = segment.vertices[(i + 1) % segment.vertices.length];
      const key = getEdgeKey(p1, p2);
      const edge: Edge = {
        p1,
        p2,
        length: calculateDistance(p1, p2) * METERS_TO_FEET,
        segmentId,
      };
      if (!edgesMap.has(key)) {
        edgesMap.set(key, []);
      }
      edgesMap.get(key)!.push(edge);
    }
  });

  const linearMeasurements = { ridges: 0, hips: 0, valleys: 0, eaves: 0, rakes: 0 };
  const classificationThreshold = 0.1; // To handle floating point inaccuracies

  edgesMap.forEach(edges => {
    const edge = edges[0];
    const isHorizontal = Math.abs(edge.p1.z - edge.p2.z) < classificationThreshold;

    if (edges.length === 1) { // External edge
      if (isHorizontal) {
        linearMeasurements.eaves += edge.length;
      } else {
        linearMeasurements.rakes += edge.length;
      }
    } else if (edges.length === 2) { // Shared edge between two segments
        const segInfo1 = { normal: normals[edges[0].segmentId], centroid: centroids[edges[0].segmentId] };
        const segInfo2 = { normal: normals[edges[1].segmentId] };

        // Create a vector from a point on the edge (p1) to the centroid of the first segment
        const vecToCentroid1 = {
            x: segInfo1.centroid.x - edge.p1.x,
            y: segInfo1.centroid.y - edge.p1.y,
            z: segInfo1.centroid.z - edge.p1.z,
        };

        // The dot product of this vector with the normal of the *other* segment
        // determines if the centroid is "above" or "below" the other segment's plane.
        const dotProduct = (segInfo2.normal.x * vecToCentroid1.x) +
                           (segInfo2.normal.y * vecToCentroid1.y) +
                           (segInfo2.normal.z * vecToCentroid1.z);

        if (dotProduct < -classificationThreshold) {
            // Convex junction (centroid is "below" the other plane) -> Hip or Ridge
            if (isHorizontal) {
                linearMeasurements.ridges += edge.length;
            } else {
                linearMeasurements.hips += edge.length;
            }
        } else if (dotProduct > classificationThreshold) {
            // Concave junction (centroid is "above" the other plane) -> Valley
            linearMeasurements.valleys += edge.length;
        }
        // If dotProduct is near zero, segments are nearly co-planar. Ignore classification.
    }
  });


  // 4. Calculate Material List
  const materialList = {
    shingleBundles: Math.ceil(totalSquaresWithWaste * BUNDLES_PER_SQUARE),
    starterShingles: Math.ceil((linearMeasurements.eaves + linearMeasurements.rakes) / STARTER_LINEAR_FEET_PER_BUNDLE),
    ridgeCapShingles: Math.ceil((linearMeasurements.ridges + linearMeasurements.hips) / RIDGE_CAP_LINEAR_FEET_PER_BUNDLE),
    iceAndWaterShield: Math.ceil((linearMeasurements.eaves * 3) / ICE_WATER_SQ_FEET_PER_ROLL), // 3ft wide shield on eaves
    underlaymentRolls: Math.ceil(totalAreaSqFt / UNDERLAYMENT_SQ_FEET_PER_ROLL),
    dripEdge: Math.ceil((linearMeasurements.eaves + linearMeasurements.rakes) / DRIP_EDGE_FEET_PER_PIECE),
  };

  return {
    totalAreaSqFt: Math.round(totalAreaSqFt),
    totalSquares,
    wasteFactor: WASTE_FACTOR_PERCENT,
    totalSquaresWithWaste,
    dominantPitch: Number(dominantPitchKey),
    linearMeasurements,
    materialList,
    pitchAnalysis,
  };
}
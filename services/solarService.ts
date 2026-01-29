import { GoogleGenAI, Type } from "@google/genai";
import type { SolarApiData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        solarPotential: {
            type: Type.OBJECT,
            properties: {
                wholeRoofStats: {
                    type: Type.OBJECT,
                    properties: {
                        areaMeters: { type: Type.NUMBER }
                    }
                },
                roofSegmentStats: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            pitchDegrees: { type: Type.NUMBER },
                            azimuthDegrees: { type: Type.NUMBER },
                            stats: {
                                type: Type.OBJECT,
                                properties: {
                                    areaMeters: { type: Type.NUMBER }
                                }
                            },
                            vertices: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        x: { type: Type.NUMBER },
                                        y: { type: Type.NUMBER },
                                        z: { type: Type.NUMBER }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};


export async function getRoofData(lat: number, lng: number): Promise<SolarApiData> {
  const prompt = `
    You are an expert Google Solar API simulator. Your task is to generate a valid and realistic JSON response that mimics the \`buildingInsights:findClosest\` endpoint, but with an added \`vertices\` array for each roof segment to enable linear measurements.

    For a residential property located at latitude ${lat} and longitude ${lng}, generate a JSON object.

    The structure must be:
    - A top-level object containing a "solarPotential" object.
    - "solarPotential" contains "wholeRoofStats" (with "areaMeters") and "roofSegmentStats" (an array).
    - "roofSegmentStats" must be an array of 8-12 segment objects.
    - Each segment object must have:
      - "pitchDegrees": number between 15 and 45.
      - "azimuthDegrees": number between 0 and 360.
      - "stats": an object with "areaMeters".
      - "vertices": AN ARRAY OF 3D POINTS {x, y, z}. This is the most crucial part. The vertices must form a closed polygon representing a plausible roof facet. Adjacent segments in the array should share edges to form hips, valleys, and ridges. Ensure the Z values reflect the pitch and create a realistic roof structure (e.g., ridges are higher than eaves). The origin (0,0,0) can be at a corner of the house's ground footprint.

    Constraint: The sum of \`roofSegmentStats[i].stats.areaMeters\` must be approximately equal to \`solarPotential.wholeRoofStats.areaMeters\`. The vertex data must be geometrically consistent to form a recognizable roof shape like a complex hip-and-gable roof. Do not include any other properties not specified here.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error fetching or parsing solar data from Gemini:", error);
    throw new Error("Failed to generate simulated roof data. The AI model may be temporarily unavailable.");
  }
}
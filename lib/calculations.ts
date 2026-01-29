
import type { CalculationInputs, CalculationResult, CostBreakdown, Pricing, FlatRoofingType } from '../types';
import { SQ_FEET_PER_SQUARE, SQ_METERS_TO_SQ_FEET } from '../constants';

export function calculateEstimate(inputs: CalculationInputs, pricing: Pricing): CalculationResult {
    const { buildingData, surveyState } = inputs;
    const {
        roofLayers,
        roofFeatures,
        gutters,
        heatTrace,
        roofUpgrade,
        flatRoofingType,
        flatRoofingColor,
        includedBuildingIds,
        asphaltRoofingEnabled,
        flatRoofingEnabled
    } = surveyState;

    const zeroBreakdown = { materials: 0, labor: 0, overhead: 0, profit: 0, total: 0 };
    const zeroUpgrades = {
        '.060MIL TPO': 0,
        '.080MIL TPO': 0,
        '.060MIL PVC': 0,
        '.080MIL PVC': 0,
    };

    if (includedBuildingIds.length === 0) {
        return {
            baseSq: 0,
            finalSq: 0,
            asphaltSq: 0,
            flatRoofSq: 0,
            estimatedLayers: 1,
            dominantPitch: 0,
            pitchBreakdown: [],
            roofEstimate: {
                breakdown: zeroBreakdown,
                upgrades: { 'TruDefinition® Duration FLEX®': 0, 'GAF Woodland®': 0, 'GAF Grand Sequoia®': 0 },
                totalRetail: 0,
                totalFacets: 0,
            },
            asphaltEstimate: zeroBreakdown,
            gutterEstimate: zeroBreakdown,
            heatTraceEstimate: zeroBreakdown,
            flatRoofingEstimate: zeroBreakdown,
            flatRoofingUpgrades: zeroUpgrades,
            flatRoofColorAddonCost: 0,
            liveTotal: 0,
        };
    }

    const includedBuildings = buildingData.buildings.filter(b => includedBuildingIds.includes(b.id));
    const totalFacets = includedBuildings.reduce((sum, b) => sum + b.facets.length, 0);

    let initialAsphaltSq = 0;
    let initialFlatSq = 0;
    let initialAsphaltMaterialCost = 0;
    let initialAsphaltLaborCost = 0;
    let initialAsphaltOverheadCost = 0;

    includedBuildings.forEach(building => {
        building.facets.forEach(facet => {
            const pitchIn12 = Math.round(12 * Math.tan(facet.pitchDegrees * Math.PI / 180));
            const facetSq = facet.areaMeters * SQ_METERS_TO_SQ_FEET / SQ_FEET_PER_SQUARE;

            if (pitchIn12 < 3) {
                initialFlatSq += facetSq;
            } else {
                initialAsphaltSq += facetSq;
                const pitchKey = Math.min(18, Math.max(3, pitchIn12)).toString();
                const pitchPrice = pricing.costPerSqByPitch[pitchKey] || pricing.costPerSqByPitch['6'];
                
                if (pitchPrice) {
                    initialAsphaltMaterialCost += facetSq * pitchPrice.materials;
                    initialAsphaltLaborCost += facetSq * pitchPrice.labor;
                    initialAsphaltOverheadCost += facetSq * pitchPrice.overhead;
                }
            }
        });
    });
    
    const apiTotalSq = initialAsphaltSq + initialFlatSq;
    const finalSq = surveyState.totalSq > 0 ? surveyState.totalSq : apiTotalSq;
    const scalingFactor = apiTotalSq > 0 ? finalSq / apiTotalSq : 1;

    const finalAsphaltSq = initialAsphaltSq * scalingFactor;
    const finalFlatSq = initialFlatSq * scalingFactor;

    // 1. Calculate Asphalt Roof Cost
    let totalAsphaltMaterialCost = 0;
    let totalAsphaltLaborCost = 0;
    let totalAsphaltOverheadCost = 0;

    if (asphaltRoofingEnabled) {
        totalAsphaltMaterialCost = initialAsphaltMaterialCost * scalingFactor;
        totalAsphaltLaborCost = initialAsphaltLaborCost * scalingFactor;
        totalAsphaltOverheadCost = initialAsphaltOverheadCost * scalingFactor;
    
        if (roofLayers !== '1') {
            totalAsphaltOverheadCost += finalAsphaltSq * pricing.addons.layers[roofLayers];
        }
        totalAsphaltOverheadCost += roofFeatures.chimneys * pricing.addons.features.chimney;
        totalAsphaltOverheadCost += roofFeatures.swampCoolers * pricing.addons.features.swampCooler;
        totalAsphaltOverheadCost += roofFeatures.skylights * pricing.addons.features.skylight;
    }

    const totalAsphaltBaseCost = totalAsphaltMaterialCost + totalAsphaltLaborCost + totalAsphaltOverheadCost;
    const asphaltProfit = totalAsphaltBaseCost * pricing.profitMargin;
    const asphaltTotalRetail = totalAsphaltBaseCost + asphaltProfit;
    const asphaltUpgradeCost = asphaltRoofingEnabled ? finalAsphaltSq * (pricing.upgrades[roofUpgrade] || 0) : 0;
    
    const asphaltEstimate: CostBreakdown = {
        materials: totalAsphaltMaterialCost,
        labor: totalAsphaltLaborCost,
        overhead: totalAsphaltOverheadCost,
        profit: asphaltProfit,
        total: asphaltTotalRetail
    };

    // 2. Calculate Flat Roof Estimate (BASE COST ONLY)
    const baseFlatRoofPricing = pricing.flatRoofing['.060MIL TPO'];
    
    let flatRoofMaterialCost = 0;
    let flatRoofLaborCost = 0;
    let flatRoofOverheadCost = 0;
    
    if (flatRoofingEnabled && finalFlatSq > 0) {
        flatRoofMaterialCost = finalFlatSq * baseFlatRoofPricing.materials;
        flatRoofLaborCost = finalFlatSq * baseFlatRoofPricing.labor;
        flatRoofOverheadCost = finalFlatSq * baseFlatRoofPricing.overhead;
    }
    
    const totalFlatRoofBaseCost = flatRoofMaterialCost + flatRoofLaborCost + flatRoofOverheadCost;
    const flatRoofProfit = totalFlatRoofBaseCost * pricing.profitMargin;
    const flatRoofTotalRetail = totalFlatRoofBaseCost + flatRoofProfit;

    const flatRoofingEstimate: CostBreakdown = {
        materials: flatRoofMaterialCost,
        labor: flatRoofLaborCost,
        overhead: flatRoofOverheadCost,
        profit: flatRoofProfit,
        total: flatRoofTotalRetail,
    };
    
    // 3. Gutter Estimate
    const baseGutterCost = (gutters.length * pricing.gutters.perFoot) +
        (gutters.miters * pricing.gutters.perMiter) +
        (gutters.downspouts1Story * pricing.gutters.downspout1Story) +
        (gutters.downspouts2Story * pricing.gutters.downspout2Story) +
        (gutters.downspouts3Story * pricing.gutters.downspout3Story) +
        (gutters.downspouts4Story * pricing.gutters.downspout4Story);

    const styleMultiplier = pricing.gutters.styleMultipliers?.[surveyState.gutters.style] ?? 1;
    const sizeMultiplier = pricing.gutters.sizeMultipliers?.[surveyState.gutters.size] ?? 1;
    const gutterTotal = baseGutterCost * styleMultiplier * sizeMultiplier;
    const gutterEstimate: CostBreakdown = { materials: gutterTotal * 0.6, labor: gutterTotal * 0.4, overhead: 0, profit: 0, total: gutterTotal };

    // 4. Heat Trace Estimate
    const heatTraceTotal = (heatTrace.length * pricing.heatTrace.perFoot) + 
        (heatTrace.downspouts1Story * pricing.heatTrace.downspout1Story) +
        (heatTrace.downspouts2Story * pricing.heatTrace.downspout2Story) +
        (heatTrace.downspouts3Story * pricing.heatTrace.downspout3Story) +
        (heatTrace.downspouts4Story * pricing.heatTrace.downspout4Story) +
        (pricing.heatTrace.eaveOverhang[heatTrace.eaveOverhang] || 0);
    const heatTraceEstimate: CostBreakdown = { materials: heatTraceTotal * 0.5, labor: heatTraceTotal * 0.5, overhead: 0, profit: 0, total: heatTraceTotal };

    // 5. Upgrades & Addons
    const flatRoofingUpgrades = (Object.keys(pricing.flatRoofing) as FlatRoofingType[]).reduce((acc, type) => {
        if (!flatRoofingEnabled || finalFlatSq <= 0) {
            acc[type] = 0;
            return acc;
        }
        const baseCost = finalFlatSq * (baseFlatRoofPricing.materials + baseFlatRoofPricing.labor + baseFlatRoofPricing.overhead) * (1 + pricing.profitMargin);
        const upgradePricing = pricing.flatRoofing[type];
        const upgradeCost = finalFlatSq * (upgradePricing.materials + upgradePricing.labor + upgradePricing.overhead) * (1 + pricing.profitMargin);
        acc[type] = upgradeCost - baseCost;
        return acc;
    }, {} as Record<FlatRoofingType, number>);

    const flatRoofColorAddonCost = flatRoofingEnabled && finalFlatSq > 0
        ? finalFlatSq * (pricing.flatRoofingColorAddons?.[flatRoofingColor] ?? 0)
        : 0;

    // 6. Live Total
    const liveGutterTotal = gutters.enabled ? gutterEstimate.total : 0;
    const liveHeatTraceTotal = heatTrace.enabled ? heatTraceEstimate.total : 0;
    const liveFlatRoofUpgradeCost = flatRoofingEnabled ? (flatRoofingUpgrades[flatRoofingType] || 0) : 0;
    const liveFlatRoofTotal = flatRoofingEnabled ? flatRoofingEstimate.total + liveFlatRoofUpgradeCost : 0;

    const liveTotal = asphaltTotalRetail + asphaltUpgradeCost + liveFlatRoofTotal + liveGutterTotal + liveHeatTraceTotal + flatRoofColorAddonCost;
    
    // 7. Pitch breakdown from included buildings
    const pitchBreakdown = includedBuildings
        .flatMap(b => b.facets)
        .reduce((acc, facet) => {
            const pitchIn12 = Math.round(12 * Math.tan(facet.pitchDegrees * Math.PI / 180));
            const sq = facet.areaMeters * SQ_METERS_TO_SQ_FEET / SQ_FEET_PER_SQUARE;
            const existing = acc.find(p => p.pitch === pitchIn12);
            if (existing) {
                existing.sq += sq;
            } else {
                acc.push({ pitch: pitchIn12, sq });
            }
            return acc;
        }, [] as { pitch: number, sq: number }[]).sort((a,b) => a.pitch - b.pitch);
    
    const dominantPitch = pitchBreakdown.length > 0
        ? pitchBreakdown.reduce((max, current) => (current.sq > max.sq ? current : max), pitchBreakdown[0]).pitch
        : 0;

    const estimatedLayers = Math.max(1, Math.floor((new Date().getFullYear() - buildingData.yearConstructed) / 35));

    return {
        baseSq: apiTotalSq,
        finalSq,
        asphaltSq: finalAsphaltSq,
        flatRoofSq: finalFlatSq,
        estimatedLayers,
        pitchBreakdown,
        dominantPitch,
        roofEstimate: {
            breakdown: asphaltEstimate,
            upgrades: pricing.upgrades,
            totalRetail: asphaltTotalRetail + flatRoofTotalRetail,
            totalFacets,
        },
        asphaltEstimate,
        gutterEstimate,
        heatTraceEstimate,
        flatRoofingEstimate,
        flatRoofingUpgrades,
        flatRoofColorAddonCost,
        liveTotal,
    };
}

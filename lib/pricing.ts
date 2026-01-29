import type { Pricing } from '../types';

export const PRICING_DATA: Pricing = {
  costPerSqByPitch: {
    '3': { materials: 120, labor: 110, overhead: 45 },
    '4': { materials: 120, labor: 115, overhead: 45 },
    '5': { materials: 120, labor: 120, overhead: 50 },
    '6': { materials: 125, labor: 125, overhead: 50 },
    '7': { materials: 130, labor: 135, overhead: 55 },
    '8': { materials: 130, labor: 140, overhead: 55 },
    '9': { materials: 135, labor: 150, overhead: 60 },
    '10': { materials: 135, labor: 160, overhead: 65 },
    '11': { materials: 140, labor: 170, overhead: 70 },
    '12': { materials: 140, labor: 185, overhead: 75 },
    '13': { materials: 150, labor: 200, overhead: 80 },
    '14': { materials: 155, labor: 220, overhead: 85 },
    '15': { materials: 160, labor: 240, overhead: 90 },
    '16': { materials: 165, labor: 260, overhead: 95 },
    '17': { materials: 170, labor: 280, overhead: 100 },
    '18': { materials: 175, labor: 300, overhead: 105 },
  },
  profitMargin: 0.25,
  addons: {
    layers: {
      '1': 0,
      '2': 55,
      '3': 75,
      '4': 100,
      'IDK': 65,
      'Other': 80,
    },
    features: {
      chimney: 450,
      swampCooler: 300,
      skylight: 600,
    },
  },
  upgrades: {
    'TruDefinition® Duration®': 0,
    'TruDefinition® Duration FLEX®': 8,
    'GAF Woodland®': 18,
    'GAF Grand Sequoia®': 35,
  },
  flatRoofing: {
    '.060MIL TPO': { materials: 25, labor: 20, overhead: 5 },
    '.080MIL TPO': { materials: 32, labor: 25, overhead: 8 },
    '.060MIL PVC': { materials: 38, labor: 28, overhead: 9 },
    '.080MIL PVC': { materials: 45, labor: 35, overhead: 10 },
  },
  flatRoofingColorAddons: {
    'White': 0,
    'Gray': 0,
    'Tan': 50,
    'Brown': 50,
  },
  gutters: {
    perFoot: 9,
    perMiter: 25,
    downspout1Story: 60,
    downspout2Story: 120,
    downspout3Story: 180,
    downspout4Story: 240,
    styleMultipliers: {
      'K-Style': 1.0,
      'Box/Square': 1.3,
      'Half Round': 1.6,
    },
    sizeMultipliers: {
      '5"': 1.0,
      '6"': 1.25,
    },
  },
  heatTrace: {
    perFoot: 22,
    downspout1Story: 100,
    downspout2Story: 150,
    downspout3Story: 200,
    downspout4Story: 250,
    eaveOverhang: {
      'None': 0,
      'Small': 100,
      'Medium': 200,
      'Large': 450,
    }
  }
};

// Reference ranges for body metrics based on scientific standards
// Differentiated by gender using ACE, ACSM, WHO, and medical research standards

export interface MetricRange {
  low: { min: number; max: number };
  standard: { min: number; max: number };
  excellent?: { min: number; max: number };
  high?: { min: number; max: number };
  tooHigh?: { min: number; max: number };
  unit: string;
  description: string;
  source: string;
}

export interface GenderedMetricRange {
  male: MetricRange;
  female: MetricRange;
}

// Gender-neutral metrics (same for both genders)
export const metricRanges: Record<string, MetricRange> = {
  bmi: {
    low: { min: 0, max: 18.5 },
    standard: { min: 18.5, max: 25 },
    high: { min: 25, max: 30 },
    tooHigh: { min: 30, max: 45 },
    unit: '',
    description: 'Body Mass Index - weight(kg) / height(m)²',
    source: 'WHO BMI Classification',
  },
  visceralFat: {
    low: { min: 0, max: 1 },
    standard: { min: 1, max: 9 },
    high: { min: 9, max: 14 },
    tooHigh: { min: 14, max: 30 },
    unit: '',
    description: 'Fat stored around internal organs (1-30 scale)',
    source: 'Tanita/Omron Visceral Fat Rating Standards',
  },
};

// Gender-specific metrics
export const genderedMetricRanges: Record<string, GenderedMetricRange> = {
  bodyFat: {
    male: {
      low: { min: 0, max: 6 },
      standard: { min: 6, max: 17 },
      excellent: { min: 17, max: 20 },
      high: { min: 20, max: 25 },
      tooHigh: { min: 25, max: 50 },
      unit: '%',
      description: 'Essential fat: 2-5%, Athletes: 6-13%, Fitness: 14-17%, Average: 18-24%',
      source: 'ACE Body Fat Percentage Standards (Adult Male)',
    },
    female: {
      low: { min: 0, max: 14 },
      standard: { min: 14, max: 24 },
      excellent: { min: 24, max: 28 },
      high: { min: 28, max: 35 },
      tooHigh: { min: 35, max: 50 },
      unit: '%',
      description: 'Essential fat: 10-13%, Athletes: 14-20%, Fitness: 21-24%, Average: 25-31%',
      source: 'ACE Body Fat Percentage Standards (Adult Female)',
    },
  },
  muscleMass: {
    male: {
      low: { min: 30, max: 38 },
      standard: { min: 38, max: 44 },
      excellent: { min: 44, max: 80 },
      unit: 'kg',
      description: 'Total weight of skeletal muscle in the body',
      source: 'InBody/BIA Standards (Adult Male, 70-80kg)',
    },
    female: {
      low: { min: 20, max: 30 },
      standard: { min: 30, max: 36 },
      excellent: { min: 36, max: 60 },
      unit: 'kg',
      description: 'Total weight of skeletal muscle in the body',
      source: 'InBody/BIA Standards (Adult Female, 55-65kg)',
    },
  },
  muscleRate: {
    male: {
      low: { min: 30, max: 60 },
      standard: { min: 60, max: 70 },
      excellent: { min: 70, max: 90 },
      unit: '%',
      description: 'Percentage of body weight that is muscle',
      source: 'ACSM Muscle Percentage Guidelines (Male)',
    },
    female: {
      low: { min: 30, max: 55 },
      standard: { min: 55, max: 65 },
      excellent: { min: 65, max: 85 },
      unit: '%',
      description: 'Percentage of body weight that is muscle',
      source: 'ACSM Muscle Percentage Guidelines (Female)',
    },
  },
  skeletalMuscle: {
    male: {
      low: { min: 20, max: 36 },
      standard: { min: 36, max: 40 },
      excellent: { min: 40, max: 70 },
      unit: '%',
      description: 'Percentage of muscle attached to the skeleton',
      source: 'InBody Skeletal Muscle Analysis (Male)',
    },
    female: {
      low: { min: 20, max: 33 },
      standard: { min: 33, max: 37 },
      excellent: { min: 37, max: 60 },
      unit: '%',
      description: 'Percentage of muscle attached to the skeleton',
      source: 'InBody Skeletal Muscle Analysis (Female)',
    },
  },
  boneMass: {
    male: {
      low: { min: 1, max: 2.5 },
      standard: { min: 2.5, max: 3.2 },
      high: { min: 3.2, max: 6 },
      unit: 'kg',
      description: 'Total weight of bone mineral content',
      source: 'DXA Bone Density Reference (Adult Male, 70-80kg)',
    },
    female: {
      low: { min: 1, max: 1.8 },
      standard: { min: 1.8, max: 2.5 },
      high: { min: 2.5, max: 5 },
      unit: 'kg',
      description: 'Total weight of bone mineral content',
      source: 'DXA Bone Density Reference (Adult Female, 55-65kg)',
    },
  },
  protein: {
    male: {
      low: { min: 10, max: 15 },
      standard: { min: 15, max: 17 },
      excellent: { min: 17, max: 22 },
      unit: '%',
      description: 'Percentage of body weight that is protein',
      source: 'Body Composition Analysis Standard (Male)',
    },
    female: {
      low: { min: 10, max: 14 },
      standard: { min: 14, max: 16 },
      excellent: { min: 16, max: 20 },
      unit: '%',
      description: 'Percentage of body weight that is protein',
      source: 'Body Composition Analysis Standard (Female)',
    },
  },
  proteinMass: {
    male: {
      low: { min: 8, max: 11 },
      standard: { min: 11, max: 14 },
      excellent: { min: 14, max: 20 },
      unit: 'kg',
      description: 'Total weight of protein in the body',
      source: 'BIA Protein Mass Reference (Male)',
    },
    female: {
      low: { min: 6, max: 9 },
      standard: { min: 9, max: 11 },
      excellent: { min: 11, max: 16 },
      unit: 'kg',
      description: 'Total weight of protein in the body',
      source: 'BIA Protein Mass Reference (Female)',
    },
  },
  bodyWater: {
    male: {
      low: { min: 40, max: 50 },
      standard: { min: 50, max: 55 },
      excellent: { min: 55, max: 65 },
      high: { min: 65, max: 75 },
      unit: '%',
      description: 'Optimal: 55-60%. Below 50% indicates dehydration',
      source: 'NHANES/NIH Hydration Guidelines (Adult Male)',
    },
    female: {
      low: { min: 35, max: 45 },
      standard: { min: 45, max: 50 },
      excellent: { min: 50, max: 60 },
      high: { min: 60, max: 70 },
      unit: '%',
      description: 'Optimal: 50-55%. Below 45% indicates dehydration',
      source: 'NHANES/NIH Hydration Guidelines (Adult Female)',
    },
  },
  waterWeight: {
    male: {
      low: { min: 30, max: 38 },
      standard: { min: 38, max: 45 },
      excellent: { min: 45, max: 55 },
      unit: 'kg',
      description: 'Total weight of water in the body',
      source: 'Body Composition Analysis Standard (Male)',
    },
    female: {
      low: { min: 25, max: 32 },
      standard: { min: 32, max: 38 },
      excellent: { min: 38, max: 45 },
      unit: 'kg',
      description: 'Total weight of water in the body',
      source: 'Body Composition Analysis Standard (Female)',
    },
  },
  subcutaneousFat: {
    male: {
      low: { min: 0, max: 8 },
      standard: { min: 8, max: 15 },
      high: { min: 15, max: 20 },
      tooHigh: { min: 20, max: 40 },
      unit: '%',
      description: 'Fat stored directly under the skin. Optimal: 8-15%',
      source: 'Jackson-Pollock Skinfold Standards (Adult Male)',
    },
    female: {
      low: { min: 0, max: 15 },
      standard: { min: 15, max: 23 },
      high: { min: 23, max: 30 },
      tooHigh: { min: 30, max: 45 },
      unit: '%',
      description: 'Fat stored directly under the skin. Optimal: 15-23%',
      source: 'Jackson-Pollock Skinfold Standards (Adult Female)',
    },
  },
  bmr: {
    male: {
      low: { min: 1200, max: 1500 },
      standard: { min: 1500, max: 1800 },
      excellent: { min: 1800, max: 2500 },
      unit: 'kcal',
      description: 'Basal Metabolic Rate - calories burned at rest',
      source: 'Mifflin-St Jeor Equation (Adult Male)',
    },
    female: {
      low: { min: 1000, max: 1200 },
      standard: { min: 1200, max: 1500 },
      excellent: { min: 1500, max: 2000 },
      unit: 'kcal',
      description: 'Basal Metabolic Rate - calories burned at rest',
      source: 'Mifflin-St Jeor Equation (Adult Female)',
    },
  },
  bodyAge: {
    male: {
      excellent: { min: 18, max: 25 },
      standard: { min: 25, max: 35 },
      high: { min: 35, max: 45 },
      tooHigh: { min: 45, max: 70 },
      low: { min: 10, max: 18 },
      unit: '',
      description: 'Metabolic age based on body composition vs. chronological age',
      source: 'Tanita/InBody Metabolic Age Algorithm',
    },
    female: {
      excellent: { min: 18, max: 25 },
      standard: { min: 25, max: 35 },
      high: { min: 35, max: 45 },
      tooHigh: { min: 45, max: 70 },
      low: { min: 10, max: 18 },
      unit: '',
      description: 'Metabolic age based on body composition vs. chronological age',
      source: 'Tanita/InBody Metabolic Age Algorithm',
    },
  },
  fatMass: {
    male: {
      low: { min: 0, max: 5 },
      standard: { min: 5, max: 14 },
      high: { min: 14, max: 20 },
      tooHigh: { min: 20, max: 40 },
      unit: 'kg',
      description: 'Total weight of fat tissue in the body',
      source: 'ACE Body Fat Mass Reference (Adult Male)',
    },
    female: {
      low: { min: 0, max: 10 },
      standard: { min: 10, max: 18 },
      high: { min: 18, max: 25 },
      tooHigh: { min: 25, max: 40 },
      unit: 'kg',
      description: 'Total weight of fat tissue in the body',
      source: 'ACE Body Fat Mass Reference (Adult Female)',
    },
  },
  fatFreeBodyWeight: {
    male: {
      low: { min: 45, max: 55 },
      standard: { min: 55, max: 65 },
      excellent: { min: 65, max: 85 },
      unit: 'kg',
      description: 'Total body weight minus fat mass (lean mass)',
      source: 'Lean Body Mass Reference (Male)',
    },
    female: {
      low: { min: 35, max: 42 },
      standard: { min: 42, max: 50 },
      excellent: { min: 50, max: 70 },
      unit: 'kg',
      description: 'Total body weight minus fat mass (lean mass)',
      source: 'Lean Body Mass Reference (Female)',
    },
  },
  weight: {
    male: {
      low: { min: 50, max: 60 },
      standard: { min: 60, max: 80 },
      high: { min: 80, max: 100 },
      tooHigh: { min: 100, max: 150 },
      unit: 'kg',
      description: 'Total body weight (varies by height)',
      source: 'BMI-based Weight Range (Height: 1.75m)',
    },
    female: {
      low: { min: 40, max: 50 },
      standard: { min: 50, max: 65 },
      high: { min: 65, max: 85 },
      tooHigh: { min: 85, max: 130 },
      unit: 'kg',
      description: 'Total body weight (varies by height)',
      source: 'BMI-based Weight Range (Height: 1.65m)',
    },
  },
  idealBodyWeight: {
    male: {
      standard: { min: 60, max: 75 },
      low: { min: 50, max: 60 },
      high: { min: 75, max: 90 },
      unit: 'kg',
      description: 'Ideal weight based on height',
      source: 'Devine Formula (Height: 1.75m)',
    },
    female: {
      standard: { min: 50, max: 63 },
      low: { min: 40, max: 50 },
      high: { min: 63, max: 80 },
      unit: 'kg',
      description: 'Ideal weight based on height',
      source: 'Devine Formula (Height: 1.65m)',
    },
  },
};

export const getMetricKey = (label: string): string => {
  const mapping: Record<string, string> = {
    'Weight': 'weight',
    'BMI': 'bmi',
    'Body Fat': 'bodyFat',
    'Fat Mass': 'fatMass',
    'Fat-free Body Weight': 'fatFreeBodyWeight',
    'Muscle Mass': 'muscleMass',
    'Muscle Rate': 'muscleRate',
    'Skeletal Muscle': 'skeletalMuscle',
    'Bone Mass': 'boneMass',
    'Protein Mass': 'proteinMass',
    'Protein': 'protein',
    'Water Weight': 'waterWeight',
    'Body Water': 'bodyWater',
    'Subcutaneous Fat': 'subcutaneousFat',
    'Visceral Fat': 'visceralFat',
    'BMR': 'bmr',
    'Body Age': 'bodyAge',
    'Ideal Body Weight': 'idealBodyWeight',
  };
  return mapping[label] || label.toLowerCase().replace(/\s+/g, '');
};

// Helper function to get the appropriate metric range based on gender
export const getMetricRange = (metricKey: string, gender: 'male' | 'female' = 'male'): MetricRange => {
  // Check if it's a gendered metric
  if (genderedMetricRanges[metricKey]) {
    return genderedMetricRanges[metricKey][gender];
  }
  
  // Fall back to gender-neutral metric
  return metricRanges[metricKey];
};

// Reference ranges for body metrics (adult male defaults)
// These can be adjusted based on age, sex, etc.

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
  bodyFat: {
    low: { min: 0, max: 10 },
    standard: { min: 10, max: 20 },
    high: { min: 20, max: 25 },
    tooHigh: { min: 25, max: 40 },
    unit: '%',
    description: 'Percentage of total body weight that is fat tissue',
    source: 'ACE Body Fat Percentile (Adult Male)',
  },
  muscleMass: {
    low: { min: 30, max: 44.8 },
    standard: { min: 44.8, max: 55.9 },
    excellent: { min: 55.9, max: 80 },
    unit: 'kg',
    description: 'Total weight of skeletal muscle in the body',
    source: 'BIA Analysis Standard (Adult Male 70-80kg)',
  },
  muscleRate: {
    low: { min: 30, max: 60 },
    standard: { min: 60, max: 70 },
    excellent: { min: 70, max: 90 },
    unit: '%',
    description: 'Percentage of body weight that is muscle',
    source: 'ACSM Muscle Percentage Guidelines',
  },
  skeletalMuscle: {
    low: { min: 20, max: 40 },
    standard: { min: 40, max: 50 },
    excellent: { min: 50, max: 70 },
    unit: '%',
    description: 'Percentage of muscle attached to the skeleton',
    source: 'InBody Skeletal Muscle Analysis',
  },
  boneMass: {
    low: { min: 1, max: 2.5 },
    standard: { min: 2.5, max: 4 },
    high: { min: 4, max: 6 },
    unit: 'kg',
    description: 'Total weight of bone mineral content',
    source: 'DXA Bone Density Reference (Adult Male)',
  },
  protein: {
    low: { min: 10, max: 14 },
    standard: { min: 14, max: 16 },
    excellent: { min: 16, max: 22 },
    unit: '%',
    description: 'Percentage of body weight that is protein',
    source: 'Body Composition Analysis Standard',
  },
  proteinMass: {
    low: { min: 8, max: 11 },
    standard: { min: 11, max: 14 },
    excellent: { min: 14, max: 20 },
    unit: 'kg',
    description: 'Total weight of protein in the body',
    source: 'BIA Protein Mass Reference',
  },
  bodyWater: {
    low: { min: 40, max: 50 },
    standard: { min: 50, max: 55 },
    excellent: { min: 55, max: 65 },
    high: { min: 65, max: 75 },
    unit: '%',
    description: 'Percentage of body weight that is water',
    source: 'NHANES Hydration Guidelines (Adult Male)',
  },
  waterWeight: {
    low: { min: 30, max: 38 },
    standard: { min: 38, max: 45 },
    excellent: { min: 45, max: 55 },
    unit: 'kg',
    description: 'Total weight of water in the body',
    source: 'Body Composition Analysis Standard',
  },
  subcutaneousFat: {
    low: { min: 0, max: 8 },
    standard: { min: 8, max: 15 },
    high: { min: 15, max: 20 },
    tooHigh: { min: 20, max: 35 },
    unit: '%',
    description: 'Fat stored directly under the skin',
    source: 'Skinfold Caliper Reference (Adult Male)',
  },
  visceralFat: {
    standard: { min: 1, max: 9 },
    high: { min: 9, max: 14 },
    tooHigh: { min: 14, max: 30 },
    low: { min: 0, max: 1 },
    unit: '',
    description: 'Fat stored around internal organs (1-30 scale)',
    source: 'Tanita Visceral Fat Rating',
  },
  bmr: {
    low: { min: 1200, max: 1500 },
    standard: { min: 1500, max: 1800 },
    excellent: { min: 1800, max: 2500 },
    unit: 'kcal',
    description: 'Basal Metabolic Rate - calories burned at rest (Mifflin-St Jeor)',
    source: 'Mifflin-St Jeor Equation',
  },
  bodyAge: {
    excellent: { min: 18, max: 25 },
    standard: { min: 25, max: 35 },
    high: { min: 35, max: 45 },
    tooHigh: { min: 45, max: 70 },
    low: { min: 10, max: 18 },
    unit: '',
    description: 'Metabolic age based on BMR compared to average',
    source: 'Metabolic Age Calculation (vs. Average BMR)',
  },
  fatMass: {
    low: { min: 0, max: 8 },
    standard: { min: 8, max: 15 },
    high: { min: 15, max: 20 },
    tooHigh: { min: 20, max: 40 },
    unit: 'kg',
    description: 'Total weight of fat tissue in the body',
    source: 'Body Fat Mass Reference (Adult Male)',
  },
  fatFreeBodyWeight: {
    low: { min: 45, max: 55 },
    standard: { min: 55, max: 65 },
    excellent: { min: 65, max: 85 },
    unit: 'kg',
    description: 'Total body weight minus fat mass (lean mass)',
    source: 'Lean Body Mass Reference',
  },
  weight: {
    low: { min: 50, max: 60 },
    standard: { min: 60, max: 80 },
    high: { min: 80, max: 100 },
    tooHigh: { min: 100, max: 150 },
    unit: 'kg',
    description: 'Total body weight',
    source: 'BMI-based Weight Range (Height: 1.75m)',
  },
  idealBodyWeight: {
    standard: { min: 60, max: 75 },
    low: { min: 50, max: 60 },
    high: { min: 75, max: 90 },
    unit: 'kg',
    description: 'Ideal weight based on height (Devine Formula)',
    source: 'Devine Formula (Height: 1.75m)',
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

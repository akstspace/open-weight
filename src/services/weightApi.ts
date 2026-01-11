// Mock API service for weight data
// This will be replaced with actual API calls later

export type RatingLevel = 'excellent' | 'standard' | 'high' | 'too-high' | 'low';

export interface MetricWithRating {
  value: number;
  unit: string;
  rating?: RatingLevel;
}

export interface WeightEntry {
  id: string;
  date: string;
  time: string;
  source?: string; // 'api' | 'manual'
  // Primary metrics
  weight: MetricWithRating;
  bmi: MetricWithRating;
  bodyFat: MetricWithRating;
  // Fat metrics
  fatMass: MetricWithRating;
  fatFreeBodyWeight: MetricWithRating;
  subcutaneousFat: MetricWithRating;
  visceralFat: MetricWithRating;
  // Muscle metrics
  muscleMass: MetricWithRating;
  muscleRate: MetricWithRating;
  skeletalMuscle: MetricWithRating;
  // Other body composition
  boneMass: MetricWithRating;
  proteinMass: MetricWithRating;
  protein: MetricWithRating;
  waterWeight: MetricWithRating;
  bodyWater: MetricWithRating;
  // Health metrics
  bmr: MetricWithRating;
  bodyAge: MetricWithRating;
  idealBodyWeight: MetricWithRating;
}

export interface WeightData {
  entries: WeightEntry[];
  latestEntry: WeightEntry;
  weeklyChange: number;
  changePeriodDays: number;
}

// Medical standard calculations (simplified algorithms)
const calculateBMIRating = (bmi: number): RatingLevel => {
  if (bmi < 18.5) return 'low';
  if (bmi >= 18.5 && bmi < 25) return 'standard';
  if (bmi >= 25 && bmi < 30) return 'high';
  return 'too-high';
};

const calculateBodyFatRating = (bodyFat: number): RatingLevel => {
  // For adult males (adjust ranges for females if needed)
  if (bodyFat < 10) return 'low';
  if (bodyFat >= 10 && bodyFat <= 20) return 'standard';
  if (bodyFat > 20 && bodyFat <= 25) return 'high';
  return 'too-high';
};

const calculateMuscleRating = (muscleRate: number): RatingLevel => {
  if (muscleRate >= 70) return 'excellent';
  if (muscleRate >= 60) return 'standard';
  if (muscleRate >= 50) return 'high';
  return 'low';
};

const calculateVisceralFatRating = (visceralFat: number): RatingLevel => {
  if (visceralFat <= 9) return 'standard';
  if (visceralFat <= 14) return 'high';
  return 'too-high';
};

const calculateBodyWaterRating = (bodyWater: number): RatingLevel => {
  // Healthy range is 50-65% for males
  if (bodyWater >= 55 && bodyWater <= 65) return 'excellent';
  if (bodyWater >= 50 && bodyWater < 55) return 'standard';
  if (bodyWater < 50) return 'low';
  return 'high';
};

const calculateBoneMassRating = (boneMass: number, weight: number): RatingLevel => {
  const ratio = (boneMass / weight) * 100;
  if (ratio >= 3.5 && ratio <= 5) return 'standard';
  if (ratio < 3.5) return 'low';
  return 'high';
};

const calculateProteinRating = (protein: number): RatingLevel => {
  if (protein >= 16 && protein <= 20) return 'excellent';
  if (protein >= 14 && protein < 16) return 'standard';
  return 'low';
};

const calculateBodyAgeRating = (bodyAge: number, actualAge: number = 30): RatingLevel => {
  if (bodyAge <= actualAge - 5) return 'excellent';
  if (bodyAge <= actualAge) return 'standard';
  if (bodyAge <= actualAge + 5) return 'high';
  return 'too-high';
};

const calculateSubcutaneousFatRating = (subcutFat: number): RatingLevel => {
  if (subcutFat >= 8 && subcutFat <= 15) return 'standard';
  if (subcutFat > 15 && subcutFat <= 20) return 'high';
  if (subcutFat > 20) return 'too-high';
  return 'low';
};

// Generate a complete entry with all metrics
const generateEntry = (
  id: string,
  date: string,
  time: string,
  weight: number,
  bodyFatPercent: number
): WeightEntry => {
  const bmi = weight / (1.75 * 1.75); // Assuming height of 1.75m
  const fatMass = weight * (bodyFatPercent / 100);
  const fatFreeBodyWeight = weight - fatMass;
  const muscleMass = fatFreeBodyWeight * 0.95;
  const muscleRate = (muscleMass / weight) * 100;
  const skeletalMuscle = muscleRate * 0.68;
  const boneMass = weight * 0.04;
  const proteinMass = weight * 0.18;
  const protein = (proteinMass / weight) * 100;
  const waterWeight = weight * 0.57;
  const bodyWater = (waterWeight / weight) * 100;
  const subcutaneousFat = bodyFatPercent * 0.86;
  const visceralFat = 5 + (bmi - 20) * 0.5;
  const bmr = 10 * weight + 6.25 * 175 - 5 * 30 + 5; // Mifflin-St Jeor for male
  const bodyAge = 25 + (bmi - 22) * 2;
  const idealBodyWeight = 22 * (1.75 * 1.75);

  return {
    id,
    date,
    time,
    weight: { value: weight, unit: 'kg', rating: bmi > 25 ? 'high' : 'standard' },
    bmi: { value: Number(bmi.toFixed(1)), unit: '', rating: calculateBMIRating(bmi) },
    bodyFat: { value: bodyFatPercent, unit: '%', rating: calculateBodyFatRating(bodyFatPercent) },
    fatMass: { value: Number(fatMass.toFixed(1)), unit: 'kg', rating: calculateBodyFatRating(bodyFatPercent) },
    fatFreeBodyWeight: { value: Number(fatFreeBodyWeight.toFixed(1)), unit: 'kg' },
    subcutaneousFat: { value: Number(subcutaneousFat.toFixed(1)), unit: '%', rating: calculateSubcutaneousFatRating(subcutaneousFat) },
    visceralFat: { value: Number(visceralFat.toFixed(1)), unit: '', rating: calculateVisceralFatRating(visceralFat) },
    muscleMass: { value: Number(muscleMass.toFixed(1)), unit: 'kg', rating: calculateMuscleRating(muscleRate) },
    muscleRate: { value: Number(muscleRate.toFixed(1)), unit: '%', rating: calculateMuscleRating(muscleRate) },
    skeletalMuscle: { value: Number(skeletalMuscle.toFixed(1)), unit: '%', rating: calculateMuscleRating(muscleRate) },
    boneMass: { value: Number(boneMass.toFixed(1)), unit: 'kg', rating: calculateBoneMassRating(boneMass, weight) },
    proteinMass: { value: Number(proteinMass.toFixed(1)), unit: 'kg', rating: calculateProteinRating(protein) },
    protein: { value: Number(protein.toFixed(1)), unit: '%', rating: calculateProteinRating(protein) },
    waterWeight: { value: Number(waterWeight.toFixed(1)), unit: 'kg', rating: calculateBodyWaterRating(bodyWater) },
    bodyWater: { value: Number(bodyWater.toFixed(1)), unit: '%', rating: calculateBodyWaterRating(bodyWater) },
    bmr: { value: Number(bmr.toFixed(0)), unit: 'kcal' },
    bodyAge: { value: Number(bodyAge.toFixed(0)), unit: '', rating: calculateBodyAgeRating(bodyAge) },
    idealBodyWeight: { value: Number(idealBodyWeight.toFixed(1)), unit: 'kg' },
  };
};

// Pagination response type
export interface PaginatedEntriesResponse {
  entries: WeightEntry[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Generate more entries for pagination demo
const generateAllEntries = (): WeightEntry[] => {
  const entries: WeightEntry[] = [];
  const baseDate = new Date('2024-10-27');
  
  for (let i = 0; i < 50; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i * 2);
    const dateStr = date.toISOString().split('T')[0];
    const weight = 75.5 + (i * 0.1) + (Math.random() * 0.5 - 0.25);
    const bodyFat = 18.5 + (i * 0.05) + (Math.random() * 0.3 - 0.15);
    
    entries.push(generateEntry(
      String(i + 1),
      dateStr,
      `0${7 + (i % 3)}:${15 + (i * 5) % 45}`,
      Number(weight.toFixed(1)),
      Number(bodyFat.toFixed(1))
    ));
  }
  
  return entries;
};

// Dummy data generator
const generateDummyData = (): WeightData => {
  const entries = generateAllEntries().slice(0, 12);

  const latestEntry = entries[0];
  const weekAgoEntry = entries.find(e => {
    const entryDate = new Date(e.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate <= weekAgo;
  }) || entries[entries.length - 1];

  const weeklyChange = Number((latestEntry.weight.value - weekAgoEntry.weight.value).toFixed(1));

  return {
    entries,
    latestEntry,
    weeklyChange,
  };
};

// Simulated API call
export const fetchWeightData = async (): Promise<WeightData> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateDummyData();
};

// Paginated entries fetch
export const fetchPaginatedEntries = async (
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedEntriesResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const allEntries = generateAllEntries();
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEntries = allEntries.slice(startIndex, endIndex);
  
  return {
    entries: paginatedEntries,
    total: allEntries.length,
    page,
    pageSize,
    hasMore: endIndex < allEntries.length,
  };
};

// Fetch single entry by ID - placeholder for API
export const fetchWeightEntryById = async (id: string): Promise<WeightEntry | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const allEntries = generateAllEntries();
  return allEntries.find(entry => entry.id === id) || null;
};

// Service that fetches real data from API and transforms it for UI
import { fetchEntriesAPI, fetchStatsAPI, fetchEntryAPI, fetchConfigStatus, type WeightEntryAPI, type StatsAPI } from './configApi';
import type { WeightEntry, WeightData, MetricWithRating, RatingLevel } from './weightApi';

// Medical standard calculations
const calculateBMIRating = (bmi: number): RatingLevel => {
  if (bmi < 18.5) return 'low';
  if (bmi >= 18.5 && bmi < 25) return 'standard';
  if (bmi >= 25 && bmi < 30) return 'high';
  return 'too-high';
};

const calculateBodyFatRating = (bodyFat: number): RatingLevel => {
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

// Transform API entry to UI format with all calculated metrics
const transformEntryToUI = (entry: WeightEntryAPI, userConfig?: { height: number | null; age: number | null; sex: string | null }): WeightEntry => {
  const weight = entry.weight;
  const bodyFatPercent = entry.bodyFat || 18.5;
  
  // Use user's actual height or fallback to 1.75m
  const heightCm = userConfig?.height || 175;
  const heightM = heightCm / 100;
  const bmi = entry.bmi || weight / (heightM * heightM);
  
  const muscleMass = entry.muscleMass || weight * 0.45;
  const bodyWater = entry.bodyWater || 57;
  const visceralFat = entry.visceralFat || 8;
  const boneMass = entry.boneMass || weight * 0.04;
  
  // Use user's actual age and sex for BMR calculation or fallback to defaults
  const age = userConfig?.age || 30;
  const sex = userConfig?.sex || 'male';
  const baseBMR = 10 * weight + 6.25 * heightCm - 5 * age;
  const bmr = entry.bmr || Math.round(sex === 'female' ? baseBMR - 161 : baseBMR + 5);

  // Calculate derived metrics
  const fatMass = weight * (bodyFatPercent / 100);
  const fatFreeBodyWeight = weight - fatMass;
  const muscleRate = (muscleMass / weight) * 100;
  const skeletalMuscle = muscleRate * 0.68;
  const proteinMass = weight * 0.18;
  const protein = (proteinMass / weight) * 100;
  const waterWeight = weight * (bodyWater / 100);
  const subcutaneousFat = bodyFatPercent * 0.86;
  const bodyAge = (age || 30) + (bmi - 22) * 2;
  const idealBodyWeight = 22 * (heightM * heightM);

  // Parse date and time
  const entryDate = new Date(entry.date);
  const dateStr = entryDate.toISOString().split('T')[0];
  const timeStr = entryDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return {
    id: entry.id,
    date: dateStr,
    time: timeStr,
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
    bodyAge: { value: Number(bodyAge.toFixed(0)), unit: '', rating: calculateBodyAgeRating(bodyAge, age) },
    idealBodyWeight: { value: Number(idealBodyWeight.toFixed(1)), unit: 'kg' },
  };
};

// Fetch and transform weight data for dashboard
export const fetchWeightData = async (): Promise<WeightData> => {
  try {
    // Fetch entries, stats, and user config in parallel
    const [entriesResponse, statsResponse, userConfig] = await Promise.all([
      fetchEntriesAPI(12, 0), // Get last 12 entries for the dashboard
      fetchStatsAPI(),
      fetchConfigStatus()
    ]);

    // Transform entries to UI format with user config
    const entries = entriesResponse.entries.map(entry => 
      transformEntryToUI(entry, { height: userConfig.height, age: userConfig.age, sex: userConfig.sex })
    );

    // Get latest entry
    const latestEntry = entries[0];
    
    if (!latestEntry) {
      throw new Error('No weight entries found');
    }

    // Calculate weekly change from stats or entries
    let weeklyChange = 0;
    if (statsResponse.stats?.weeklyChange !== null && statsResponse.stats?.weeklyChange !== undefined) {
      weeklyChange = statsResponse.stats.weeklyChange;
    } else if (entries.length > 1) {
      // Calculate from entries if not in stats
      const weekAgoEntry = entries.find(e => {
        const entryDate = new Date(e.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate <= weekAgo;
      }) || entries[entries.length - 1];
      
      weeklyChange = Number((latestEntry.weight.value - weekAgoEntry.weight.value).toFixed(1));
    }

    return {
      entries,
      latestEntry,
      weeklyChange,
    };
  } catch (error) {
    console.error('Error fetching weight data:', error);
    throw error;
  }
};

// Paginated entries fetch using real API
export const fetchPaginatedEntries = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{
  entries: WeightEntry[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}> => {
  const offset = (page - 1) * pageSize;
  
  // Fetch entries and user config in parallel
  const [response, userConfig] = await Promise.all([
    fetchEntriesAPI(pageSize, offset),
    fetchConfigStatus()
  ]);
  
  const entries = response.entries.map(entry => 
    transformEntryToUI(entry, { height: userConfig.height, age: userConfig.age, sex: userConfig.sex })
  );
  
  return {
    entries,
    total: response.total,
    page,
    pageSize,
    hasMore: offset + pageSize < response.total,
  };
};

// Fetch single entry by ID using dedicated API endpoint
export const fetchWeightEntryById = async (id: string): Promise<WeightEntry | null> => {
  try {
    // Fetch entry and user config in parallel
    const [entry, userConfig] = await Promise.all([
      fetchEntryAPI(id),
      fetchConfigStatus()
    ]);
    return transformEntryToUI(entry, { height: userConfig.height, age: userConfig.age, sex: userConfig.sex });
  } catch (error) {
    console.error('Error fetching entry:', error);
    return null;
  }
};

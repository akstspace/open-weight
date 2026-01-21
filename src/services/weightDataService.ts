// Service that fetches real data from API and transforms it for UI
import { fetchEntriesAPI, fetchStatsAPI, fetchEntryAPI, fetchConfigStatus, type WeightEntryAPI, type StatsAPI } from './configApi';
import type { WeightEntry, WeightData, MetricWithRating, RatingLevel } from './weightApi';
import { getMetricRange } from '@/data/metricRanges';

// Helper function to determine rating level from value and ranges
const getRatingFromRange = (value: number, metricKey: string, gender: 'male' | 'female' = 'male'): RatingLevel => {
  const range = getMetricRange(metricKey, gender);
  
  if (range.low && value >= range.low.min && value <= range.low.max) return 'low';
  if (range.standard && value >= range.standard.min && value <= range.standard.max) return 'standard';
  if (range.excellent && value >= range.excellent.min && value <= range.excellent.max) return 'excellent';
  if (range.high && value >= range.high.min && value <= range.high.max) return 'high';
  if (range.tooHigh && value >= range.tooHigh.min && value <= range.tooHigh.max) return 'too-high';
  
  // Default fallback logic
  if (range.low && value < range.low.min) return 'low';
  if (range.tooHigh && value > range.tooHigh.max) return 'too-high';
  if (range.high && value > range.high.max && !range.tooHigh) return 'high';
  
  return 'standard';
};

// Medical standard calculations with gender support
const calculateBMIRating = (bmi: number, gender: 'male' | 'female' = 'male'): RatingLevel => {
  return getRatingFromRange(bmi, 'bmi', gender);
};

const calculateBodyFatRating = (bodyFat: number, gender: 'male' | 'female' = 'male'): RatingLevel => {
  return getRatingFromRange(bodyFat, 'bodyFat', gender);
};

const calculateMuscleRating = (muscleRate: number, gender: 'male' | 'female' = 'male'): RatingLevel => {
  return getRatingFromRange(muscleRate, 'muscleRate', gender);
};

const calculateVisceralFatRating = (visceralFat: number, gender: 'male' | 'female' = 'male'): RatingLevel => {
  return getRatingFromRange(visceralFat, 'visceralFat', gender);
};

const calculateBodyWaterRating = (bodyWater: number, gender: 'male' | 'female' = 'male'): RatingLevel => {
  return getRatingFromRange(bodyWater, 'bodyWater', gender);
};

const calculateBoneMassRating = (boneMass: number, weight: number, gender: 'male' | 'female' = 'male'): RatingLevel => {
  return getRatingFromRange(boneMass, 'boneMass', gender);
};

const calculateProteinRating = (protein: number, gender: 'male' | 'female' = 'male'): RatingLevel => {
  return getRatingFromRange(protein, 'protein', gender);
};

const calculateBodyAgeRating = (bodyAge: number, actualAge: number = 30, gender: 'male' | 'female' = 'male'): RatingLevel => {
  return getRatingFromRange(bodyAge, 'bodyAge', gender);
};

const calculateSubcutaneousFatRating = (subcutFat: number, gender: 'male' | 'female' = 'male'): RatingLevel => {
  return getRatingFromRange(subcutFat, 'subcutaneousFat', gender);
};

// Transform API entry to UI format with all calculated metrics
const transformEntryToUI = (entry: WeightEntryAPI, userConfig?: { height: number | null; age: number | null; sex: string | null }): WeightEntry => {
  const weight = entry.weight;
  const bodyFatPercent = entry.bodyFat;
  
  // Use user's actual height or fallback to 1.75m
  const heightCm = userConfig?.height || 175;
  const heightM = heightCm / 100;
  const bmi = entry.bmi || weight / (heightM * heightM);
  
  // Use actual measured values, no guessing
  const muscleMass = entry.muscleMass;
  const bodyWater = entry.bodyWater;
  const visceralFat = entry.visceralFat;
  const boneMass = entry.boneMass;
  const proteinMass = entry.proteinMass;
  const subcutaneousFat = entry.subcutaneousFat;
  const skeletalMuscle = entry.skeletalMuscle;
  
  // Use user's actual age and sex for BMR calculation or fallback to defaults
  const age = userConfig?.age || 30;
  const sex = userConfig?.sex || 'male';
  const gender = (sex === 'female' ? 'female' : 'male') as 'male' | 'female';
  const baseBMR = 10 * weight + 6.25 * heightCm - 5 * age;
  const bmr = entry.bmr || Math.round(sex === 'female' ? baseBMR - 161 : baseBMR + 5);

  // Calculate only what can be accurately derived
  const fatMass = bodyFatPercent ? weight * (bodyFatPercent / 100) : 0;
  const fatFreeBodyWeight = bodyFatPercent ? weight - fatMass : 0;
  const muscleRate = muscleMass ? (muscleMass / weight) * 100 : 0;
  const protein = proteinMass ? (proteinMass / weight) * 100 : 0;
  const waterWeight = bodyWater ? weight * (bodyWater / 100) : 0;
  const bodyAge = entry.bodyAge || 0;
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
    source: entry.source,
    weight: { value: weight, unit: 'kg', rating: getRatingFromRange(weight, 'weight', gender) },
    bmi: { value: Number(bmi.toFixed(1)), unit: '', rating: calculateBMIRating(bmi, gender) },
    bodyFat: { value: bodyFatPercent || 0, unit: '%', rating: bodyFatPercent ? calculateBodyFatRating(bodyFatPercent, gender) : undefined },
    fatMass: { value: Number(fatMass.toFixed(1)), unit: 'kg', rating: fatMass > 0 ? getRatingFromRange(fatMass, 'fatMass', gender) : undefined },
    fatFreeBodyWeight: { value: Number(fatFreeBodyWeight.toFixed(1)), unit: 'kg', rating: fatFreeBodyWeight > 0 ? getRatingFromRange(fatFreeBodyWeight, 'fatFreeBodyWeight', gender) : undefined },
    subcutaneousFat: { value: subcutaneousFat || 0, unit: '%', rating: subcutaneousFat ? calculateSubcutaneousFatRating(subcutaneousFat, gender) : undefined },
    visceralFat: { value: visceralFat || 0, unit: '', rating: visceralFat ? calculateVisceralFatRating(visceralFat, gender) : undefined },
    muscleMass: { value: muscleMass || 0, unit: 'kg', rating: muscleMass ? getRatingFromRange(muscleMass, 'muscleMass', gender) : undefined },
    muscleRate: { value: Number(muscleRate.toFixed(1)), unit: '%', rating: muscleRate > 0 ? calculateMuscleRating(muscleRate, gender) : undefined },
    skeletalMuscle: { value: skeletalMuscle || 0, unit: '%', rating: skeletalMuscle ? getRatingFromRange(skeletalMuscle, 'skeletalMuscle', gender) : undefined },
    boneMass: { value: boneMass || 0, unit: 'kg', rating: boneMass ? calculateBoneMassRating(boneMass, weight, gender) : undefined },
    proteinMass: { value: proteinMass || 0, unit: 'kg', rating: proteinMass ? getRatingFromRange(proteinMass, 'proteinMass', gender) : undefined },
    protein: { value: Number(protein.toFixed(1)), unit: '%', rating: protein > 0 ? calculateProteinRating(protein, gender) : undefined },
    waterWeight: { value: Number(waterWeight.toFixed(1)), unit: 'kg', rating: waterWeight > 0 ? getRatingFromRange(waterWeight, 'waterWeight', gender) : undefined },
    bodyWater: { value: bodyWater || 0, unit: '%', rating: bodyWater ? calculateBodyWaterRating(bodyWater, gender) : undefined },
    bmr: { value: Number(bmr.toFixed(0)), unit: 'kcal', rating: getRatingFromRange(bmr, 'bmr', gender) },
    bodyAge: { value: bodyAge ? Number(bodyAge.toFixed(0)) : 0, unit: '', rating: bodyAge > 0 ? calculateBodyAgeRating(bodyAge, age, gender) : undefined },
    idealBodyWeight: { value: Number(idealBodyWeight.toFixed(1)), unit: 'kg', rating: getRatingFromRange(idealBodyWeight, 'idealBodyWeight', gender) },
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
    let changePeriodDays = 7;
    
    if (statsResponse.stats?.weeklyChange !== null && statsResponse.stats?.weeklyChange !== undefined) {
      weeklyChange = statsResponse.stats.weeklyChange;
      changePeriodDays = 7; // Stats API provides 7-day change
    } else if (entries.length > 1) {
      // Calculate from entries if not in stats
      const weekAgoEntry = entries.find(e => {
        const entryDate = new Date(e.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate <= weekAgo;
      }) || entries[entries.length - 1];
      
      weeklyChange = Number((latestEntry.weight.value - weekAgoEntry.weight.value).toFixed(1));
      
      // Calculate actual days between the two entries
      const latestDate = new Date(latestEntry.date);
      const comparisonDate = new Date(weekAgoEntry.date);
      changePeriodDays = Math.round((latestDate.getTime() - comparisonDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    return {
      entries,
      latestEntry,
      weeklyChange,
      changePeriodDays,
      totalEntries: entriesResponse.total,
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

import express from 'express';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import path from 'path';
import { PrismaClient } from '../prisma/generated/prisma/client.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || "" });
export const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(express.json());

// ============= Calculation Utilities =============

/**
 * Compute body mass index (BMI) from weight and height.
 *
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @returns BMI value rounded to one decimal place
 */
function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Calculates the age in years for the given birthday.
 *
 * @returns The age in whole years (rounded down) computed from `birthday`.
 */
function calculateAge(birthday: Date): number {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Compute basal metabolic rate using the Mifflin–St Jeor equation.
 *
 * @param weightKg - Body weight in kilograms
 * @param heightCm - Height in centimeters
 * @param age - Age in years
 * @param sex - 'male' or 'female'; if `null` or any other value, the male formula is used
 * @returns The BMR rounded to the nearest kcal/day
 */
function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: string | null
): number {
  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'male') {
    return Math.round(baseBMR + 5);
  } else if (sex === 'female') {
    return Math.round(baseBMR - 161);
  }
  // If sex is not specified, use male formula as default
  return Math.round(baseBMR + 5);
}

/**
 * Calculate derived body composition metrics
 */
interface DerivedMetrics {
  fatMass?: number;          // kg - total fat mass
  fatFreeBodyWeight?: number; // kg - lean body mass
  muscleRate?: number;        // % - muscle mass percentage
  protein?: number;           // % - protein percentage
  waterWeight?: number;       // kg - total water weight
  idealBodyWeight?: number;   // kg - based on height and healthy BMI
}

/**
 * Computes optional body composition metrics from provided measurements.
 *
 * @param weight - Total body weight in kilograms
 * @param heightCm - Height in centimeters (used to compute ideal body weight)
 * @param bodyFat - Body fat percentage (e.g., 18 for 18%); when provided, `fatMass` and `fatFreeBodyWeight` are calculated
 * @param muscleMass - Muscle mass in kilograms; when provided, `muscleRate` (percentage of weight) is calculated
 * @param bodyWater - Body water percentage (e.g., 55 for 55%); when provided, `waterWeight` is calculated
 * @param proteinMass - Protein mass in kilograms; when provided, `protein` (percentage of weight) is calculated
 * @returns An object containing any of the following computed metrics:
 * - `fatMass` (kg) — total fat mass when `bodyFat` is provided
 * - `fatFreeBodyWeight` (kg) — weight minus fat mass when `bodyFat` is provided
 * - `muscleRate` (%) — muscle mass as a percentage of total weight when `muscleMass` is provided
 * - `protein` (%) — protein mass as a percentage of total weight when `proteinMass` is provided
 * - `waterWeight` (kg) — total water weight when `bodyWater` is provided
 * - `idealBodyWeight` (kg) — weight corresponding to BMI of 22 based on `heightCm`
 */
function calculateDerivedMetrics(
  weight: number,
  heightCm: number,
  bodyFat?: number,
  muscleMass?: number,
  bodyWater?: number,
  proteinMass?: number
): DerivedMetrics {
  const metrics: DerivedMetrics = {};

  // Fat mass (kg) = weight × bodyFat%
  if (bodyFat !== undefined && bodyFat !== null) {
    metrics.fatMass = Math.round((weight * bodyFat / 100) * 10) / 10;
    // Fat-free body weight = total weight - fat mass
    metrics.fatFreeBodyWeight = Math.round((weight - metrics.fatMass) * 10) / 10;
  }

  // Muscle rate (%) = muscle mass / weight × 100
  if (muscleMass !== undefined && muscleMass !== null) {
    metrics.muscleRate = Math.round((muscleMass / weight * 100) * 10) / 10;
  }

  // Protein percentage (%) = protein mass / weight × 100
  if (proteinMass !== undefined && proteinMass !== null) {
    metrics.protein = Math.round((proteinMass / weight * 100) * 10) / 10;
  }

  // Water weight (kg) = weight × bodyWater%
  if (bodyWater !== undefined && bodyWater !== null) {
    metrics.waterWeight = Math.round((weight * bodyWater / 100) * 10) / 10;
  }

  // Ideal body weight based on BMI of 22 (middle of healthy range)
  // BMI = weight / (height in m)^2
  // Ideal weight = 22 × (height in m)^2
  const heightM = heightCm / 100;
  metrics.idealBodyWeight = Math.round((22 * heightM * heightM) * 10) / 10;

  return metrics;
}

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// ============= Middleware =============

// API Key authentication middleware
const authenticateApiKey = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  const config = await prisma.config.findFirst();
  if (!config) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  // Verify the API key using bcrypt
  const isValid = await bcrypt.compare(apiKey, config.apiKeyHash);
  if (!isValid) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};

// ============= Config Routes =============

// Check if app is configured
app.get('/api/config/status', async (req, res) => {
  try {
    const config = await prisma.config.findFirst();
    
    // Calculate age from birthday if available
    const age = config?.birthday ? calculateAge(config.birthday) : null;
    
    res.json({ 
      configured: !!config,
      userName: config?.userName || null,
      age: age, // Calculated age, not birthday
      height: config?.height || null,
      sex: config?.sex || null
    });
  } catch (error) {
    console.error('Error checking config status:', error);
    res.status(500).json({ error: 'Failed to check configuration' });
  }
});

// Initial setup - only works if not configured
app.post('/api/config/setup', async (req, res) => {
  try {
    const existingConfig = await prisma.config.findFirst();
    if (existingConfig) {
      return res.status(400).json({ error: 'Already configured. Use CLI to reset.' });
    }

    const { userName, birthday, height, sex } = req.body;
    if (!userName || typeof userName !== 'string' || userName.trim().length === 0) {
      return res.status(400).json({ error: 'User name is required' });
    }

    if (!birthday) {
      return res.status(400).json({ error: 'Birthday is required for calculations' });
    }

    if (!height || typeof height !== 'number' || height <= 0) {
      return res.status(400).json({ error: 'Height is required for BMI calculations' });
    }

    // Generate secure API key
    const apiKey = `wt_${randomBytes(32).toString('hex')}`;
    
    // Hash the API key before storing
    const apiKeyHash = await bcrypt.hash(apiKey, 10);

    const config = await prisma.config.create({
      data: {
        userName: userName.trim(),
        apiKeyHash,
        birthday: new Date(birthday),
        height: height,
        sex: sex || null,
      },
    });

    console.log(`[Setup] Configuration created for: ${config.userName}`);
    
    res.json({
      success: true,
      userName: config.userName,
      apiKey: apiKey, // Return the plain text key only during setup
      message: 'Save this API key! It cannot be retrieved again.',
    });
  } catch (error) {
    console.error('Error during setup:', error);
    res.status(500).json({ error: 'Failed to complete setup' });
  }
});

// ============= Weight Entry Routes (Public Read) =============

// Get all weight entries (public)
app.get('/api/entries', async (req, res) => {
  try {
    const { limit = '50', offset = '0', from, to } = req.query;
    
    const where: {
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
    if (from) where.date = { ...where.date, gte: new Date(from as string) };
    if (to) where.date = { ...where.date, lte: new Date(to as string) };

    const entries = await prisma.weightEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.weightEntry.count({ where });

    res.json({
      entries,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// Get latest entry (public) - MUST be before /:id route
app.get('/api/entries/latest', async (req, res) => {
  try {
    const entry = await prisma.weightEntry.findFirst({
      orderBy: { date: 'desc' },
    });

    if (!entry) {
      return res.status(404).json({ error: 'No entries found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching latest entry:', error);
    res.status(500).json({ error: 'Failed to fetch latest entry' });
  }
});

// Get single entry (public)
app.get('/api/entries/:id', async (req, res) => {
  try {
    const entry = await prisma.weightEntry.findUnique({
      where: { id: req.params.id },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});

// Get statistics (public)
app.get('/api/stats', async (req, res) => {
  try {
    const entries = await prisma.weightEntry.findMany({
      orderBy: { date: 'desc' },
    });

    if (entries.length === 0) {
      return res.json({ totalEntries: 0 });
    }

    const weights = entries.map(e => e.weight);
    const latest = entries[0];
    const weekAgo = entries.find(e => 
      new Date(e.date) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    res.json({
      totalEntries: entries.length,
      latest: {
        weight: latest.weight,
        date: latest.date,
        bodyFat: latest.bodyFat,
        muscleMass: latest.muscleMass,
        bmi: latest.bmi,
        bodyWater: latest.bodyWater,
      },
      stats: {
        min: Math.min(...weights),
        max: Math.max(...weights),
        avg: weights.reduce((a, b) => a + b, 0) / weights.length,
        weeklyChange: weekAgo ? latest.weight - weekAgo.weight : null,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ============= Weight Entry Routes (Protected) =============

// Create new entry (requires API key)
app.post('/api/entries', authenticateApiKey, async (req, res) => {
  try {
    const { 
      weight, bodyFat, muscleMass, bodyWater, visceralFat, boneMass, 
      subcutaneousFat, skeletalMuscle, proteinMass, bodyAge, notes, date, source 
    } = req.body;

    if (!weight || typeof weight !== 'number' || weight <= 0) {
      return res.status(400).json({ error: 'Valid weight is required' });
    }

    // Get user config for calculations
    const config = await prisma.config.findFirst();
    if (!config || !config.height || !config.birthday) {
      return res.status(500).json({ error: 'Configuration incomplete. Height and birthday are required for calculations.' });
    }

    // Calculate BMI, BMR, and body age
    const bmi = calculateBMI(weight, config.height);
    const age = calculateAge(config.birthday);
    const bmr = calculateBMR(weight, config.height, age, config.sex);
    
    // Calculate derived metrics
    const derivedMetrics = calculateDerivedMetrics(
      weight, 
      config.height, 
      bodyFat, 
      muscleMass, 
      bodyWater, 
      proteinMass
    );
    
    // Only use provided body age from scale measurement, don't calculate
    const finalBodyAge = bodyAge !== undefined && bodyAge !== null ? bodyAge : null;

    const entry = await prisma.weightEntry.create({
      data: {
        // Measured values
        weight,
        bodyFat: bodyFat || null,
        muscleMass: muscleMass || null,
        bodyWater: bodyWater || null,
        visceralFat: visceralFat || null,
        boneMass: boneMass || null,
        subcutaneousFat: subcutaneousFat || null,
        skeletalMuscle: skeletalMuscle || null,
        proteinMass: proteinMass || null,
        
        // Calculated values
        bmi,
        bmr,
        bodyAge: finalBodyAge,
        fatMass: derivedMetrics.fatMass || null,
        fatFreeBodyWeight: derivedMetrics.fatFreeBodyWeight || null,
        muscleRate: derivedMetrics.muscleRate || null,
        protein: derivedMetrics.protein || null,
        waterWeight: derivedMetrics.waterWeight || null,
        idealBodyWeight: derivedMetrics.idealBodyWeight || null,
        
        notes: notes || null,
        date: date ? new Date(date) : new Date(),
        source: source || 'automated',
      },
    });

    console.log(`[Entry] Created: ${entry.weight}kg on ${entry.date} (BMI: ${bmi}, BMR: ${bmr}, Body Age: ${finalBodyAge})`);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// Update entry (requires API key)
app.put('/api/entries/:id', authenticateApiKey, async (req, res) => {
  try {
    const { 
      weight, bodyFat, muscleMass, bodyWater, visceralFat, boneMass,
      subcutaneousFat, skeletalMuscle, proteinMass, bodyAge, notes, date 
    } = req.body;

    // Get user config for recalculations
    const config = await prisma.config.findFirst();
    if (!config || !config.height || !config.birthday) {
      return res.status(500).json({ error: 'Configuration incomplete. Height and birthday are required for calculations.' });
    }

    // Get current entry to use existing values for calculations
    const currentEntry = await prisma.weightEntry.findUnique({
      where: { id: req.params.id }
    });

    if (!currentEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Use new values or fall back to existing ones
    const finalWeight = weight !== undefined ? weight : currentEntry.weight;
    const finalBodyFat = bodyFat !== undefined ? bodyFat : currentEntry.bodyFat;
    const finalMuscleMass = muscleMass !== undefined ? muscleMass : currentEntry.muscleMass;
    const finalBodyWater = bodyWater !== undefined ? bodyWater : currentEntry.bodyWater;
    const finalProteinMass = proteinMass !== undefined ? proteinMass : currentEntry.proteinMass;

    // Prepare update data with type definition
    const updateData: {
      weight?: number;
      bodyFat?: number | null;
      muscleMass?: number | null;
      bodyWater?: number | null;
      visceralFat?: number | null;
      boneMass?: number | null;
      subcutaneousFat?: number | null;
      skeletalMuscle?: number | null;
      proteinMass?: number | null;
      bmi?: number;
      bmr?: number;
      bodyAge?: number;
      fatMass?: number | null;
      fatFreeBodyWeight?: number | null;
      muscleRate?: number | null;
      protein?: number | null;
      waterWeight?: number | null;
      idealBodyWeight?: number | null;
      notes?: string | null;
      date?: Date;
    } = {};

    // Recalculate all metrics if weight or related fields change
    if (weight !== undefined || bodyFat !== undefined || muscleMass !== undefined || 
        bodyWater !== undefined || proteinMass !== undefined) {
      
      updateData.bmi = calculateBMI(finalWeight, config.height);
      const age = calculateAge(config.birthday);
      updateData.bmr = calculateBMR(finalWeight, config.height, age, config.sex);
      
      // Calculate derived metrics
      const derivedMetrics = calculateDerivedMetrics(
        finalWeight,
        config.height,
        finalBodyFat !== null ? finalBodyFat : undefined,
        finalMuscleMass !== null ? finalMuscleMass : undefined,
        finalBodyWater !== null ? finalBodyWater : undefined,
        finalProteinMass !== null ? finalProteinMass : undefined
      );
      
      updateData.fatMass = derivedMetrics.fatMass || null;
      updateData.fatFreeBodyWeight = derivedMetrics.fatFreeBodyWeight || null;
      updateData.muscleRate = derivedMetrics.muscleRate || null;
      updateData.protein = derivedMetrics.protein || null;
      updateData.waterWeight = derivedMetrics.waterWeight || null;
      updateData.idealBodyWeight = derivedMetrics.idealBodyWeight || null;
      
      // Only use provided body age from scale measurement, don't calculate
      if (bodyAge !== undefined && bodyAge !== null) {
        updateData.bodyAge = bodyAge;
      }
    } else if (bodyAge !== undefined && bodyAge !== null) {
      // If only body age is updated without other changes
      updateData.bodyAge = bodyAge;
    }

    // Update direct fields
    if (weight !== undefined) updateData.weight = weight;
    if (bodyFat !== undefined) updateData.bodyFat = bodyFat;
    if (muscleMass !== undefined) updateData.muscleMass = muscleMass;
    if (bodyWater !== undefined) updateData.bodyWater = bodyWater;
    if (visceralFat !== undefined) updateData.visceralFat = visceralFat;
    if (boneMass !== undefined) updateData.boneMass = boneMass;
    if (subcutaneousFat !== undefined) updateData.subcutaneousFat = subcutaneousFat;
    if (skeletalMuscle !== undefined) updateData.skeletalMuscle = skeletalMuscle;
    if (proteinMass !== undefined) updateData.proteinMass = proteinMass;
    if (notes !== undefined) updateData.notes = notes;
    if (date) updateData.date = new Date(date);

    const entry = await prisma.weightEntry.update({
      where: { id: req.params.id },
      data: updateData,
    });

    console.log(`[Entry] Updated: ${entry.id}`);
    res.json(entry);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// Delete entry (requires API key)
app.delete('/api/entries/:id', authenticateApiKey, async (req, res) => {
  try {
    await prisma.weightEntry.delete({
      where: { id: req.params.id },
    });

    console.log(`[Entry] Deleted: ${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// ============= CLI Commands =============

// These would be run via CLI, not HTTP in production
export const cli = {
  async resetApiKey() {
    const newApiKey = `wt_${randomBytes(32).toString('hex')}`;
    const apiKeyHash = await bcrypt.hash(newApiKey, 10);
    await prisma.config.updateMany({
      data: { apiKeyHash },
    });
    console.log(`New API Key: ${newApiKey}`);
    console.log('⚠️  IMPORTANT: Save this securely! API keys are hashed and cannot be retrieved.');
    return newApiKey;
  },

  async showConfig() {
    const config = await prisma.config.findFirst();
    if (config) {
      console.log(`User: ${config.userName}`);
      console.log(`API Key: [HASHED - cannot be displayed]`);
      console.log(`Created: ${config.createdAt}`);
    } else {
      console.log('Not configured');
    }
    return config;
  },

  async deleteConfig() {
    await prisma.config.deleteMany();
    console.log('Configuration deleted. Restart to setup again.');
  },
};

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏋️ Open-Weight API running on http://0.0.0.0:${PORT}`);
});

export default app;
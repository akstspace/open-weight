// Configuration types
export interface AppConfig {
  configured: boolean;
  userName: string | null;
  age: number | null;
  height: number | null;
  sex: string | null;
}

// API base URL - empty for same-origin requests
const API_BASE = '';

// Fetch configuration status
export const fetchConfigStatus = async (): Promise<AppConfig> => {
  const response = await fetch(`${API_BASE}/api/config/status`);
  if (!response.ok) {
    throw new Error('Failed to fetch configuration');
  }
  return response.json();
};

// Setup the application
export const setupApp = async ({
  userName,
  birthday,
  height,
  sex,
}: {
  userName: string;
  birthday: string;
  height: number;
  sex?: string;
}): Promise<{
  success: boolean;
  userName: string;
  apiKey: string;
}> => {
  // Validate required fields
  if (!userName || userName.trim().length === 0) {
    throw new Error('User name is required');
  }
  
  if (!birthday) {
    throw new Error('Birthday is required');
  }
  
  if (!height || height <= 0) {
    throw new Error('Height is required');
  }

  const response = await fetch(`${API_BASE}/api/config/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, birthday, height, sex }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Setup failed');
  }
  
  return response.json();
};

// Weight entry types (matches Prisma schema)
export interface WeightEntryAPI {
  id: string;
  date: string;
  weight: number;
  bodyFat: number | null;
  muscleMass: number | null;
  bmi: number | null;
  bodyWater: number | null;
  visceralFat: number | null;
  boneMass: number | null;
  proteinMass: number | null;
  subcutaneousFat: number | null;
  skeletalMuscle: number | null;
  bmr: number | null;
  bodyAge: number | null;
  notes: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedEntriesAPI {
  entries: WeightEntryAPI[];
  total: number;
  limit: number;
  offset: number;
}

export interface StatsAPI {
  totalEntries: number;
  latest?: {
    weight: number;
    date: string;
    bodyFat: number | null;
    muscleMass: number | null;
    bmi: number | null;
    bodyWater: number | null;
  };
  stats?: {
    min: number;
    max: number;
    avg: number;
    weeklyChange: number | null;
  };
}

// Fetch all entries
export const fetchEntriesAPI = async (
  limit = 50,
  offset = 0,
  from?: string,
  to?: string
): Promise<PaginatedEntriesAPI> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  
  const response = await fetch(`${API_BASE}/api/entries?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch entries');
  }
  return response.json();
};

// Fetch statistics
export const fetchStatsAPI = async (): Promise<StatsAPI> => {
  const response = await fetch(`${API_BASE}/api/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
};

// Fetch single entry
export const fetchEntryAPI = async (id: string): Promise<WeightEntryAPI> => {
  const response = await fetch(`${API_BASE}/api/entries/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch entry');
  }
  return response.json();
};

// Delete entry (requires API key)
export const deleteEntryAPI = async (id: string, apiKey: string): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_BASE}/api/entries/${id}`, {
    method: 'DELETE',
    headers: {
      'X-API-Key': apiKey,
    },
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete entry');
  }
  
  return response.json();
};

// Check if API key exists in localStorage
export const hasApiKey = (): boolean => {
  return !!localStorage.getItem('wt_api_key');
};

// Get API key from localStorage
export const getApiKey = (): string | null => {
  return localStorage.getItem('wt_api_key');
};

-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "userName" TEXT NOT NULL,
    "apiKeyHash" TEXT NOT NULL,
    "birthday" DATETIME,
    "height" REAL,
    "sex" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeightEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" REAL NOT NULL,
    "bodyFat" REAL,
    "muscleMass" REAL,
    "bmi" REAL,
    "bodyWater" REAL,
    "visceralFat" INTEGER,
    "boneMass" REAL,
    "bmr" INTEGER,
    "bodyAge" INTEGER,
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'api',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_apiKeyHash_key" ON "Config"("apiKeyHash");

-- CreateIndex
CREATE INDEX "WeightEntry_date_idx" ON "WeightEntry"("date");

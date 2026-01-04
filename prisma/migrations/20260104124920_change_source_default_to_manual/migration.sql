-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeightEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" REAL NOT NULL,
    "bodyFat" REAL,
    "muscleMass" REAL,
    "bodyWater" REAL,
    "visceralFat" INTEGER,
    "boneMass" REAL,
    "subcutaneousFat" REAL,
    "skeletalMuscle" REAL,
    "proteinMass" REAL,
    "bmi" REAL,
    "bmr" INTEGER,
    "bodyAge" INTEGER,
    "fatMass" REAL,
    "fatFreeBodyWeight" REAL,
    "muscleRate" REAL,
    "protein" REAL,
    "waterWeight" REAL,
    "idealBodyWeight" REAL,
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WeightEntry" ("bmi", "bmr", "bodyAge", "bodyFat", "bodyWater", "boneMass", "createdAt", "date", "fatFreeBodyWeight", "fatMass", "id", "idealBodyWeight", "muscleMass", "muscleRate", "notes", "protein", "proteinMass", "skeletalMuscle", "source", "subcutaneousFat", "updatedAt", "visceralFat", "waterWeight", "weight") SELECT "bmi", "bmr", "bodyAge", "bodyFat", "bodyWater", "boneMass", "createdAt", "date", "fatFreeBodyWeight", "fatMass", "id", "idealBodyWeight", "muscleMass", "muscleRate", "notes", "protein", "proteinMass", "skeletalMuscle", "source", "subcutaneousFat", "updatedAt", "visceralFat", "waterWeight", "weight" FROM "WeightEntry";
DROP TABLE "WeightEntry";
ALTER TABLE "new_WeightEntry" RENAME TO "WeightEntry";
CREATE INDEX "WeightEntry_date_idx" ON "WeightEntry"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

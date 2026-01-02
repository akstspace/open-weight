import { WeightData } from "@/services/weightApi";
import WeightChart from "./WeightChart";
import { TrendingDown, TrendingUp, Clock } from "lucide-react";

interface WeightOverviewProps {
  data: WeightData;
}

const WeightOverview = ({ data }: WeightOverviewProps) => {
  const { latestEntry, weeklyChange, entries } = data;
  const weightInLbs = (latestEntry.weight.value * 2.20462).toFixed(1);
  const isLoss = weeklyChange <= 0;

  return (
    <div className="flex h-full flex-col rounded-xl bg-card p-4 sm:p-6">
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Weight Overview
        </h2>
      </div>

      <div className="mb-3 sm:mb-4">
        <span className="font-mono text-4xl sm:text-5xl font-bold text-foreground">
          {latestEntry.weight.value}
        </span>
        <span className="ml-1 text-xl sm:text-2xl font-light text-muted-foreground">kg</span>
      </div>

      <div className="flex-1 min-h-[180px] sm:min-h-[200px]">
        <WeightChart entries={entries} />
      </div>

      <div className="mt-3 sm:mt-4 border-t border-border pt-3 sm:pt-4">
        <div className="mb-2">
          <span className="font-mono text-xl sm:text-2xl font-bold text-foreground">
            {latestEntry.weight.value} kg
          </span>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {weightInLbs} lbs / {latestEntry.bodyFat.value}% BF
          </p>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-lg bg-metric p-3 sm:p-4 touch-active">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Weekly Change
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 sm:gap-2">
            <span className={`font-mono text-lg sm:text-2xl font-bold ${isLoss ? 'text-green-400' : 'text-red-400'}`}>
              {weeklyChange > 0 ? '+' : ''}{weeklyChange}kg
            </span>
            {isLoss ? (
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            ) : (
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
            )}
          </div>
        </div>
        <div className="rounded-lg bg-metric p-3 sm:p-4 touch-active">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Time
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 sm:gap-2">
            <span className="font-mono text-lg sm:text-2xl font-bold text-foreground">
              {weeklyChange > 0 ? '+' : ''}{weeklyChange}kg
            </span>
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightOverview;

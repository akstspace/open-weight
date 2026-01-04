import { WeightEntry } from "@/services/weightApi";
import MetricCard from "./MetricCard";
import { Scale, User, Activity, Flame } from "lucide-react";

interface KeyMetricsProps {
  entry: WeightEntry;
}

const KeyMetrics = ({ entry }: KeyMetricsProps) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Key Metrics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
        <MetricCard
          label="Weight"
          value={`${entry.weight.value}kg`}
          icon={<Scale className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <MetricCard
          label="Body Fat"
          value={`${entry.bodyFat.value}%`}
          icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <MetricCard
          label="BMI"
          value={`${entry.bmi.value}`}
          icon={<Activity className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <MetricCard
          label="BMR"
          value={`${entry.bmr.value}kcal`}
          icon={<Flame className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
      </div>
    </div>
  );
};

export default KeyMetrics;

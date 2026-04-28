import { WeightEntry } from "@/services/weightApi";
import MetricCard from "./MetricCard";
import { Scale, User, Activity, Flame } from "lucide-react";

interface KeyMetricsProps {
  entry: WeightEntry;
}

const KeyMetrics = ({ entry }: KeyMetricsProps) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <span className="label-caps text-muted-foreground">
        Key Metrics
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
        <MetricCard
          label="Weight"
          value={`${entry.weight.value.toFixed(2)}kg`}
          icon={<Scale className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <MetricCard
          label="Body Fat"
          value={`${entry.bodyFat.value.toFixed(2)}%`}
          icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <MetricCard
          label="BMI"
          value={`${entry.bmi.value.toFixed(2)}`}
          icon={<Activity className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <MetricCard
          label="BMR"
          value={`${entry.bmr.value.toFixed(0)}kcal`}
          icon={<Flame className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
      </div>
    </div>
  );
};

export default KeyMetrics;

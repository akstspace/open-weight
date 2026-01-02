import { WeightEntry } from "@/services/weightApi";
import MetricCard from "./MetricCard";
import { User, Dumbbell, Scale, Droplets } from "lucide-react";

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
          label="Body Fat"
          value={`${entry.bodyFat.value}%`}
          subtitle={`${entry.bodyFat.value}% / ${entry.bodyFat.value}% BF`}
          icon={<User className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <MetricCard
          label="Muscle Mass"
          value={`${entry.muscleMass.value}kg`}
          subtitle={`${entry.muscleMass.value}kg / ${entry.bodyFat.value}% BF`}
          icon={<Dumbbell className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <MetricCard
          label="BMI"
          value={`${entry.bmi.value}`}
          subtitle={`${entry.bmi.value}kg / ${entry.bodyFat.value}% BF`}
          icon={<Scale className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <MetricCard
          label="Water"
          value={`${entry.bodyWater.value}%`}
          subtitle={`${entry.bodyWater.value}% / ${entry.bodyWater.value}% BF`}
          icon={<Droplets className="h-5 w-5 sm:h-6 sm:w-6" />}
        />
      </div>
    </div>
  );
};

export default KeyMetrics;

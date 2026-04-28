import { WeightEntry } from "@/services/weightApi";
import { Scale, User, Activity, Flame } from "lucide-react";

interface KeyMetricsProps {
  entry: WeightEntry;
}

const KeyMetrics = ({ entry }: KeyMetricsProps) => {
  const metrics = [
    { label: "Weight", value: `${entry.weight.value.toFixed(2)}kg`, icon: <Scale className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { label: "Body Fat", value: `${entry.bodyFat.value.toFixed(2)}%`, icon: <User className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { label: "BMI", value: `${entry.bmi.value.toFixed(2)}`, icon: <Activity className="h-5 w-5 sm:h-6 sm:w-6" /> },
    { label: "BMR", value: `${entry.bmr.value.toFixed(0)}kcal`, icon: <Flame className="h-5 w-5 sm:h-6 sm:w-6" /> },
  ];

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-4 sm:p-6">
      <span className="label-caps text-muted-foreground mb-4">
        Key Metrics
      </span>
      <div className="flex flex-col divide-y divide-border">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between py-3 sm:py-4 first:pt-0"
          >
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground opacity-70">
                {metric.icon}
              </div>
              <span className="label-caps text-muted-foreground">
                {metric.label}
              </span>
            </div>
            <span className="font-mono text-xl sm:text-2xl font-bold text-foreground">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyMetrics;

import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
}

const MetricCard = ({ label, value, subtitle, icon }: MetricCardProps) => {
  return (
    <div className="group relative overflow-hidden border border-border bg-metric p-3 sm:p-4 touch-active transition-colors hover:bg-metric-hover">
      <div className="flex items-start justify-between">
        <span className="label-caps text-muted-foreground">
          {label}
        </span>
        <div className="text-foreground opacity-60 group-hover:text-primary group-hover:opacity-100 transition-all">
          {icon}
        </div>
      </div>
      <div className="mt-1 sm:mt-2">
        <span className="text-xl sm:text-3xl font-bold text-foreground tracking-tight">{value}</span>
      </div>
      {subtitle ? (
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
      ) : null}
    </div>
  );
};

export default MetricCard;
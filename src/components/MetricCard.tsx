import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
}

const MetricCard = ({ label, value, subtitle, icon }: MetricCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-metric p-3 sm:p-4 touch-active smooth-transition hover:bg-metric-hover">
      <div className="flex items-start justify-between">
        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="text-primary opacity-70 group-hover:opacity-100 smooth-transition">
          {icon}
        </div>
      </div>
      <div className="mt-1 sm:mt-2">
        <span className="text-xl sm:text-3xl font-bold text-primary">{value}</span>
      </div>
      <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
    </div>
  );
};

export default MetricCard;

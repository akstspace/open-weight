import { RatingLevel } from "@/services/weightApi";
import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating?: RatingLevel;
}

const RatingBadge = ({ rating }: RatingBadgeProps) => {
  if (!rating) return null;

  const config: Record<RatingLevel, { label: string; className: string }> = {
    excellent: { label: 'Excellent', className: 'text-success' },
    standard: { label: 'Standard', className: 'text-foreground' },
    high: { label: 'High', className: 'text-warning' },
    'too-high': { label: 'Too High', className: 'text-destructive' },
    low: { label: 'Low', className: 'text-muted-foreground' },
  };

  const { label, className } = config[rating];

  return (
    <span className={cn("text-sm font-medium", className)}>
      {label}
    </span>
  );
};

export default RatingBadge;

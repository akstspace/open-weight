import { RatingLevel } from "@/services/weightApi";
import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating?: RatingLevel;
}

const RatingBadge = ({ rating }: RatingBadgeProps) => {
  if (!rating) return null;

  const config: Record<RatingLevel, { label: string; className: string }> = {
    excellent: { label: 'Excellent', className: 'text-green-400' },
    standard: { label: 'Standard', className: 'text-amber-400' },
    high: { label: 'High', className: 'text-orange-400' },
    'too-high': { label: 'Too High', className: 'text-red-400' },
    low: { label: 'Low', className: 'text-blue-400' },
  };

  const { label, className } = config[rating];

  return (
    <span className={cn("text-sm font-medium", className)}>
      {label}
    </span>
  );
};

export default RatingBadge;

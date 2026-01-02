import { getMetricKey, getMetricRange, MetricRange } from "@/data/metricRanges";
import { cn } from "@/lib/utils";

interface RangeIndicatorProps {
  metricLabel: string;
  value: number;
  gender?: 'male' | 'female';
}

const RangeIndicator = ({ metricLabel, value, gender = 'male' }: RangeIndicatorProps) => {
  const metricKey = getMetricKey(metricLabel);
  const range = getMetricRange(metricKey, gender);
  
  if (!range) return null;

  // Calculate the full range
  const allRanges = [range.low, range.standard, range.excellent, range.high, range.tooHigh].filter(Boolean);
  const minValue = Math.min(...allRanges.map(r => r!.min));
  const maxValue = Math.max(...allRanges.map(r => r!.max));
  const totalRange = maxValue - minValue;

  // Calculate position percentage for the current value
  const clampedValue = Math.max(minValue, Math.min(maxValue, value));
  const positionPercent = ((clampedValue - minValue) / totalRange) * 100;

  // Build segments with their ranges
  const segments: { key: string; range: { min: number; max: number }; color: string; label: string }[] = [];
  
  if (range.low) segments.push({ key: 'low', range: range.low, color: 'bg-blue-400', label: 'L' });
  if (range.standard) segments.push({ key: 'standard', range: range.standard, color: 'bg-green-400', label: 'S' });
  if (range.excellent) segments.push({ key: 'excellent', range: range.excellent, color: 'bg-emerald-500', label: 'Excellent' });
  if (range.high) segments.push({ key: 'high', range: range.high, color: 'bg-orange-400', label: 'H' });
  if (range.tooHigh) segments.push({ key: 'tooHigh', range: range.tooHigh, color: 'bg-red-400', label: 'TH' });

  // Sort segments by their min value
  segments.sort((a, b) => a.range.min - b.range.min);

  return (
    <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3 animate-in-fade">
      {/* Range thresholds */}
      <div className="relative h-4 text-[10px] sm:text-xs text-muted-foreground">
        {/* First threshold - start of first segment */}
        <span 
          className="absolute"
          style={{ left: '0%' }}
        >
          {minValue}
        </span>
        
        {/* All segment end points */}
        {segments.map((segment, index) => {
          const position = ((segment.range.max - minValue) / totalRange) * 100;
          const isLast = index === segments.length - 1;
          return (
            <span 
              key={segment.key} 
              className={isLast ? "absolute -translate-x-full" : "absolute -translate-x-1/2"}
              style={{ left: `${position}%` }}
            >
              {segment.range.max}
            </span>
          );
        })}
      </div>

      {/* Range bar */}
      <div className="relative">
        <div className="flex h-1.5 sm:h-2 overflow-hidden rounded-full">
          {segments.map((segment) => {
            const widthPercent = ((segment.range.max - segment.range.min) / totalRange) * 100;
            return (
              <div
                key={segment.key}
                className={cn(segment.color)}
                style={{ width: `${widthPercent}%` }}
              />
            );
          })}
        </div>
        
        {/* Current value indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-background bg-foreground shadow-lg smooth-transition"
          style={{ left: `${positionPercent}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[10px] sm:text-xs font-medium">
        {segments.map((segment) => {
          const widthPercent = ((segment.range.max - segment.range.min) / totalRange) * 100;
          return (
            <span
              key={segment.key}
              className="text-muted-foreground"
              style={{ width: `${widthPercent}%`, textAlign: 'center' }}
            >
              {segment.label}
            </span>
          );
        })}
      </div>

      {/* Description */}
      <div className="pt-2 border-t border-border/50">
        <p className="text-[10px] sm:text-xs text-muted-foreground">{range.description}</p>
      </div>
    </div>
  );
};

export default RangeIndicator;

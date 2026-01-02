import { metricRanges, getMetricKey, MetricRange } from "@/data/metricRanges";
import { cn } from "@/lib/utils";

interface RangeIndicatorProps {
  metricLabel: string;
  value: number;
}

const RangeIndicator = ({ metricLabel, value }: RangeIndicatorProps) => {
  const metricKey = getMetricKey(metricLabel);
  const range = metricRanges[metricKey];
  
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
  
  if (range.low) segments.push({ key: 'low', range: range.low, color: 'bg-blue-400', label: 'Low' });
  if (range.standard) segments.push({ key: 'standard', range: range.standard, color: 'bg-green-400', label: 'Standard' });
  if (range.excellent) segments.push({ key: 'excellent', range: range.excellent, color: 'bg-emerald-500', label: 'Excellent' });
  if (range.high) segments.push({ key: 'high', range: range.high, color: 'bg-orange-400', label: 'High' });
  if (range.tooHigh) segments.push({ key: 'tooHigh', range: range.tooHigh, color: 'bg-red-400', label: 'Too High' });

  // Sort segments by their min value
  segments.sort((a, b) => a.range.min - b.range.min);

  return (
    <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3 animate-in-fade">
      {/* Range thresholds */}
      <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground px-1">
        {segments.slice(0, -1).map((segment, index) => (
          <span key={segment.key} style={{ 
            position: 'relative',
            left: `${((segment.range.max - minValue) / totalRange) * 100 - (index * 20)}%`
          }}>
            {segment.range.max}
          </span>
        ))}
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

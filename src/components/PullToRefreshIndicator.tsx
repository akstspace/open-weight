import { Loader2, ArrowDown } from "lucide-react";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  isTriggered: boolean;
  progress: number;
}

const PullToRefreshIndicator = ({
  pullDistance,
  isRefreshing,
  isTriggered,
  progress,
}: PullToRefreshIndicatorProps) => {
  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div
      className="absolute left-0 right-0 top-0 flex items-center justify-center overflow-hidden z-10"
      style={{
        height: isRefreshing ? 48 : pullDistance,
      }}
    >
      <div
        className={`flex items-center justify-center rounded-full border border-border bg-secondary smooth-transition ${
          isTriggered ? 'bg-background' : ''
        }`}
        style={{
          width: 36,
          height: 36,
          opacity: Math.min(progress, 1),
          transform: `scale(${0.5 + progress * 0.5}) rotate(${progress * 180}deg)`,
        }}
      >
        {isRefreshing ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <ArrowDown
            className={`h-5 w-5 smooth-transition-fast ${
              isTriggered ? 'text-primary' : 'text-muted-foreground'
            }`}
            style={{
              transform: isTriggered ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PullToRefreshIndicator;

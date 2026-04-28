import { Skeleton } from "@/components/ui/skeleton";

interface DataLogSkeletonProps {
  count?: number;
}

const DataLogSkeleton = ({ count = 6 }: DataLogSkeletonProps) => {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-in-fade"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between rounded-sm border border-border bg-secondary/50 px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12 sm:w-16" />
              <Skeleton className="h-4 w-24 sm:w-32" />
            </div>
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataLogSkeleton;

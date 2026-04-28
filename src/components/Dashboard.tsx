import { useQuery } from "@tanstack/react-query";
import { fetchWeightData } from "@/services/weightDataService";
import { fetchConfigStatus } from "@/services/configApi";
import WeightOverview from "./WeightOverview";
import KeyMetrics from "./KeyMetrics";
import DataLog from "./DataLog";
import EmptyState from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weightData"],
    queryFn: fetchWeightData,
    retry: 1,
    refetchInterval: (query) => {
      if (query.state.error) return false;
      return 30000;
    },
  });

  const { data: config } = useQuery({
    queryKey: ["configStatus"],
    queryFn: fetchConfigStatus,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-[600px] rounded-lg border border-border bg-secondary" />
        <Skeleton className="h-[600px] rounded-lg border border-border bg-secondary" />
        <Skeleton className="h-[600px] rounded-lg border border-border bg-secondary" />
      </div>
    );
  }

  if (error) {
    if (error instanceof Error && error.message.includes('No weight entries found')) {
      return <EmptyState userName={config?.userName || undefined} />;
    }

    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">Failed to load weight data</p>
      </div>
    );
  }

  if (!data) {
    return <EmptyState userName={config?.userName || undefined} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
      <div className="animate-in-slide-up" style={{ animationDelay: "0ms" }}>
        <WeightOverview data={data} />
      </div>
      <div className="animate-in-slide-up" style={{ animationDelay: "80ms" }}>
        <KeyMetrics entry={data.latestEntry} />
      </div>
      <div className="animate-in-slide-up" style={{ animationDelay: "160ms" }}>
        <DataLog entries={data.entries} />
      </div>
    </div>
  );
};

export default Dashboard;

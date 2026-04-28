import { useState, useCallback } from "react";
import { useInfiniteQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import { WeightEntry } from "@/services/weightApi";
import { fetchPaginatedEntries } from "@/services/weightDataService";
import { fetchConfigStatus, hasApiKey } from "@/services/configApi";
import DataLogEntry from "./DataLogEntry";
import EntryDetailSheet from "./EntryDetailSheet";
import DataLogSkeleton from "./DataLogSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { hapticFeedback } from "@/hooks/useHaptics";

interface DataLogProps {
  entries: WeightEntry[];
}

const DataLog = ({ entries: initialEntries }: DataLogProps) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  const apiKeyExists = hasApiKey();

  const { data: userConfig } = useQuery({
    queryKey: ['userConfig'],
    queryFn: fetchConfigStatus,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['paginatedEntries'],
    queryFn: ({ pageParam = 1 }) => fetchPaginatedEntries(pageParam, 10),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 30000,
  });

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['paginatedEntries'] });
    await queryClient.invalidateQueries({ queryKey: ['weightData'] });
    await refetch();
  }, [queryClient, refetch]);

  const allEntries = data?.pages.flatMap(page => page.entries) ?? initialEntries;

  const handleEntryClick = useCallback((entryId: string) => {
    hapticFeedback('light');
    setSelectedEntryId(entryId);
    setSheetOpen(true);
  }, []);

  const handleEntryDeleted = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleLoadMore = useCallback(() => {
    hapticFeedback('selection');
    fetchNextPage();
  }, [fetchNextPage]);

  return (
    <>
      <div className="flex flex-col rounded-lg border border-border bg-card p-4 sm:p-6">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <span className="label-caps text-muted-foreground">
            Data Log
          </span>
          <span className="label-caps text-muted-foreground">
            {data?.pages[0]?.total ? `${allEntries.length} of ${data.pages[0].total}` : 'Date'}
          </span>
        </div>

        <ScrollArea className="h-[320px] sm:h-[420px] pr-2 sm:pr-4">
            {isLoading ? (
              <DataLogSkeleton count={8} />
            ) : isError ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                Failed to load entries
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {allEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="animate-in-fade smooth-transition"
                    style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
                  >
                    <DataLogEntry
                      entry={entry}
                      onClick={() => handleEntryClick(entry.id)}
                      hasApiKey={apiKeyExists}
                      onDeleted={handleEntryDeleted}
                    />
                  </div>
                ))}

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="pt-2 sm:pt-3 animate-in-fade" style={{ animationDelay: '200ms' }}>
                    <Button
                      variant="ghost"
                      className="w-full h-10 sm:h-11 gap-2 text-xs font-medium text-muted-foreground smooth-transition touch-subtle hover:bg-secondary hover:text-primary sm:text-sm"
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span>Load More</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Loading indicator for next page */}
                {isFetchingNextPage && (
                  <div className="py-2 animate-in-fade">
                    <DataLogSkeleton count={3} />
                  </div>
                )}
              </div>
            )}
        </ScrollArea>
      </div>

      <EntryDetailSheet
        entryId={selectedEntryId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        gender={(userConfig?.sex === 'female' ? 'female' : 'male') as 'male' | 'female'}
      />
    </>
  );
};

export default DataLog;

import { WeightEntry } from "@/services/weightApi";
import { format, parseISO } from "date-fns";
import { ChevronRight } from "lucide-react";
import { memo } from "react";

interface DataLogEntryProps {
  entry: WeightEntry;
  onClick: () => void;
}

const DataLogEntry = memo(({ entry, onClick }: DataLogEntryProps) => {
  const formattedDate = format(parseISO(entry.date), "MMM dd").toUpperCase();

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 sm:px-4 py-2.5 sm:py-3 text-left touch-active smooth-transition hover:bg-secondary hover:border-primary/30 group active:bg-secondary/80"
    >
      <span className="font-medium text-sm sm:text-base text-foreground">
        {formattedDate}: {entry.weight.value}kg, {entry.bodyFat.value}% BF
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary smooth-transition group-active:translate-x-0.5" />
    </button>
  );
});

DataLogEntry.displayName = 'DataLogEntry';

export default DataLogEntry;

import { WeightEntry } from "@/services/weightApi";
import { format, parseISO } from "date-fns";
import { ChevronRight, Trash2 } from "lucide-react";
import { memo, useState } from "react";
import { deleteEntryAPI, getApiKey } from "@/services/configApi";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DataLogEntryProps {
  entry: WeightEntry;
  onClick: () => void;
  hasApiKey?: boolean;
  onDeleted?: () => void;
}

const DataLogEntry = memo(({ entry, onClick, hasApiKey = false, onDeleted }: DataLogEntryProps) => {
  const formattedDate = format(parseISO(entry.date), "MMM dd").toUpperCase();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      toast({
        title: "Error",
        description: "API key not found",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await deleteEntryAPI(entry.id, apiKey);
      toast({
        title: "Success",
        description: "Entry deleted successfully",
      });
      setShowDeleteDialog(false);
      onDeleted?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete entry",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={onClick}
        className="group flex w-full items-center justify-between rounded-sm border border-border bg-secondary px-3 py-2.5 text-left smooth-transition hover:border-primary/20 hover:bg-secondary/80 active:bg-secondary sm:px-4 sm:py-3"
      >
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm sm:text-base text-foreground">
            {formattedDate}: {entry.weight.value.toFixed(2)}kg, {entry.bodyFat.value.toFixed(2)}% BF
          </span>
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-sm font-medium w-fit",
            entry.source === 'automated'
              ? "bg-success/10 text-success"
              : "bg-primary/10 text-primary"
          )}>
            {entry.source === 'automated' ? 'Automated' : 'Manual'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasApiKey && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-sm hover:bg-destructive/10 text-muted-foreground hover:text-destructive smooth-transition"
              aria-label="Delete entry"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground smooth-transition group-hover:text-primary group-active:translate-x-0.5" />
        </div>
      </button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry from {formattedDate}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

DataLogEntry.displayName = 'DataLogEntry';

export default DataLogEntry;

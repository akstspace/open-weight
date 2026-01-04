import { useState } from "react";
import { WeightEntry } from "@/services/weightApi";
import { fetchWeightEntryById } from "@/services/weightDataService";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { format, parseISO } from "date-fns";
import RatingBadge from "./RatingBadge";
import RangeIndicator from "./RangeIndicator";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface EntryDetailSheetProps {
  entryId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gender?: 'male' | 'female';
}

const MetricRow = ({ label, value, unit, rating, gender }: {
  label: string;
  value: number;
  unit: string;
  rating?: WeightEntry['weight']['rating'];
  gender?: 'male' | 'female';
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasRating = rating !== undefined && rating !== null;

  // If no rating, show as simple info row without dropdown
  if (!hasRating) {
    return (
      <div className="flex items-center justify-between py-2.5 sm:py-3 px-2 -mx-2">
        <span className="text-sm sm:text-base text-muted-foreground text-left">{label}</span>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-sm sm:text-base font-semibold text-foreground">
            {value}<span className="text-xs sm:text-sm text-muted-foreground">{unit}</span>
          </span>
          <div className="w-14 sm:w-16"></div>
          <div className="w-3.5 sm:w-4"></div>
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full touch-subtle">
        <div className="flex items-center justify-between py-2.5 sm:py-3 hover:bg-secondary/30 px-2 -mx-2 rounded smooth-transition">
          <span className="text-sm sm:text-base text-muted-foreground text-left">{label}</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-sm sm:text-base font-semibold text-foreground">
              {value}<span className="text-xs sm:text-sm text-muted-foreground">{unit}</span>
            </span>
            <div className="w-14 sm:w-16 text-right">
              <RatingBadge rating={rating} />
            </div>
            <ChevronDown className={cn(
              "h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground smooth-transition",
              isOpen && "rotate-180"
            )} />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-3 px-2 -mx-2">
          <RangeIndicator metricLabel={label} value={value} gender={gender} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const EntryDetailSheet = ({ entryId, open, onOpenChange, gender = 'male' }: EntryDetailSheetProps) => {
  const { data: entry, isLoading } = useQuery({
    queryKey: ["weightEntry", entryId],
    queryFn: () => fetchWeightEntryById(entryId!),
    enabled: !!entryId && open,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg border-border bg-card p-0">
        <div className="p-4 sm:p-6 pb-0">
          <SheetHeader className="pb-3 sm:pb-4">
            <SheetTitle className="text-lg sm:text-xl text-foreground">Body Composition</SheetTitle>
          </SheetHeader>
        </div>
        
        {isLoading ? (
          <div className="space-y-4 p-4 sm:p-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : entry ? (
          <ScrollArea className="h-[calc(100vh-80px)] px-4 sm:px-6">
            {/* Header Summary */}
            <div className="mb-4 sm:mb-6 rounded-lg bg-secondary p-3 sm:p-4 animate-in-bounce">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {entry.time} • {format(parseISO(entry.date), "MMM dd, yyyy")}
                </p>
                <span className={cn(
                  "text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium",
                  entry.source === 'automated'
                    ? "bg-green-500/10 text-green-500"
                    : "bg-blue-500/10 text-blue-500"
                )}>
                  {entry.source === 'automated' ? 'Automated' : 'Manual'}
                </span>
              </div>
              <div className="mt-2 sm:mt-3 grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center">
                  <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                    {entry.weight.value}<span className="text-xs sm:text-sm">kg</span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Weight</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                    {entry.bmi.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">BMI</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                    {entry.bodyFat.value}<span className="text-xs sm:text-sm">%</span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Body Fat</p>
                </div>
              </div>
            </div>

            {/* Info text */}
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 px-1 animate-in-fade" style={{ animationDelay: '100ms' }}>
              Tap any metric to see reference ranges and calculation source
            </p>

            {/* Metrics */}
            <div className="rounded-lg border border-border bg-background/50 px-3 sm:px-4 animate-in-slide-up" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center justify-between border-b border-border py-2.5 sm:py-3 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span>Index</span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span>Value</span>
                  <span className="w-14 sm:w-16 text-right">Status</span>
                  <span className="w-3.5 sm:w-4"></span>
                </div>
              </div>

              <MetricRow label="Weight" value={entry.weight.value} unit="kg" rating={entry.weight.rating} gender={gender} />
              <Separator className="bg-border/50" />
              <MetricRow label="Body Fat" value={entry.bodyFat.value} unit="%" rating={entry.bodyFat.rating} gender={gender} />
              <Separator className="bg-border/50" />
              <MetricRow label="BMI" value={entry.bmi.value} unit="" rating={entry.bmi.rating} gender={gender} />
              <Separator className="bg-border/50" />
              <MetricRow label="Fat-free Body Weight" value={entry.fatFreeBodyWeight.value} unit="kg" rating={entry.fatFreeBodyWeight.rating} gender={gender} />
              
              {entry.fatMass.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Fat Mass" value={entry.fatMass.value} unit="kg" rating={entry.fatMass.rating} gender={gender} />
                </>
              )}
              {entry.muscleMass.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Muscle Mass" value={entry.muscleMass.value} unit="kg" rating={entry.muscleMass.rating} gender={gender} />
                </>
              )}
              {entry.muscleRate.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Muscle Rate" value={entry.muscleRate.value} unit="%" rating={entry.muscleRate.rating} gender={gender} />
                </>
              )}
              {entry.skeletalMuscle.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Skeletal Muscle" value={entry.skeletalMuscle.value} unit="%" rating={entry.skeletalMuscle.rating} gender={gender} />
                </>
              )}
              {entry.boneMass.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Bone Mass" value={entry.boneMass.value} unit="kg" rating={entry.boneMass.rating} gender={gender} />
                </>
              )}
              {entry.proteinMass.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Protein Mass" value={entry.proteinMass.value} unit="kg" rating={entry.proteinMass.rating} gender={gender} />
                </>
              )}
              {entry.protein.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Protein" value={entry.protein.value} unit="%" rating={entry.protein.rating} gender={gender} />
                </>
              )}
              {entry.waterWeight.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Water Weight" value={entry.waterWeight.value} unit="kg" rating={entry.waterWeight.rating} gender={gender} />
                </>
              )}
              {entry.bodyWater.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Body Water" value={entry.bodyWater.value} unit="%" rating={entry.bodyWater.rating} gender={gender} />
                </>
              )}
              {entry.subcutaneousFat.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Subcutaneous Fat" value={entry.subcutaneousFat.value} unit="%" rating={entry.subcutaneousFat.rating} gender={gender} />
                </>
              )}
              {entry.visceralFat.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Visceral Fat" value={entry.visceralFat.value} unit="" rating={entry.visceralFat.rating} gender={gender} />
                </>
              )}
              {entry.bmr.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="BMR" value={entry.bmr.value} unit="kcal" rating={entry.bmr.rating} gender={gender} />
                </>
              )}
              {entry.bodyAge.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Body Age" value={entry.bodyAge.value} unit="" rating={entry.bodyAge.rating} gender={gender} />
                </>
              )}
              {entry.idealBodyWeight.value > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <MetricRow label="Ideal Body Weight" value={entry.idealBodyWeight.value} unit="kg" rating={entry.idealBodyWeight.rating} gender={gender} />
                </>
              )}
            </div>

            {/* Footer note */}
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4 px-1 pb-6">
              Reference ranges are based on gender-specific medical standards from ACE, ACSM, WHO, and clinical research. Ranges are calibrated for {gender === 'female' ? 'female' : 'male'} adults.
            </p>
          </ScrollArea>
        ) : (
          <div className="flex h-40 items-center justify-center p-6">
            <p className="text-muted-foreground">Entry not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EntryDetailSheet;

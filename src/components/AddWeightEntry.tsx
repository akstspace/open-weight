import { useState } from "react";
import { Plus, Key, Check, AlertCircle, Info } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useToast } from "@/hooks/use-toast";

const API_KEY_STORAGE_KEY = "wt_api_key";

const AddWeightEntry = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
  });
  const [showApiKey, setShowApiKey] = useState(!apiKey);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    weight: "",
    bodyFat: "",
    muscleMass: "",
    bodyWater: "",
    visceralFat: "",
    boneMass: "",
    subcutaneousFat: "",
    skeletalMuscle: "",
    proteinMass: "",
    bodyAge: "",
    notes: "",
  });

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value) {
      localStorage.setItem(API_KEY_STORAGE_KEY, value);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || "";

    if (!currentApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key to add entries.",
        variant: "destructive",
      });
      setShowApiKey(true);
      return;
    }

    if (!formData.weight) {
      toast({
        title: "Weight Required",
        description: "Please enter your weight.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: {
        weight: number;
        bodyFat?: number;
        muscleMass?: number;
        bodyWater?: number;
        visceralFat?: number;
        boneMass?: number;
        subcutaneousFat?: number;
        skeletalMuscle?: number;
        proteinMass?: number;
        bodyAge?: number;
        notes?: string;
        source: string;
      } = {
        weight: parseFloat(formData.weight),
        source: 'manual',
      };

      if (formData.bodyFat) payload.bodyFat = parseFloat(formData.bodyFat);
      if (formData.muscleMass) payload.muscleMass = parseFloat(formData.muscleMass);
      if (formData.bodyWater) payload.bodyWater = parseFloat(formData.bodyWater);
      if (formData.visceralFat) payload.visceralFat = parseInt(formData.visceralFat);
      if (formData.boneMass) payload.boneMass = parseFloat(formData.boneMass);
      if (formData.subcutaneousFat) payload.subcutaneousFat = parseFloat(formData.subcutaneousFat);
      if (formData.skeletalMuscle) payload.skeletalMuscle = parseFloat(formData.skeletalMuscle);
      if (formData.proteinMass) payload.proteinMass = parseFloat(formData.proteinMass);
      if (formData.bodyAge) payload.bodyAge = parseInt(formData.bodyAge);
      if (formData.notes) payload.notes = formData.notes;

      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": currentApiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add entry");
      }

      toast({
        title: "Entry Added",
        description: "Your weight entry has been saved successfully.",
      });

      setFormData({
        weight: "",
        bodyFat: "",
        muscleMass: "",
        bodyWater: "",
        visceralFat: "",
        boneMass: "",
        subcutaneousFat: "",
        skeletalMuscle: "",
        proteinMass: "",
        bodyAge: "",
        notes: "",
      });

      await queryClient.invalidateQueries({ queryKey: ['weightData'] });
      await queryClient.invalidateQueries({ queryKey: ['paginatedEntries'] });

      setIsOpen(false);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add weight entry",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-sm border border-border bg-card px-4 py-3 transition-colors hover:bg-secondary">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-muted">
              <Plus className="h-5 w-5 text-foreground" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Add Weight Entry</p>
              <p className="text-xs text-muted-foreground">Manual entry via API</p>
            </div>
          </div>
          <div className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3">
        <div className="space-y-4 rounded-sm border border-border bg-card p-4">
          {/* API Key Section */}
          {showApiKey ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiKey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Key
                </Label>
                {apiKey && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(false)}
                    className="h-7 text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Saved
                  </Button>
                )}
              </div>
              <Input
                id="apiKey"
                type="password"
                placeholder="wt_your_api_key_here"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground flex items-start gap-1">
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>
                  Stored locally in your browser. Get your key from initial setup or CLI.
                </span>
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-sm border border-border bg-secondary px-3 py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Key className="h-4 w-4" />
                <span>API Key configured</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowApiKey(true)}
                className="h-7 text-xs"
              >
                Change
              </Button>
            </div>
          )}

          {/* Weight Entry Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="weight" className="text-sm">
                  Weight (kg) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="75.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bodyFat" className="text-sm">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  placeholder="18.5"
                  value={formData.bodyFat}
                  onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="muscleMass" className="text-sm">Muscle Mass (kg)</Label>
                <Input
                  id="muscleMass"
                  type="number"
                  step="0.1"
                  placeholder="35.2"
                  value={formData.muscleMass}
                  onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bodyWater" className="text-sm">Body Water (%)</Label>
                <Input
                  id="bodyWater"
                  type="number"
                  step="0.1"
                  placeholder="55.0"
                  value={formData.bodyWater}
                  onChange={(e) => setFormData({ ...formData, bodyWater: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="visceralFat" className="text-sm">Visceral Fat</Label>
                <Input
                  id="visceralFat"
                  type="number"
                  placeholder="8"
                  value={formData.visceralFat}
                  onChange={(e) => setFormData({ ...formData, visceralFat: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="boneMass" className="text-sm">Bone Mass (kg)</Label>
                <Input
                  id="boneMass"
                  type="number"
                  step="0.1"
                  placeholder="3.1"
                  value={formData.boneMass}
                  onChange={(e) => setFormData({ ...formData, boneMass: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subcutaneousFat" className="text-sm">Subcutaneous Fat (%)</Label>
                <Input
                  id="subcutaneousFat"
                  type="number"
                  step="0.1"
                  placeholder="17.5"
                  value={formData.subcutaneousFat}
                  onChange={(e) => setFormData({ ...formData, subcutaneousFat: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skeletalMuscle" className="text-sm">Skeletal Muscle (%)</Label>
                <Input
                  id="skeletalMuscle"
                  type="number"
                  step="0.1"
                  placeholder="51.5"
                  value={formData.skeletalMuscle}
                  onChange={(e) => setFormData({ ...formData, skeletalMuscle: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proteinMass" className="text-sm">Protein Mass (kg)</Label>
                <Input
                  id="proteinMass"
                  type="number"
                  step="0.1"
                  placeholder="14.5"
                  value={formData.proteinMass}
                  onChange={(e) => setFormData({ ...formData, proteinMass: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bodyAge" className="text-sm flex items-center gap-1.5">
                  Body Age
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">
                          If not entered, body age will be auto-calculated based on your BMI, body fat percentage,
                          and other metrics compared to healthy ranges for your chronological age.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="bodyAge"
                  type="number"
                  placeholder="Auto-calculated"
                  value={formData.bodyAge}
                  onChange={(e) => setFormData({ ...formData, bodyAge: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Morning measurement, feeling good..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Adding..." : "Add Entry"}
            </Button>
          </form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AddWeightEntry;

import { Scale } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  userName?: string;
}

const EmptyState = ({ userName }: EmptyStateProps) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card px-6 py-8 text-center animate-in-slide-up">
        <p className="label-caps text-muted-foreground mb-2">
          Fresh Start
        </p>
        <h2 className="mb-3 flex items-center justify-center gap-3 text-2xl font-bold text-foreground font-heading tracking-tight sm:text-3xl">
          <Scale className="h-8 w-8 text-primary" />
          No Weight Entries Yet
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {userName ? `Welcome, ${userName}! ` : "Welcome! "}
          Start tracking your weight journey by adding your first entry using the API.
        </p>
        <div className="pt-4">
          <Link to="/api-docs">
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

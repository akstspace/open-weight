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
        <div className="mb-6 flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-border bg-secondary">
            <Scale className="h-10 w-10 text-accent" />
          </div>
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Fresh Start
        </p>
        <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
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

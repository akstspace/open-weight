import { Scale } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  userName?: string;
}

const EmptyState = ({ userName }: EmptyStateProps) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto animate-in-slide-up">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <div className="h-24 w-24 rounded-full bg-primary/30"></div>
            </div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
              <Scale className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          No Weight Entries Yet
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-8 text-sm sm:text-base leading-relaxed">
          {userName ? `Welcome, ${userName}! ` : "Welcome! "}
          Start tracking your weight journey by adding your first entry using the API.
        </p>

        {/* CTA */}
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

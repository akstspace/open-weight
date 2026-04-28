import { useQuery } from "@tanstack/react-query";
import Dashboard from "@/components/Dashboard";
import SetupScreen from "@/components/SetupScreen";
import { Scale, Settings, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchConfigStatus } from "@/services/configApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const Index = () => {
  const [localUserName, setLocalUserName] = useState<string | null>(null);

  const { data: config, isLoading, error } = useQuery({
    queryKey: ["configStatus"],
    queryFn: fetchConfigStatus,
    retry: false,
    staleTime: Infinity,
  });

  const handleSetupComplete = (userName: string) => {
    setLocalUserName(userName);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  const isConfigured = config?.configured || localUserName;
  const displayName = localUserName || config?.userName || "OpenWeight";

  if (config && !isConfigured && !error) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary sm:h-10 sm:w-10">
            <Scale className="h-4 w-4 text-primary-foreground sm:h-5 sm:w-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{displayName}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">open-weight</p>
          </div>
          <a
            href="https://github.com/akstspace/open-weight"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-secondary transition-colors hover:bg-muted text-muted-foreground hover:text-foreground spring-tap sm:h-10 sm:w-10"
            aria-label="View on GitHub"
          >
            <Github className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>
          <Link
            to="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-secondary transition-colors hover:bg-muted text-muted-foreground hover:text-foreground spring-tap sm:h-10 sm:w-10"
            aria-label="Open settings"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;

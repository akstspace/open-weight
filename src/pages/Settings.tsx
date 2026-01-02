import { ArrowLeft, Moon, Sun, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AddWeightEntry from "@/components/AddWeightEntry";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
          <Link
            to="/"
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors spring-tap"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Settings</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Customize your experience</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Theme Section */}
          <section className="animate-in-slide-up">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Appearance
            </h2>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Choose your preferred color scheme
                </p>
              </div>
              <div className="p-2">
                {themes.map((t, index) => {
                  const Icon = t.icon;
                  const isActive = theme === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all spring-tap ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{t.label}</span>
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-in-spring" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Manual Entry Section */}
          <section className="animate-in-slide-up stagger-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Advanced
            </h2>
            <div className="mb-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                ⚠️ <strong>Owner Only:</strong> This section is intended for the site owner to manually add weight entries. 
                Requires API key authentication.
              </p>
            </div>
            <AddWeightEntry />
          </section>

          {/* About Section */}
          <section className="animate-in-slide-up stagger-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              About
            </h2>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application</span>
                  <span className="font-medium text-foreground">Open-Weight</span>
                </div>
              </div>
              <div className="border-t border-border">
                <Link
                  to="/algorithms"
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">Health Metrics & Algorithms</span>
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;

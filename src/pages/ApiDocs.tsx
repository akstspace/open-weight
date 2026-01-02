import { Link } from "react-router-dom";
import { ArrowLeft, Code, Key, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApiDocs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
          <Link
            to="/"
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-foreground">API Documentation</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Open-Weight API Reference</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
          {/* Quick Start */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0">Quick Start</h2>
            </div>
            <p className="text-muted-foreground mb-3">
              The Open-Weight API allows you to add and retrieve weight entries. All write operations require authentication with an API key.
            </p>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium mb-2">💡 Tip: You can also add entries from the Settings page</p>
              <p className="text-xs text-muted-foreground">
                Navigate to Settings → Advanced → Add Weight Entry to manually add data through the UI.
              </p>
            </div>
          </section>

          {/* Authentication */}
          <section className="mb-8 p-4 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Key className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold m-0">Authentication</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Include your API key in the request headers for authenticated endpoints:
            </p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
              <code>X-API-Key: wt_your_api_key_here</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              Get your API key from the setup process or use the CLI to retrieve it.
            </p>
          </section>

          {/* Endpoints */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0">Endpoints</h2>
            </div>

            {/* Add Entry */}
            <div className="mb-6 p-4 rounded-lg border border-border">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-mono">POST</span>
                <code className="text-sm font-mono">/api/entries</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Add a new weight entry</p>
              
              <p className="text-xs font-semibold mb-2">Request Body:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto mb-3">
{`{
  "weight": 75.5,          // Required: weight in kg
  "bodyFat": 18.5,         // Optional: body fat %
  "muscleMass": 34.2,      // Optional: muscle mass in kg
  "bmi": 24.5,             // Optional: BMI
  "bodyWater": 57.0,       // Optional: body water %
  "visceralFat": 8,        // Optional: visceral fat level
  "boneMass": 3.2,         // Optional: bone mass in kg
  "bmr": 1650,             // Optional: basal metabolic rate
  "notes": "Feeling good"  // Optional: notes
}`}
              </pre>

              <p className="text-xs font-semibold mb-2">Example:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl -X POST http://localhost:3000/api/entries \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: wt_your_api_key" \\
  -d '{"weight": 75.5, "bodyFat": 18.5}'`}
              </pre>
            </div>

            {/* Get Entries */}
            <div className="mb-6 p-4 rounded-lg border border-border">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">GET</span>
                <code className="text-sm font-mono">/api/entries</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Get all weight entries (public, no auth required)</p>
              
              <p className="text-xs font-semibold mb-2">Query Parameters:</p>
              <ul className="text-xs space-y-1 ml-4 mb-3">
                <li><code>limit</code> - Number of entries to return (default: 50)</li>
                <li><code>offset</code> - Number of entries to skip (default: 0)</li>
                <li><code>from</code> - Start date (ISO format)</li>
                <li><code>to</code> - End date (ISO format)</li>
              </ul>

              <p className="text-xs font-semibold mb-2">Example:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl http://localhost:3000/api/entries?limit=10`}
              </pre>
            </div>

            {/* Get Stats */}
            <div className="mb-6 p-4 rounded-lg border border-border">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-mono">GET</span>
                <code className="text-sm font-mono">/api/stats</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Get statistics (public, no auth required)</p>

              <p className="text-xs font-semibold mb-2">Example:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl http://localhost:3000/api/stats`}
              </pre>
            </div>
          </section>

          {/* CLI */}
          <section className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="text-lg font-semibold mb-3">CLI Commands</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Manage your Open-Weight installation using the CLI:
            </p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`# Check status
docker compose exec weight-log bun run server/cli.ts status

# Reset API key (generates new key - save it securely!)
docker compose exec weight-log bun run server/cli.ts reset-key`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Important:</strong> API keys are hashed for security and cannot be retrieved after creation. 
              Save your key securely during initial setup or when resetting.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-border">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiDocs;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, Key, User } from "lucide-react";
import { toast } from "sonner";

interface SetupScreenProps {
  onSetupComplete: (userName: string) => void;
}

const SetupScreen = ({ onSetupComplete }: SetupScreenProps) => {
  const [userName, setUserName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [height, setHeight] = useState("");
  const [sex, setSex] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!birthday) {
      toast.error("Please enter your birthday");
      return;
    }

    if (!height) {
      toast.error("Please enter your height");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/config/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userName: userName.trim(),
          birthday: birthday,
          height: parseFloat(height),
          sex: sex || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Setup failed");
      }

      setApiKey(data.apiKey);
      toast.success("Setup complete!");
    } catch (error) {
      console.error("Setup error:", error);
      toast.error(error instanceof Error ? error.message : "Setup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyApiKey = async () => {
    if (!apiKey) return;
    
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      toast.success("API key copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleContinue = () => {
    onSetupComplete(userName);
  };

  // Show API key screen after successful setup
  if (apiKey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in-slide-up">
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <Key className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Setup Complete!</h1>
              <p className="text-muted-foreground">
                Save your API key below. You'll need it to add weight data.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-destructive">
                ⚠️ Save this key now - it won't be shown again!
              </Label>
              <div className="relative">
                <div className="bg-secondary/50 rounded-lg p-4 pr-12 font-mono text-sm break-all border border-border">
                  {apiKey}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleCopyApiKey}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium text-foreground">How to use:</p>
              <p className="text-muted-foreground">
                Use this API key in the <code className="bg-secondary px-1 rounded">X-API-Key</code> header 
                when making requests to add or modify weight data.
              </p>
              <p className="text-muted-foreground">
                Or navigate to <strong>Settings → Advanced</strong> to add entries directly from the UI.
              </p>
            </div>

            <Button 
              className="w-full h-12 touch-active" 
              onClick={handleContinue}
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Initial setup form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in-slide-up">
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome!</h1>
            <p className="text-muted-foreground">
              Let's set up your personal health tracker.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Your Name <span className="text-destructive">*</span></Label>
              <Input
                id="userName"
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="h-12"
                disabled={isLoading}
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday <span className="text-destructive">*</span></Label>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="h-12"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-muted-foreground">Used to calculate your age and BMR</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) <span className="text-destructive">*</span></Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-12"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Sex <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <Select value={sex} onValueChange={setSex} disabled={isLoading}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              🔒 Biometric data is required to calculate BMI, BMR, and body age automatically.
            </p>

            <Button 
              type="submit" 
              className="w-full h-12 touch-active"
              disabled={isLoading || !userName.trim() || !birthday || !height}
            >
              {isLoading ? "Setting up..." : "Complete Setup"}
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            <p>After setup, you'll receive an API key to add weight data.</p>
            <p className="mt-1">The dashboard will be publicly viewable.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;

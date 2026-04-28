import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, Heart, TrendingDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const Algorithms = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-secondary transition-colors hover:bg-muted text-muted-foreground hover:text-foreground sm:h-10 sm:w-10"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Health Metrics</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Understanding the algorithms</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        <div className="max-w-none text-foreground">

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-muted-foreground">
              This page explains the health metrics tracked by OpenWeight and the formulas used to calculate ratings and standards.
            </p>
          </section>

          {/* BMI */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Body Mass Index (BMI)</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              BMI is a measure of body fat based on height and weight.
            </p>

            <div className="mb-3 rounded-sm border border-border bg-secondary p-3 text-sm">
              <strong>Formula:</strong>
              <pre className="mt-2">BMI = weight (kg) / (height (m))²</pre>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">WHO Classification:</p>
              <ul className="space-y-1 ml-4">
                <li><span className="text-muted-foreground">&bull; Underweight:</span> BMI &lt; 18.5</li>
                <li><span className="text-success">&bull; Normal:</span> BMI 18.5 - 24.9</li>
                <li><span className="text-warning">&bull; Overweight:</span> BMI 25.0 - 29.9</li>
                <li><span className="text-primary">&bull; Obese Class I:</span> BMI 30.0 - 34.9</li>
                <li><span className="text-destructive">&bull; Obese Class II:</span> BMI 35.0 - 39.9</li>
                <li><span className="text-destructive">&bull; Obese Class III:</span> BMI &ge; 40.0</li>
              </ul>
            </div>
          </section>

          {/* Body Fat Percentage */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Body Fat Percentage</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Percentage of total body mass that is fat tissue. Measured by bioimpedance scales.
            </p>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-2">Male Standards:</p>
                <ul className="space-y-1 ml-4">
                  <li><span className="text-muted-foreground">&bull; Essential:</span> 2-5%</li>
                  <li><span className="text-success">&bull; Athletes:</span> 6-13%</li>
                  <li><span className="text-success">&bull; Fitness:</span> 14-17%</li>
                  <li><span className="text-warning">&bull; Average:</span> 18-24%</li>
                  <li><span className="text-primary">&bull; Obese:</span> &ge; 25%</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Female Standards:</p>
                <ul className="space-y-1 ml-4">
                  <li><span className="text-muted-foreground">&bull; Essential:</span> 10-13%</li>
                  <li><span className="text-success">&bull; Athletes:</span> 14-20%</li>
                  <li><span className="text-success">&bull; Fitness:</span> 21-24%</li>
                  <li><span className="text-warning">&bull; Average:</span> 25-31%</li>
                  <li><span className="text-primary">&bull; Obese:</span> &ge; 32%</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Basal Metabolic Rate */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Basal Metabolic Rate (BMR)</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              The number of calories your body burns at rest. Used to calculate daily caloric needs.
            </p>

            <div className="mb-3 overflow-x-auto rounded-sm border border-border bg-secondary p-3 text-sm">
              <strong>Mifflin-St Jeor Equation:</strong>
              <div className="mt-2 space-y-1">
                <div className="break-words">
                  <strong>For Men:</strong><br />
                  BMR = (10 &times; weight in kg) + (6.25 &times; height in cm) - (5 &times; age) + 5
                </div>
                <div className="break-words">
                  <strong>For Women:</strong><br />
                  BMR = (10 &times; weight in kg) + (6.25 &times; height in cm) - (5 &times; age) - 161
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">Activity Multipliers (to get TDEE):</p>
              <ul className="space-y-1 ml-4">
                <li>&bull; Sedentary (little/no exercise): BMR &times; 1.2</li>
                <li>&bull; Lightly active (1-3 days/week): BMR &times; 1.375</li>
                <li>&bull; Moderately active (3-5 days/week): BMR &times; 1.55</li>
                <li>&bull; Very active (6-7 days/week): BMR &times; 1.725</li>
                <li>&bull; Extremely active (athlete): BMR &times; 1.9</li>
              </ul>
            </div>
          </section>

          {/* Visceral Fat */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Visceral Fat Level</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Fat stored around internal organs. Higher levels increase health risks.
            </p>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">Rating Scale (1-59):</p>
              <ul className="space-y-1 ml-4">
                <li><span className="text-success">&bull; Healthy:</span> 1-12</li>
                <li><span className="text-warning">&bull; Excess:</span> 13-17</li>
                <li><span className="text-destructive">&bull; High:</span> &ge; 18</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                <strong>Note:</strong> Levels above 13 indicate increased risk of cardiovascular disease, type 2 diabetes, and metabolic syndrome.
              </p>
            </div>
          </section>

          {/* Body Water */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Body Water Percentage</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              The percentage of total body mass that is water. Important for overall health and hydration.
            </p>

            <div className="mb-3 rounded-sm border border-border bg-secondary p-3 text-sm">
              <strong>Auto-Calculated:</strong>
              <pre className="mt-2">Water Weight (kg) = Weight &times; Body Water %</pre>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">Healthy Ranges:</p>
              <ul className="space-y-1 ml-4">
                <li>&bull; Men: 50-65%</li>
                <li>&bull; Women: 45-60%</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Athletes and people with more muscle mass typically have higher water percentages.
              </p>
            </div>
          </section>

          {/* Muscle Mass Metrics */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Muscle Mass Metrics</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Measurements related to muscle composition and distribution.
            </p>

            <div className="mb-3 rounded-sm border border-border bg-secondary p-3 text-sm">
              <strong>Auto-Calculated:</strong>
              <pre className="mt-2">Muscle Rate (%) = (Muscle Mass / Weight) &times; 100</pre>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">Skeletal Muscle Percentage:</p>
                <p className="text-muted-foreground text-xs mb-2">Voluntary muscles you can control (legs, arms, core)</p>
                <ul className="space-y-1 ml-4">
                  <li><span className="text-success">&bull; Excellent (Men):</span> &ge; 46%</li>
                  <li><span className="text-success">&bull; Excellent (Women):</span> &ge; 40%</li>
                  <li><span className="text-warning">&bull; Standard:</span> 35-45% (Men), 30-39% (Women)</li>
                  <li><span className="text-primary">&bull; Low:</span> &lt; 35% (Men), &lt; 30% (Women)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Fat Mass Metrics */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Fat Mass Metrics</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Breakdown of body fat into subcutaneous and visceral components.
            </p>

            <div className="mb-3 rounded-sm border border-border bg-secondary p-3 text-sm">
              <strong>Auto-Calculated:</strong>
              <pre className="mt-2">Fat Mass (kg) = Weight &times; Body Fat %</pre>
              <pre className="mt-1">Fat-Free Body Weight (kg) = Weight - Fat Mass</pre>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">Subcutaneous Fat:</p>
                <p className="text-muted-foreground text-xs mb-2">Fat stored under the skin (less health risk than visceral)</p>
                <ul className="space-y-1 ml-4">
                  <li><span className="text-success">&bull; Standard (Men):</span> 10-20%</li>
                  <li><span className="text-success">&bull; Standard (Women):</span> 15-25%</li>
                  <li><span className="text-primary">&bull; High:</span> Above standard range</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Protein Mass */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Protein Mass</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Total protein content in your body, essential for muscle maintenance and overall health.
            </p>

            <div className="mb-3 rounded-sm border border-border bg-secondary p-3 text-sm">
              <strong>Auto-Calculated:</strong>
              <pre className="mt-2">Protein (%) = (Protein Mass / Weight) &times; 100</pre>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">Healthy Ranges:</p>
              <ul className="space-y-1 ml-4">
                <li><span className="text-success">&bull; Excellent:</span> 16-20%</li>
                <li><span className="text-warning">&bull; Standard:</span> 12-16%</li>
                <li><span className="text-primary">&bull; Low:</span> &lt; 12%</li>
              </ul>
            </div>
          </section>

          {/* Ideal Body Weight */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Ideal Body Weight</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Target weight calculated based on your height for optimal health.
            </p>

            <div className="mb-3 rounded-sm border border-border bg-secondary p-3 text-sm">
              <strong>Auto-Calculated:</strong>
              <pre className="mt-2">Ideal Weight = 22 &times; (Height in m)²</pre>
              <p className="text-xs text-muted-foreground mt-2">
                Based on a BMI of 22, which is the middle of the healthy BMI range (18.5-24.9)
              </p>
            </div>
          </section>

          {/* Body Age */}
          <section className="mb-8 p-4 rounded-sm bg-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold m-0 tracking-tight">Body Age</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              Measured by bioimpedance scales based on your metabolic rate, body composition, and other health metrics compared to population averages.
            </p>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">Factors Considered by Scale:</p>
              <ul className="space-y-1 ml-4">
                <li>&bull; Basal Metabolic Rate (BMR)</li>
                <li>&bull; Body Fat Percentage</li>
                <li>&bull; Muscle Mass</li>
                <li>&bull; Visceral Fat Level</li>
                <li>&bull; Bone Mass</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                <strong>Note:</strong> Body age is measured directly by your smart scale, not calculated automatically. Goal: Keep body age below or equal to actual age through healthy lifestyle choices.
              </p>
            </div>
          </section>

          {/* Data Sources */}
          <section className="mb-8 rounded-sm border border-border bg-secondary p-4">
            <h3 className="text-lg font-semibold mb-3">Data Sources & Accuracy</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                OpenWeight uses measurements from bioimpedance analysis (BIA) scales like Fitdays, which send
                small electrical signals through your body to estimate body composition.
              </p>
              <p>
                <strong>Important:</strong> While BIA scales provide useful trends, they may have a margin of error
                of &plusmn;3-5% compared to medical-grade methods like DEXA scans. Use these metrics as general
                health indicators and track trends over time rather than focusing on absolute values.
              </p>
              <p className="text-xs">
                References: WHO BMI Classification, ACE Body Fat Percentage Standards, Mifflin-St Jeor Equation (2005)
              </p>
            </div>
          </section>

          {/* Auto-Calculated Summary */}
          <section className="mb-8 rounded-sm border border-border bg-secondary p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Automatically Calculated Metrics
            </h3>
            <div className="text-sm space-y-2">
              <p className="text-muted-foreground mb-3">
                The following metrics are calculated automatically from your measured data:
              </p>
              <ul className="space-y-1 ml-4">
                <li>&bull; <strong>BMI</strong> - From weight and height</li>
                <li>&bull; <strong>BMR</strong> - From weight, height, age, and sex</li>
                <li>&bull; <strong>Fat Mass</strong> - Weight &times; Body Fat % (only if body fat measured)</li>
                <li>&bull; <strong>Fat-Free Body Weight</strong> - Weight - Fat Mass (only if body fat measured)</li>
                <li>&bull; <strong>Muscle Rate</strong> - (Muscle Mass / Weight) &times; 100 (only if muscle mass measured)</li>
                <li>&bull; <strong>Protein %</strong> - (Protein Mass / Weight) &times; 100 (only if protein mass measured)</li>
                <li>&bull; <strong>Water Weight</strong> - Weight &times; Body Water % (only if body water measured)</li>
                <li>&bull; <strong>Ideal Body Weight</strong> - Based on height and healthy BMI of 22</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                <strong>Note:</strong> Metrics like Body Age, Muscle Mass, Body Fat %, Visceral Fat, Bone Mass, etc. must be measured by your smart scale - they are not calculated automatically.
              </p>
            </div>
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

export default Algorithms;

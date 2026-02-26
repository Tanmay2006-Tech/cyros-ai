import { useLatestPlan } from "@/hooks/use-plans";
import { Layout } from "@/components/Layout";
import { Dumbbell, Utensils, Target, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Plan() {
  const { data: plan, isLoading } = useLatestPlan();

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6 mt-4">
          <div className="h-10 bg-white/5 rounded-lg w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-24 glass-card rounded-2xl"></div>)}
          </div>
          <div className="glass-card p-8 rounded-3xl h-64"></div>
          <div className="glass-card p-8 rounded-3xl h-64"></div>
        </div>
      </Layout>
    );
  }

  if (!plan) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
          <Target className="w-20 h-20 text-muted-foreground mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4 text-foreground">No Protocol Found</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            You need to generate an AI plan from your profile dashboard first.
          </p>
          <Link href="/profile" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all inline-flex items-center gap-2">
            Go to Profile <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-10 mt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">Your Protocol</h1>
          <p className="text-muted-foreground">AI-calibrated targets based on your unique biology.</p>
        </div>
        <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
          Active Plan
        </div>
      </header>

      {/* Target Macros Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="glass-card rounded-2xl p-5 border-t-4 border-t-accent">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Calories</span>
          <div className="text-3xl font-display font-bold text-foreground mt-1">{plan.targetCalories}</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border-t-4 border-t-secondary">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Protein</span>
          <div className="text-3xl font-display font-bold text-foreground mt-1">{plan.targetProtein}g</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border-t-4 border-t-primary">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Carbs</span>
          <div className="text-3xl font-display font-bold text-foreground mt-1">{plan.targetCarbs}g</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border-t-4 border-t-orange-400">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Fat</span>
          <div className="text-3xl font-display font-bold text-foreground mt-1">{plan.targetFat}g</div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass-card rounded-[2rem] p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -z-10" />
          <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
              <Dumbbell className="w-6 h-6" />
            </div>
            Workout Protocol
          </h2>
          <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-li:text-muted-foreground max-w-none font-sans whitespace-pre-wrap leading-relaxed">
            {plan.workoutPlan}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
          <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Utensils className="w-6 h-6" />
            </div>
            Nutrition Strategy
          </h2>
          <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-li:text-muted-foreground max-w-none font-sans whitespace-pre-wrap leading-relaxed">
            {plan.dietPlan}
          </div>
        </div>
      </div>
    </Layout>
  );
}

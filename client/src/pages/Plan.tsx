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
          <h1 className="text-4xl font-display font-black text-gradient mb-2 uppercase italic tracking-tighter">Your Protocol</h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs opacity-70">AI-calibrated targets based on your unique biology.</p>
        </div>
        <div className="inline-flex items-center bg-primary/20 text-primary px-4 py-2 rounded-full text-xs font-black border border-primary/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] tracking-tighter uppercase italic">
          Active Plan
        </div>
      </header>

      {/* Target Macros Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-accent bg-gradient-to-br from-accent/5 to-transparent">
          <span className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black">Calories</span>
          <div className="text-4xl font-display font-black text-foreground mt-1 tracking-tighter italic">{plan.targetCalories}</div>
        </div>
        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-secondary bg-gradient-to-br from-secondary/5 to-transparent">
          <span className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black">Protein</span>
          <div className="text-4xl font-display font-black text-foreground mt-1 tracking-tighter italic">{plan.targetProtein}<span className="text-lg ml-0.5">g</span></div>
        </div>
        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent">
          <span className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black">Carbs</span>
          <div className="text-4xl font-display font-black text-foreground mt-1 tracking-tighter italic">{plan.targetCarbs}<span className="text-lg ml-0.5">g</span></div>
        </div>
        <div className="glass-card rounded-2xl p-6 border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-500/5 to-transparent">
          <span className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-black">Fat</span>
          <div className="text-4xl font-display font-black text-foreground mt-1 tracking-tighter italic">{plan.targetFat}<span className="text-lg ml-0.5">g</span></div>
        </div>
      </div>

      <div className="space-y-8 pb-20">
        <div className="glass-card rounded-[2rem] p-6 md:p-10 relative overflow-hidden group border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10 group-hover:bg-secondary/20 transition-colors duration-500" />
          <h2 className="text-2xl font-display font-black text-foreground flex items-center gap-4 mb-8 uppercase italic tracking-tighter">
            <div className="p-3 rounded-xl bg-secondary/20 text-secondary shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-secondary/30">
              <Dumbbell className="w-6 h-6" />
            </div>
            Workout Protocol
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10">
            <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-li:text-muted-foreground max-w-none font-sans whitespace-pre-wrap leading-relaxed text-sm md:text-base border-l-2 border-white/5 pl-6 md:pl-10">
              {plan.workoutPlan}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-6 md:p-10 relative overflow-hidden group border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors duration-500" />
          <h2 className="text-2xl font-display font-black text-foreground flex items-center gap-4 mb-8 uppercase italic tracking-tighter">
            <div className="p-3 rounded-xl bg-primary/20 text-primary shadow-[0_0_15px_rgba(168,85,247,0.2)] border border-primary/30">
              <Utensils className="w-6 h-6" />
            </div>
            Nutrition Strategy
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10">
            <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-li:text-muted-foreground max-w-none font-sans whitespace-pre-wrap leading-relaxed text-sm md:text-base border-l-2 border-white/5 pl-6 md:pl-10">
              {plan.dietPlan}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

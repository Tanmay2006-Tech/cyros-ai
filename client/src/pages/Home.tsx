import { useLatestPlan } from "@/hooks/use-plans";
import { useMeals } from "@/hooks/use-meals";
import { useUser } from "@/hooks/use-users";
import { Link } from "wouter";
import { Flame, Target, ArrowRight, Activity, Plus, User as UserIcon } from "lucide-react";
import { HealthRing } from "@/components/HealthRing";
import { ProgressBar } from "@/components/ProgressBar";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";

export default function Home() {
  const { data: user, isLoading: loadingUser } = useUser();
  const { data: plan, isLoading: loadingPlan } = useLatestPlan();
  const { data: meals, isLoading: loadingMeals } = useMeals();

  if (loadingUser || loadingPlan || loadingMeals) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8 mt-4">
          <div className="h-12 bg-white/5 rounded-xl w-48"></div>
          <div className="glass-card p-8 rounded-3xl h-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl h-48"></div>
            <div className="glass-card p-6 rounded-3xl h-48"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const todayMeals = meals || [];
  const totalCals = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = todayMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = todayMeals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFat = todayMeals.reduce((acc, m) => acc + m.fat, 0);

  const targetCals = plan?.targetCalories || 2000;
  const calProgress = (totalCals / targetCals) * 100;

  return (
    <Layout>
      <header className="mb-10 mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-gradient mb-2 tracking-tighter italic uppercase">
            YO, Sachin
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.3em] opacity-70">
              System Status: <span className="text-primary animate-pulse">Optimal</span> // Neural Link Active
            </p>
            <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden hidden sm:block">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-2xl backdrop-blur-sm">
            <div className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">Neural Rank</div>
            <div className="text-xl font-display font-black italic uppercase text-white">#1 Global</div>
          </div>
          <div className="px-6 py-3 bg-secondary/10 border border-secondary/30 rounded-2xl backdrop-blur-sm">
            <div className="text-[10px] uppercase font-black tracking-widest text-secondary mb-1">Uptime</div>
            <div className="text-xl font-display font-black italic uppercase text-white">99.9%</div>
          </div>
        </div>
      </header>

      {!plan ? (
        <div className="glass-card rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Target className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">No AI Plan Yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Set up your health profile and let our AI generate a personalized diet and workout routine for you.
          </p>
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            Create Profile & Plan <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Ring Card */}
          <div className="glass-card rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
            
            <div className="flex-1 w-full space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
                  <Flame className="text-accent" /> Daily Activity
                </h2>
                <p className="text-muted-foreground mt-1">You're making great progress today.</p>
              </div>
              
              <div className="space-y-5">
                <ProgressBar value={totalProtein} max={plan.targetProtein} label="Protein" color="bg-secondary" formatter={(v) => `${v}g`} />
                <ProgressBar value={totalCarbs} max={plan.targetCarbs} label="Carbs" color="bg-primary" formatter={(v) => `${v}g`} />
                <ProgressBar value={totalFat} max={plan.targetFat} label="Fat" color="bg-accent" formatter={(v) => `${v}g`} />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4">
              <HealthRing 
                progress={calProgress} 
                size={220} 
                strokeWidth={20}
                color="text-primary"
                label={totalCals.toString()}
                sublabel={`/ ${targetCals} kcal`}
                icon={Activity}
              />
              <Link 
                href="/nutrition"
                className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary hover:text-emerald-400 transition-colors"
              >
                <Plus className="w-4 h-4" /> Log Meal
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/plan" className="block">
              <div className="glass-card rounded-[2rem] p-8 h-full hover:border-primary/30 transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">View AI Plan</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Review your personalized diet strategy and workout regimen.
                </p>
              </div>
            </Link>

            <Link href="/nutrition" className="block">
              <div className="glass-card rounded-[2rem] p-8 h-full hover:border-accent/30 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -z-10" />
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2 uppercase italic">Daily Food Log</h3>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Protein</span>
                    <span className="text-secondary">{totalProtein}g</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Carbs</span>
                    <span className="text-primary">{totalCarbs}g</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Fat</span>
                    <span className="text-accent">{totalFat}g</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-6 font-medium">
                  Tap to log meals and track your intake.
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}

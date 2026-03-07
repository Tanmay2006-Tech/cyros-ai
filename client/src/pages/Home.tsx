import { useLatestPlan } from "@/hooks/use-data";
import { useMeals } from "@/hooks/use-meals";
import { useUser } from "@/hooks/use-users";
import { Link } from "wouter";
import { Flame, Target, ArrowRight, Activity, Plus, User as UserIcon, Quote, RefreshCw } from "lucide-react";
import { HealthRing } from "@/components/HealthRing";
import { ProgressBar } from "@/components/ProgressBar";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const QUOTES = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Andrew Murphy" },
  { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The harder you work, the luckier you get.", author: "Gary Player" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "It's not about having time, it's about making time.", author: "Unknown" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
  { text: "You don't have to be extreme, just consistent.", author: "Unknown" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "The best project you'll ever work on is you.", author: "Unknown" },
];

export default function Home() {
  const { data: user, isLoading: loadingUser } = useUser();
  const { data: plan, isLoading: loadingPlan } = useLatestPlan();
  const { data: meals, isLoading: loadingMeals } = useMeals();
  
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const quote = QUOTES[quoteIndex];
  
  function nextQuote() {
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  }

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
              Status: <span className="text-primary animate-pulse">Optimal</span> // System Online
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
            <div className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">Leaderboard Rank</div>
            <div className="text-xl font-display font-black italic uppercase text-white">#1 Global</div>
          </div>
          <div className="px-6 py-3 bg-secondary/10 border border-secondary/30 rounded-2xl backdrop-blur-sm">
            <div className="text-[10px] uppercase font-black tracking-widest text-secondary mb-1">Status</div>
            <div className="text-xl font-display font-black italic uppercase text-white">Online</div>
          </div>
        </div>
      </header>

      {!plan ? (
        <div className="glass-card rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Target className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">No Plan Yet</h2>
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
          <div className="glass-card rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="flex-1 w-full space-y-8 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <span className="text-[10px] uppercase font-black tracking-[0.4em] text-primary">Health Overview</span>
                </div>
                <h2 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  <Flame className="text-accent animate-pulse" /> Health Stats
                </h2>
              </div>
              
              <div className="grid gap-6">
                <ProgressBar value={totalProtein} max={plan.targetProtein} label="Protein" color="bg-secondary" formatter={(v) => `${v}g`} />
                <ProgressBar value={totalCarbs} max={plan.targetCarbs} label="Carbs" color="bg-primary" formatter={(v) => `${v}g`} />
                <ProgressBar value={totalFat} max={plan.targetFat} label="Fats" color="bg-accent" formatter={(v) => `${v}g`} />
              </div>

              <div className="pt-4 flex gap-6 border-t border-white/5">
                <div className="space-y-1">
                  <div className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Burn Rate</div>
                  <div className="text-sm font-display font-black text-white italic">2,450 kcal/d</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Hydration Level</div>
                  <div className="text-sm font-display font-black text-secondary italic">88% Optimal</div>
                </div>
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
                <h3 className="text-xl font-display font-bold text-foreground mb-2">View Plan</h3>
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 glass-card rounded-[2rem] p-6 md:p-8 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
            <Quote className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg md:text-xl font-display font-bold italic text-foreground leading-relaxed" data-testid="text-quote">
              "{quote.text}"
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-bold uppercase tracking-widest" data-testid="text-quote-author">
              - {quote.author}
            </p>
          </div>
          <button
            onClick={nextQuote}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0"
            data-testid="button-next-quote"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </Layout>
  );
}

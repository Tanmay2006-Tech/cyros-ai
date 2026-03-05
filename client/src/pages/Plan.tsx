import { useLatestPlan } from "@/hooks/use-plans";
import { Layout } from "@/components/Layout";
import { Dumbbell, Utensils, Target, ArrowRight, Flame, Zap, Droplets, Info, CheckCircle2, Award, Star } from "lucide-react";
import { Link } from "wouter";
import { MacroStats } from "@/components/plan/MacroStats";
import { AccordionSection } from "@/components/plan/AccordionSection";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function Plan() {
  const { data: plan, isLoading } = useLatestPlan();
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const storedXp = localStorage.getItem("cyros_xp");
    if (storedXp) setXp(parseInt(storedXp));
  }, []);

  const handleChallengeComplete = (checked: boolean) => {
    if (checked) {
      const newXp = xp + 100;
      setXp(newXp);
      localStorage.setItem("cyros_xp", newXp.toString());
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6 mt-4 max-w-[1000px] mx-auto">
          <div className="h-10 bg-white/5 rounded-lg w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 glass-card rounded-2xl"></div>)}
          </div>
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
          <h2 className="text-3xl font-display font-bold mb-4 text-foreground uppercase italic tracking-tighter">No Protocol Active</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Initialize your profile to generate your AI-optimized fitness operating system.
          </p>
          <Link href="/profile" className="px-8 py-4 bg-primary text-primary-foreground font-black uppercase italic rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-1 transition-all inline-flex items-center gap-2">
            Initialize System <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Layout>
    );
  }

  let weekData = [];
  try {
    // Both dietPlan and workoutPlan store the same JSON week array now
    weekData = JSON.parse(plan.dietPlan);
  } catch (e) {
    // Fallback if the data is still in the old text format
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
          <Info className="w-20 h-20 text-primary mb-6" />
          <h2 className="text-3xl font-display font-black mb-4 text-foreground uppercase italic tracking-tighter">Legacy Data Detected</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Your current plan is using an outdated format. Re-generate it to unlock the new dashboard.
          </p>
          <Link href="/profile" className="px-8 py-4 bg-primary text-primary-foreground font-black uppercase italic rounded-xl shadow-lg hover:-translate-y-1 transition-all inline-flex items-center gap-2">
            Update Profile <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-20 max-w-[1000px] mx-auto"
      >
        <header className="mb-12 mt-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-display font-black text-gradient mb-2 uppercase italic tracking-tighter">Fitness Plan</h1>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs opacity-70">
              Daily Tracking // Week 01 // XP: {xp}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Last Sync</div>
              <div className="text-xs font-bold text-primary italic">0.2ms ago</div>
            </div>
            <div className="inline-flex items-center bg-primary/20 text-primary px-6 py-3 rounded-full text-xs font-black border border-primary/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] tracking-widest uppercase italic">
              Active Neural Plan
            </div>
          </div>
        </header>

        <div className="space-y-16">
          {weekData.map((day: any, idx: number) => (
            <section key={day.day} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-6">
                  <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter text-foreground">{day.day}</h2>
                  <Badge className={`px-4 py-1.5 uppercase font-black text-[10px] tracking-widest italic ${
                    day.intensity === 'High' ? 'bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                    day.intensity === 'Moderate' ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' :
                    'bg-secondary/20 text-secondary border-secondary/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  }`}>
                    {day.intensity} Intensity
                  </Badge>
                </div>
              </div>

              {/* Macro Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MacroStats label="Energy" value={day.diet.calories} icon={Flame} color="var(--accent)" />
                <MacroStats label="Protein" value={day.diet.protein} unit="g" icon={Zap} color="var(--secondary)" />
                <MacroStats label="Carbs" value={day.diet.carbs} unit="g" icon={Droplets} color="var(--primary)" />
                <MacroStats label="Fats" value={day.diet.fats} unit="g" icon={Info} color="#f97316" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Workout Grid */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-4">
                    <Dumbbell className="w-4 h-4 text-secondary" /> Workout Matrix
                  </h3>
                  <div className="grid gap-3">
                    {day.workout.map((ex: any, i: number) => (
                      <div key={i} className="glass-card p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-secondary/30 transition-all hover:bg-white/5">
                        <div>
                          <div className="font-display font-black uppercase italic tracking-tight text-foreground group-hover:text-secondary transition-colors">{ex.name}</div>
                          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">Ref ID: {idx}{i}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-display font-black italic tracking-tighter text-foreground">{ex.sets}</div>
                          <div className="text-[9px] uppercase font-black text-secondary tracking-widest">Rest: {ex.rest}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges & Progress */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-primary" /> Neural Challenges
                  </h3>
                  <div className="glass-card p-8 rounded-[2rem] border border-white/5 space-y-6 h-full bg-gradient-to-br from-primary/5 to-transparent">
                    {day.challenges.map((c: string, i: number) => (
                      <div key={i} className="flex items-center space-x-4 group cursor-pointer">
                        <Checkbox 
                          id={`c-${idx}-${i}`} 
                          className="w-6 h-6 rounded-lg border-primary/50 data-[state=checked]:bg-primary"
                          onCheckedChange={(checked) => handleChallengeComplete(checked === true)}
                        />
                        <label 
                          htmlFor={`c-${idx}-${i}`}
                          className="text-sm font-display font-black uppercase italic tracking-tight text-foreground/80 group-hover:text-foreground transition-all cursor-pointer flex-1"
                        >
                          {c}
                        </label>
                        <Award className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                      </div>
                    ))}
                    <div className="pt-6 border-t border-white/5">
                      <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2">
                        <span>Daily Synchronization</span>
                        <span className="text-primary">Ready</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: "40%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
}

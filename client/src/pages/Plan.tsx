import { useLatestPlan } from "@/hooks/use-plans";
import { Layout } from "@/components/Layout";
import { Dumbbell, Utensils, Target, ArrowRight, Flame, Zap, Droplets, Info } from "lucide-react";
import { Link } from "wouter";
import { MacroStats } from "@/components/plan/MacroStats";
import { DayCard } from "@/components/plan/DayCard";
import { AccordionSection } from "@/components/plan/AccordionSection";
import { motion } from "framer-motion";

export default function Plan() {
  const { data: plan, isLoading } = useLatestPlan();

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6 mt-4">
          <div className="h-10 bg-white/5 rounded-lg w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 glass-card rounded-2xl"></div>)}
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

  // Helper to parse the plan text into days
  const parsePlan = (workoutText: string, dietText: string) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const parsedDays = days.map(day => {
      // Find workout for the day
      const workoutRegex = new RegExp(`${day}:?\\s*([\\s\\S]*?)(?=(?:${days.join('|')})|$)`, 'i');
      const workoutMatch = workoutText.match(workoutRegex);
      
      // Determine day type
      let type = 'Strength';
      if (workoutText.toLowerCase().includes(`${day.toLowerCase()}: rest`) || 
          workoutText.toLowerCase().includes(`${day.toLowerCase()} - rest`)) {
        type = 'Rest Day';
      } else if (workoutText.toLowerCase().includes('cardio') && workoutText.toLowerCase().includes(day.toLowerCase())) {
        type = 'Cardio';
      }

      return {
        day,
        type,
        workout: workoutMatch ? workoutMatch[1].trim() : "Standard routine",
        diet: "See daily strategy"
      };
    });
    return parsedDays;
  };

  const dayPlans = parsePlan(plan.workoutPlan, plan.dietPlan);

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-20"
      >
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
          <MacroStats label="Calories" value={plan.targetCalories} icon={Flame} color="var(--accent)" />
          <MacroStats label="Protein" value={plan.targetProtein} unit="g" icon={Zap} color="var(--secondary)" />
          <MacroStats label="Carbs" value={plan.targetCarbs} unit="g" icon={Droplets} color="var(--primary)" />
          <MacroStats label="Fat" value={plan.targetFat} unit="g" icon={Info} color="#f97316" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-12">
            <AccordionSection title="System Overview" icon={Info} defaultOpen={true}>
              <div className="whitespace-pre-wrap text-sm md:text-base">
                {plan.workoutPlan.split('\n\n')[0]}
              </div>
            </AccordionSection>

            <div className="space-y-6">
              <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter border-l-4 border-primary pl-4 mb-8">Weekly Schedule</h2>
              {dayPlans.map((day, idx) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <DayCard {...day} />
                </motion.div>
              ))}
            </div>

            <AccordionSection title="Nutrition Strategy" icon={Utensils} accentColor="var(--primary)">
              <div className="whitespace-pre-wrap text-sm md:text-base">
                {plan.dietPlan}
              </div>
            </AccordionSection>
          </div>

          <aside className="hidden xl:block space-y-6">
            <div className="sticky top-8">
              <div className="glass-card rounded-3xl p-6 border border-white/5">
                <h3 className="text-sm font-display font-black uppercase italic tracking-widest text-primary mb-4">Quick Navigation</h3>
                <nav className="space-y-2">
                  {['Overview', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Nutrition'].map((item) => (
                    <button 
                      key={item}
                      className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="mt-6 glass-card rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
                <Zap className="text-primary mb-4 w-6 h-6" />
                <h4 className="font-display font-black uppercase italic text-sm mb-2">Pro Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Consistency is the core of the protocol. Execute every set with precision.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </Layout>
  );
}

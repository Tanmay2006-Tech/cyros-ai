import { Layout } from "@/components/Layout";
import { Trophy, Zap, Star, Award, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Challenges() {
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
      const storedXp = localStorage.getItem("cyros_xp");
      const storedStreak = localStorage.getItem("cyros_streak");
      if (storedXp) setXp(parseInt(storedXp));
      if (storedStreak) setStreak(parseInt(storedStreak));
    }, []);

    const getTier = (xp: number) => {
      if (xp >= 3000) return { name: "Gold", color: "text-yellow-400", icon: Award };
      if (xp >= 700) return { name: "Silver", color: "text-slate-300", icon: Award };
      if (xp >= 300) return { name: "Bronze", color: "text-amber-600", icon: Award };
      return { name: "Novice", color: "text-primary", icon: Star };
    };

    const tier = getTier(xp);

    return (
      <Layout>
        <div className="max-w-[1000px] mx-auto py-8">
          <header className="mb-12">
            <h1 className="text-5xl font-display font-black text-gradient uppercase italic tracking-tighter mb-4">
              Elite Challenges
            </h1>
            <p className="text-muted-foreground uppercase tracking-[0.3em] text-sm font-bold opacity-70">
              Push your limits // Gain XP // Ascend Tiers
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-primary/20 transition-all" />
              <Zap className="w-10 h-10 text-primary mb-4" />
              <div className="text-4xl font-display font-black italic tracking-tighter mb-1">{xp.toLocaleString()}</div>
              <div className="text-xs uppercase font-black tracking-widest text-muted-foreground">Total XP</div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -z-10 group-hover:bg-orange-500/20 transition-all" />
              <Flame className="w-10 h-10 text-orange-500 mb-4" />
              <div className="text-4xl font-display font-black italic tracking-tighter mb-1">{streak}</div>
              <div className="text-xs uppercase font-black tracking-widest text-muted-foreground">Day Streak</div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10 group-hover:bg-accent/20 transition-all" />
              <tier.icon className={`w-10 h-10 ${tier.color} mb-4`} />
              <div className={`text-4xl font-display font-black italic tracking-tighter mb-1 ${tier.color}`}>
                {tier.name}
              </div>
              <div className="text-xs uppercase font-black tracking-widest text-muted-foreground">Current Tier</div>
            </motion.div>
          </div>

          <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
            <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
              <Trophy className="text-primary w-6 h-6" /> Milestone Rewards
            </h2>
            
            <div className="space-y-6">
              {[
                { label: "Bronze Tier", target: 300, icon: Award, color: "text-amber-600" },
                { label: "Silver Tier", target: 700, icon: Award, color: "text-slate-300" },
                { label: "Gold Tier", target: 3000, icon: Award, color: "text-yellow-400" },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-black/40 ${m.color}`}>
                      <m.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-display font-black uppercase italic tracking-tight">{m.label}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Target: {m.target} XP</div>
                    </div>
                  </div>
                  {xp >= m.target ? (
                    <div className="text-primary font-black text-xs uppercase italic tracking-widest">Unlocked</div>
                  ) : (
                    <div className="text-muted-foreground font-black text-xs uppercase italic tracking-widest opacity-50">Locked</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
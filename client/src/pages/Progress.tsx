import * as React from "react";
import { Layout } from "@/components/Layout";
import { useMeals } from "@/hooks/use-meals";
import { useLatestPlan } from "@/hooks/use-plans";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Trophy, Zap } from "lucide-react";

export default function Progress() {
  const { data: meals } = useMeals();
  const { data: plan } = useLatestPlan();

  // Process data for charts
  const chartData = React.useMemo(() => {
    if (!meals) return [];
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayMeals = meals.filter(m => m.consumedAt && m.consumedAt.startsWith(date));
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
        protein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
        targetCals: plan?.targetCalories || 2000,
        targetProtein: plan?.targetProtein || 150
      };
    });
  }, [meals, plan]);

  // Mock Leaderboard Data
  const leaderboard = [
    { name: "Sachin (You)", xp: parseInt(localStorage.getItem("cyros_xp") || "0"), isUser: true },
    { name: "Alex_Neo", xp: 2850, isUser: false },
    { name: "Cyber_Groot", xp: 2100, isUser: false },
    { name: "Neural_Link", xp: 1850, isUser: false },
    { name: "V_Phantom", xp: 1200, isUser: false },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <Layout>
      <div className="max-w-[1100px] mx-auto py-8 space-y-12 pb-24">
        <header>
          <h1 className="text-5xl font-display font-black text-gradient uppercase italic tracking-tighter mb-4">
            Performance Analytics
          </h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-sm font-bold opacity-70">
            Biometric Data Visualization // Neural Rank
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Area */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-[2.5rem] border border-white/5"
            >
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="text-primary w-6 h-6" />
                <h2 className="text-xl font-display font-black uppercase italic tracking-tight">Caloric Intake vs Target</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="calories" stroke="var(--primary)" fillOpacity={1} fill="url(#colorCals)" />
                    <Line type="monotone" dataKey="targetCals" stroke="var(--secondary)" strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 rounded-[2.5rem] border border-white/5"
            >
              <div className="flex items-center gap-3 mb-8">
                <Zap className="text-secondary w-6 h-6" />
                <h2 className="text-xl font-display font-black uppercase italic tracking-tight">Protein Synthesis</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="protein" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="targetProtein" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 rounded-[2.5rem] border border-white/5 h-full"
            >
              <div className="flex items-center gap-3 mb-8">
                <Trophy className="text-yellow-500 w-6 h-6" />
                <h2 className="text-xl font-display font-black uppercase italic tracking-tight">Global Leaderboard</h2>
              </div>
              <div className="space-y-4">
                {leaderboard.map((player, i) => (
                  <div 
                    key={player.name} 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      player.isUser 
                        ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`font-display font-black italic text-lg ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                        #{i + 1}
                      </span>
                      <div>
                        <div className="font-bold text-sm uppercase tracking-tight">{player.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{player.xp} XP</div>
                      </div>
                    </div>
                    {i === 0 && <Trophy className="w-4 h-4 text-primary animate-bounce" />}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-primary">
                    <Activity className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest italic">Rank: Alpha-1</span>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Top 0.01%
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

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
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map((date, index) => {
      const dayMeals = meals?.filter(m => m.consumedAt && m.consumedAt.startsWith(date)) || [];
      
      // If no meals, generate some "demo" data for the prototype exhibition
      const hasMeals = dayMeals.length > 0;
      const demoCals = [1850, 2100, 1950, 2200, 2050, 1900, 2150];
      const demoProtein = [140, 155, 145, 160, 150, 142, 158];
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: hasMeals ? dayMeals.reduce((sum, m) => sum + m.calories, 0) : demoCals[index % demoCals.length],
        protein: hasMeals ? dayMeals.reduce((sum, m) => sum + m.protein, 0) : demoProtein[index % demoProtein.length],
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
    { name: "Personal_Link", xp: 1850, isUser: false },
    { name: "V_Phantom", xp: 1200, isUser: false },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <Layout>
      <div className="max-w-[1100px] mx-auto py-8 space-y-12 pb-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-display font-black text-gradient uppercase italic tracking-tighter mb-4">
              Performance Analytics
            </h1>
            <p className="text-muted-foreground uppercase tracking-[0.3em] text-sm font-bold opacity-70">
              Health Data Visualization // Leaderboard Rank
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-6 py-4 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">Average Accuracy</div>
              <div className="text-2xl font-display font-black italic text-white">98.4%</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Area */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">Live Data</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="text-primary w-6 h-6" />
                <h2 className="text-xl font-display font-black uppercase italic tracking-tight">Calories (kcal)</h2>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.6)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.6)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip 
                      cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                      contentStyle={{ 
                        backgroundColor: '#111', 
                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                        borderRadius: '12px',
                      }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ color: 'var(--primary)', marginBottom: '4px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="calories" 
                      name="Logged"
                      stroke="#a855f7" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorCals)" 
                      animationDuration={2000}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="targetCals" 
                      name="Target"
                      stroke="#22d3ee" 
                      strokeWidth={3}
                      strokeDasharray="8 4" 
                      dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }} 
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle"
                      content={({ payload }) => (
                        <div className="flex gap-4 mb-6">
                          {payload?.map((entry: any, index: number) => (
                            <div key={`item-${index}`} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
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
                <h2 className="text-xl font-display font-black uppercase italic tracking-tight">Protein Tracking</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Bar 
                      dataKey="protein" 
                      name="Logged"
                      fill="#22d3ee" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                      animationDuration={1500}
                    />
                    <Bar 
                      dataKey="targetProtein" 
                      name="Target"
                      fill="rgba(168, 85, 247, 0.2)" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle"
                      content={({ payload }) => (
                        <div className="flex gap-4 mb-6">
                          {payload?.map((entry: any, index: number) => (
                            <div key={`item-${index}`} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
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
                  <motion.div 
                    key={player.name} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.02] cursor-default ${
                      player.isUser 
                        ? 'bg-primary/20 border-primary/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]' 
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-black italic text-sm ${
                        i === 0 ? 'bg-primary text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/5 text-muted-foreground'
                      }`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm uppercase tracking-tight flex items-center gap-2">
                          {player.name}
                          {player.isUser && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{player.xp.toLocaleString()} XP</div>
                      </div>
                    </div>
                    {i === 0 ? (
                      <Trophy className="w-4 h-4 text-primary animate-bounce" />
                    ) : (
                      <div className="text-[10px] font-black text-muted-foreground/30 italic">#{i+1}</div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-primary">
                    <Activity className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest italic">Rank: Pro</span>
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

import { useUser, useUpdateUser } from "@/hooks/use-users";
import { useGeneratePlan } from "@/hooks/use-plans";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { FormEvent } from "react";
import { Loader2, Sparkles, Activity } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const { data: user, isLoading } = useUser();
  const updateMutation = useUpdateUser();
  const generateMutation = useGeneratePlan();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6 mt-4">
          <div className="h-10 bg-white/5 rounded-lg w-48"></div>
          <div className="glass-card p-8 rounded-3xl h-96"></div>
        </div>
      </Layout>
    );
  }

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await updateMutation.mutateAsync({
        age: Number(fd.get("age")),
        weight: Number(fd.get("weight")),
        height: Number(fd.get("height")),
        goal: fd.get("goal") as string,
        activityLevel: fd.get("activityLevel") as string,
      });
      toast({
        title: "Profile Updated",
        description: "Your health metrics have been saved successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  async function handleGeneratePlan() {
    try {
      await generateMutation.mutateAsync();
      toast({
        title: "AI Plan Generated",
        description: "Your personalized plan is ready!",
      });
      setLocation("/plan");
    } catch (err: any) {
      toast({
        title: "Generation Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Layout>
      <header className="mb-10 mt-2">
        <h1 className="text-4xl font-display font-bold text-gradient mb-2">Health Profile</h1>
        <p className="text-muted-foreground">Keep your metrics up to date for precise AI coaching.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="glass-card rounded-[2rem] p-6 md:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -z-10" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Age (Years)</label>
                <input
                  name="age"
                  type="number"
                  defaultValue={user?.age || ""}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="e.g. 28"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Weight (kg)</label>
                <input
                  name="weight"
                  type="number"
                  defaultValue={user?.weight || ""}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="e.g. 75"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Height (cm)</label>
                <input
                  name="height"
                  type="number"
                  defaultValue={user?.height || ""}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="e.g. 180"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Primary Goal</label>
                <select
                  name="goal"
                  defaultValue={user?.goal || "maintain"}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                >
                  <option value="lose_weight" className="bg-card">Lose Weight</option>
                  <option value="maintain" className="bg-card">Maintain Weight</option>
                  <option value="build_muscle" className="bg-card">Build Muscle</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Activity Level</label>
                <select
                  name="activityLevel"
                  defaultValue={user?.activityLevel || "moderate"}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                >
                  <option value="sedentary" className="bg-card">Sedentary (Little or no exercise)</option>
                  <option value="light" className="bg-card">Lightly Active (Light exercise 1-3 days/week)</option>
                  <option value="moderate" className="bg-card">Moderately Active (Moderate exercise 3-5 days/week)</option>
                  <option value="active" className="bg-card">Very Active (Hard exercise 6-7 days/week)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full py-4 rounded-xl font-bold bg-white/10 text-foreground hover:bg-white/15 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
            >
              {updateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card rounded-[2rem] p-6 text-center h-full flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-3">AI Intelligence</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Generate a cutting-edge, personalized protocol based on your latest biometric data.
            </p>
            
            <button
              onClick={handleGeneratePlan}
              disabled={generateMutation.isPending || !user?.weight}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Data...
                </>
              ) : (
                "Generate New Plan"
              )}
            </button>
            {!user?.weight && (
              <p className="text-xs text-destructive mt-3 font-medium">Please save your profile first.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

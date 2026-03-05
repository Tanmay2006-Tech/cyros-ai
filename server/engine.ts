import OpenAI from "openai";

let openai: OpenAI;
let modelName: string;

if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY && process.env.AI_INTEGRATIONS_OPENAI_BASE_URL) {
  openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
  modelName = "gpt-4o";
} else if (process.env.GEMINI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
  modelName = "gemini-2.0-flash";
} else {
  openai = null as any;
  modelName = "";
  console.warn("No AI API key found. Set GEMINI_API_KEY for free local use.");
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const EXERCISES = {
  chest: ["Bench Press", "Incline DB Press", "Cable Flyes", "Push-ups", "Dumbbell Pullover", "Chest Dips"],
  back: ["Deadlift", "Barbell Row", "Pull Ups", "Lat Pulldown", "Cable Row", "T-Bar Row"],
  legs: ["Squats", "Leg Press", "Romanian Deadlift", "Lunges", "Leg Curl", "Calf Raises", "Bulgarian Split Squat"],
  shoulders: ["Shoulder Press", "Lateral Raises", "Face Pulls", "Arnold Press", "Rear Delt Flyes", "Upright Row"],
  arms: ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Skull Crushers", "Cable Curls", "Overhead Extension"],
  recovery: ["Yoga Flow", "Stretching", "Light Walk", "Foam Rolling", "Mobility Drills", "Meditation"]
};

const CHALLENGES = [
  "10k Steps", "12k Steps", "8k Steps", "3L Water", "2.5L Water", "No Junk Food",
  "No Sugar", "Cook Own Meal", "High Protein Day", "Meditate 10min", "Sleep 8hrs",
  "Meal Prep", "Take Stairs", "Morning Walk", "Evening Stretch", "Track All Meals"
];

const SETS_OPTIONS = ["3x8", "3x10", "3x12", "3x15", "4x6", "4x8", "4x10", "4x12"];
const REST_OPTIONS = ["45s", "60s", "90s", "120s"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function generateRandomPlan(): string {
  const muscleGroups = ["chest", "legs", "recovery", "back", "shoulders", "arms", "recovery"] as const;
  const intensities = ["High", "Moderate", "Recovery", "High", "Moderate", "High", "Recovery"];

  const week = DAYS.map((day, i) => {
    const group = muscleGroups[i];
    const intensity = intensities[i];
    const isRecovery = intensity === "Recovery";

    const exercises = EXERCISES[group];
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, isRecovery ? 2 : rand(2, 3));

    const workout = selected.map(name => ({
      name,
      sets: isRecovery ? `${rand(15, 30)}min` : pick(SETS_OPTIONS),
      rest: isRecovery ? "-" : pick(REST_OPTIONS),
    }));

    const baseCal = isRecovery ? rand(1700, 1900) : intensity === "High" ? rand(2100, 2400) : rand(1900, 2100);
    const diet = {
      calories: baseCal,
      protein: rand(120, 180),
      carbs: rand(180, 260),
      fats: rand(45, 75),
    };

    const shuffledChallenges = [...CHALLENGES].sort(() => Math.random() - 0.5);
    const challenges = shuffledChallenges.slice(0, rand(2, 3));

    return { day, intensity, workout, diet, challenges };
  });

  return JSON.stringify({ week });
}

async function callWithRetry(prompt: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      return response.choices[0]?.message?.content ?? generateRandomPlan();
    } catch (err: any) {
      console.warn(`AI attempt ${attempt}/${retries} failed:`, err?.status || err?.message);
      if (err?.status === 429 && attempt < retries) {
        const delay = attempt * 5000;
        console.warn(`Rate limited. Retrying in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      if (attempt === retries) {
        console.warn("All AI attempts failed. Using randomized fitness data.");
        return generateRandomPlan();
      }
    }
  }
  return generateRandomPlan();
}

export async function generatePlan(prompt: string) {
  if (!openai) {
    return generateRandomPlan();
  }
  return callWithRetry(prompt);
}

export default openai;

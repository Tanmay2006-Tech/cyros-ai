import OpenAI from "openai";

let provider: "openai" | "openrouter" | "gemini" | "none" = "none";
let openaiClient: OpenAI | null = null;
let geminiApiKey: string = "";

if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY && process.env.AI_INTEGRATIONS_OPENAI_BASE_URL) {
  openaiClient = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
  provider = "openai";
  console.log("AI Provider: OpenAI (GPT-4o)");
} else if (process.env.OPENROUTER_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });
  provider = "openrouter";
  console.log("AI Provider: OpenRouter (Free models)");
} else if (process.env.GEMINI_API_KEY) {
  geminiApiKey = process.env.GEMINI_API_KEY;
  provider = "gemini";
  console.log("AI Provider: Google Gemini (2.0 Flash - Free)");
} else {
  console.warn("No AI API key found. Set OPENROUTER_API_KEY for free local use.");
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

const MEAL_OPTIONS = {
  breakfast: [
    { name: "Oatmeal with Banana & Whey Protein", calories: 420 },
    { name: "Scrambled Eggs with Whole Wheat Toast", calories: 380 },
    { name: "Greek Yogurt Parfait with Granola & Berries", calories: 350 },
    { name: "Protein Pancakes with Honey", calories: 450 },
    { name: "Egg White Omelette with Spinach & Cheese", calories: 320 },
    { name: "Overnight Oats with Chia Seeds & Almonds", calories: 400 },
    { name: "Avocado Toast with Poached Eggs", calories: 430 },
  ],
  lunch: [
    { name: "Grilled Chicken with Brown Rice & Broccoli", calories: 620 },
    { name: "Turkey Wrap with Veggies & Hummus", calories: 550 },
    { name: "Tuna Salad with Quinoa & Avocado", calories: 580 },
    { name: "Chicken Stir-Fry with Mixed Vegetables", calories: 600 },
    { name: "Lentil Soup with Whole Grain Bread", calories: 480 },
    { name: "Grilled Fish Tacos with Slaw", calories: 520 },
    { name: "Paneer Tikka with Roti & Dal", calories: 650 },
  ],
  snack: [
    { name: "Protein Shake with Peanut Butter", calories: 280 },
    { name: "Greek Yogurt with Almonds", calories: 220 },
    { name: "Mixed Nuts & Dried Fruits", calories: 250 },
    { name: "Apple Slices with Almond Butter", calories: 200 },
    { name: "Cottage Cheese with Walnuts", calories: 230 },
    { name: "Protein Bar", calories: 260 },
    { name: "Boiled Eggs with Hummus", calories: 240 },
  ],
  dinner: [
    { name: "Salmon with Sweet Potato & Spinach", calories: 580 },
    { name: "Grilled Chicken Breast with Roasted Vegetables", calories: 520 },
    { name: "Lean Beef Steak with Mashed Potatoes", calories: 650 },
    { name: "Baked Fish with Quinoa & Asparagus", calories: 500 },
    { name: "Chicken Curry with Basmati Rice", calories: 620 },
    { name: "Tofu Stir-Fry with Brown Rice & Bok Choy", calories: 480 },
    { name: "Egg Bhurji with Chapati & Salad", calories: 550 },
  ],
};

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

    const meals = [
      { time: "Breakfast", ...pick(MEAL_OPTIONS.breakfast) },
      { time: "Lunch", ...pick(MEAL_OPTIONS.lunch) },
      { time: "Snack", ...pick(MEAL_OPTIONS.snack) },
      { time: "Dinner", ...pick(MEAL_OPTIONS.dinner) },
    ];

    const shuffledChallenges = [...CHALLENGES].sort(() => Math.random() - 0.5);
    const challenges = shuffledChallenges.slice(0, rand(2, 3));

    return { day, intensity, workout, diet, meals, challenges };
  });

  return JSON.stringify({ week });
}

async function callOpenRouter(prompt: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await openaiClient!.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      const content = response.choices[0]?.message?.content;
      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          JSON.parse(jsonMatch[0]);
          return jsonMatch[0];
        }
      }
      console.warn("OpenRouter response was not valid JSON.");
      return generateRandomPlan();
    } catch (err: any) {
      console.warn(`OpenRouter attempt ${attempt}/${retries} failed:`, err?.message || err);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }
      console.warn("All OpenRouter attempts failed. Using randomized fitness data.");
      return generateRandomPlan();
    }
  }
  return generateRandomPlan();
}

async function callGemini(prompt: string, retries = 3): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.warn(`Gemini API error ${res.status}: ${errBody}`);
        throw new Error(`Gemini ${res.status}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          JSON.parse(jsonMatch[0]);
          return jsonMatch[0];
        }
      }
      return generateRandomPlan();
    } catch (err: any) {
      console.warn(`Gemini attempt ${attempt}/${retries} failed:`, err?.message || err);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, attempt * 5000));
        continue;
      }
      return generateRandomPlan();
    }
  }
  return generateRandomPlan();
}

async function callOpenAI(prompt: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await openaiClient!.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      return response.choices[0]?.message?.content ?? generateRandomPlan();
    } catch (err: any) {
      console.warn(`OpenAI attempt ${attempt}/${retries} failed:`, err?.status || err?.message);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, attempt * 5000));
        continue;
      }
      return generateRandomPlan();
    }
  }
  return generateRandomPlan();
}

export async function generatePlan(prompt: string) {
  if (provider === "openrouter") {
    return callOpenRouter(prompt);
  } else if (provider === "gemini") {
    return callGemini(prompt);
  } else if (provider === "openai") {
    return callOpenAI(prompt);
  }
  return generateRandomPlan();
}

export default { provider };

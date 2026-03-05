import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;

if (apiKey && apiKey !== "your_openai_api_key" && apiKey !== "your_openai_key_here") {
  openai = new OpenAI({ apiKey });
}

export async function generatePlan(prompt: string) {
  if (!openai) {
    console.warn("OpenAI not initialized: Missing API Key. Returning sample data.");
    return JSON.stringify({
      week: [
        {
          day: "Monday", intensity: "High",
          workout: [{ name: "Bench Press", sets: "4x8", rest: "90s" }, { name: "Incline DB Press", sets: "3x10", rest: "60s" }],
          diet: { calories: 2200, protein: 160, carbs: 240, fats: 65 },
          challenges: ["10k Steps", "3L Water", "No Junk Food"]
        },
        {
          day: "Tuesday", intensity: "Moderate",
          workout: [{ name: "Squats", sets: "4x10", rest: "90s" }, { name: "Leg Press", sets: "3x12", rest: "60s" }],
          diet: { calories: 2100, protein: 150, carbs: 220, fats: 60 },
          challenges: ["8k Steps", "2.5L Water"]
        },
        {
          day: "Wednesday", intensity: "Recovery",
          workout: [{ name: "Yoga Flow", sets: "30min", rest: "-" }, { name: "Stretching", sets: "15min", rest: "-" }],
          diet: { calories: 1900, protein: 130, carbs: 200, fats: 55 },
          challenges: ["Meditate 10min", "Sleep 8hrs"]
        },
        {
          day: "Thursday", intensity: "High",
          workout: [{ name: "Deadlift", sets: "4x6", rest: "120s" }, { name: "Barbell Row", sets: "3x10", rest: "60s" }],
          diet: { calories: 2300, protein: 170, carbs: 250, fats: 70 },
          challenges: ["10k Steps", "3L Water", "High Protein"]
        },
        {
          day: "Friday", intensity: "Moderate",
          workout: [{ name: "Shoulder Press", sets: "4x10", rest: "60s" }, { name: "Lateral Raises", sets: "3x15", rest: "45s" }],
          diet: { calories: 2100, protein: 155, carbs: 220, fats: 60 },
          challenges: ["Cook Own Meal", "No Sugar"]
        },
        {
          day: "Saturday", intensity: "High",
          workout: [{ name: "Pull Ups", sets: "4x8", rest: "90s" }, { name: "Bicep Curls", sets: "3x12", rest: "45s" }],
          diet: { calories: 2200, protein: 160, carbs: 230, fats: 65 },
          challenges: ["12k Steps", "3L Water"]
        },
        {
          day: "Sunday", intensity: "Recovery",
          workout: [{ name: "Light Walk", sets: "45min", rest: "-" }, { name: "Foam Rolling", sets: "15min", rest: "-" }],
          diet: { calories: 1800, protein: 120, carbs: 190, fats: 50 },
          challenges: ["Rest Day", "Meal Prep"]
        }
      ]
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  return response.choices[0]?.message?.content;
}

export default openai;

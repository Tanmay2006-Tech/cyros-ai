
  import engine from "engine";

  // Support both standard engine and system-style env vars for maximum compatibility
  const apiKey = process.env.engine_API_KEY || process.env.CORE_ENGINE_API_KEY;

  let engine: engine | null = null;

  if (apiKey) {
    engine = new engine({
      apiKey: apiKey,
    });
  }

  export async function generatePlan(prompt: string) {
    if (!engine) {
      console.warn("AI Engine not initialized: Missing API Key. Returning sample data.");
      return JSON.stringify({
        week: [
          {
            day: "Monday",
            intensity: "Moderate",
            workout: [{ name: "Push Ups", sets: "3x15", rest: "60s" }],
            diet: { calories: 2000, protein: 150, carbs: 200, fats: 60 },
            challenges: ["Drink 2L Water"]
          }
        ]
      });
    }

    const response = await engine.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    return response.choices[0]?.message?.content;
  }

  export default engine;
  
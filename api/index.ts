import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";
import { api } from "../shared/routes";
import { z } from "zod";
import { generatePlan } from "../server/engine";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let seeded = false;
async function ensureSeedData() {
  if (seeded) return;
  const user = await storage.getUser(1);
  if (!user) {
    const { db } = await import("../server/db");
    const { users } = await import("../shared/schema");
    await db.insert(users).values({
      id: 1,
      username: "Sachin",
      password: "password123",
      age: 28,
      weight: 75,
      height: 175,
      goal: "maintain",
      activityLevel: "moderate",
    });

    await storage.createPlan({
      userId: 1,
      dietPlan: "Sample Diet Plan",
      workoutPlan: "Sample Workout Plan",
      targetCalories: 2400,
      targetProtein: 160,
      targetCarbs: 250,
      targetFat: 80,
    });

    await storage.createMeal({
      userId: 1,
      name: "Morning Oatmeal",
      calories: 350,
      protein: 15,
      carbs: 60,
      fat: 8,
    });
  }
  seeded = true;
}

app.get(api.users.me.path, async (req, res) => {
  await ensureSeedData();
  const user = await storage.getUser(1);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

app.put(api.users.update.path, async (req, res) => {
  await ensureSeedData();
  try {
    const input = api.users.update.input.parse(req.body);
    const user = await storage.updateUser(1, input);
    res.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.errors[0].message,
        field: err.errors[0].path.join("."),
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post(api.plans.generate.path, async (req, res) => {
  await ensureSeedData();
  try {
    const user = await storage.getUser(1);
    if (!user) return res.status(404).json({ message: "User not found" });

    const prompt = `
      You are an expert AI Diet & Fitness Planner for "Cyros AI", an elite fitness operating system.
      Create a personalized weekly plan for a user with these metrics:
      Age: ${user.age}, Weight: ${user.weight}kg, Height: ${user.height}cm, Goal: ${user.goal}, Activity: ${user.activityLevel}, Diet Preference: ${user.dietPreference || "non_veg"}

      Respond ONLY with a JSON object in this exact structure, no markdown, no text outside JSON:
      {
        "week": [
          {
            "day": "Monday",
            "intensity": "High",
            "workout": [
              { "name": "Bench Press", "sets": "4x8", "rest": "90s" },
              { "name": "Incline DB Press", "sets": "3x10", "rest": "60s" }
            ],
            "diet": { "calories": 2100, "protein": 150, "carbs": 220, "fats": 65 },
            "meals": [
              { "time": "Breakfast", "name": "Oatmeal with Banana & Whey Protein", "calories": 450 },
              { "time": "Lunch", "name": "Grilled Chicken with Brown Rice & Broccoli", "calories": 650 },
              { "time": "Snack", "name": "Greek Yogurt with Almonds", "calories": 250 },
              { "time": "Dinner", "name": "Salmon with Sweet Potato & Spinach", "calories": 550 }
            ],
            "challenges": ["10k Steps", "3L Water", "No Junk Food"]
          }
        ]
      }

      Rules:
      - Include all 7 days Monday through Sunday.
      - Vary intensity: High, Moderate, Recovery.
      - Match macros to intensity.
      - Include 4-5 meals per day with realistic food names and calorie estimates.
      - IMPORTANT: Diet preference is "${user.dietPreference || "non_veg"}". If "veg", use ONLY vegetarian meals. If "vegan", only plant-based. If "eggetarian", vegetarian + eggs. If "non_veg", all foods allowed.
    `;

    const content = await generatePlan(prompt, user.dietPreference || "non_veg");
    if (!content) throw new Error("No response from AI");

    const generatedData = JSON.parse(content);
    const avgCalories = Math.round(generatedData.week.reduce((acc: number, d: any) => acc + d.diet.calories, 0) / 7);
    const avgProtein = Math.round(generatedData.week.reduce((acc: number, d: any) => acc + d.diet.protein, 0) / 7);
    const avgCarbs = Math.round(generatedData.week.reduce((acc: number, d: any) => acc + d.diet.carbs, 0) / 7);
    const avgFat = Math.round(generatedData.week.reduce((acc: number, d: any) => acc + d.diet.fats, 0) / 7);

    const plan = await storage.createPlan({
      userId: 1,
      dietPlan: JSON.stringify(generatedData.week),
      workoutPlan: JSON.stringify(generatedData.week),
      targetCalories: avgCalories,
      targetProtein: avgProtein,
      targetCarbs: avgCarbs,
      targetFat: avgFat,
    });

    res.status(201).json(plan);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: error?.message || "Failed to generate plan" });
  }
});

app.get(api.plans.latest.path, async (req, res) => {
  await ensureSeedData();
  const plan = await storage.getLatestPlan(1);
  if (!plan) return res.status(404).json({ message: "No plan found" });
  res.json(plan);
});

app.get(api.meals.list.path, async (req, res) => {
  await ensureSeedData();
  const meals = await storage.getMeals(1);
  res.json(meals);
});

app.post(api.meals.create.path, async (req, res) => {
  await ensureSeedData();
  try {
    const bodySchema = api.meals.create.input.extend({
      calories: z.coerce.number(),
      protein: z.coerce.number(),
      carbs: z.coerce.number(),
      fat: z.coerce.number(),
    });
    const input = bodySchema.parse(req.body);
    const meal = await storage.createMeal({ ...input, userId: 1 });
    res.status(201).json(meal);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.errors[0].message,
        field: err.errors[0].path.join("."),
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete(api.meals.delete.path, async (req, res) => {
  await ensureSeedData();
  await storage.deleteMeal(Number(req.params.id));
  res.status(204).send();
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

export default app;

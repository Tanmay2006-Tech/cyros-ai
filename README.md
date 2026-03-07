# Cyros AI

Cyros AI is a web-based prototype that generates personalized diet and fitness plans using generative AI.

The system takes user metrics such as **age, weight, height, fitness goal, activity level, and dietary preference**, and generates a structured **7-day plan** including workouts, meals, and daily challenges tailored to the user.

This project was developed as a **4th semester CSE exhibition prototype** to demonstrate how generative AI can be integrated with a full-stack web application.

---

## Live Demo

https://cyros-ai.vercel.app

---

## Features

### AI Plan Generation

Cyros AI generates a personalized **7-day workout and diet plan** using **Google Gemini AI via the OpenRouter API**.

Each plan includes:

- Daily workout routines
- Exercises with sets and rest periods
- 4–5 meals per day
- Estimated calorie values
- Daily fitness challenges

---

### Diet Preference Support

Users can generate plans based on dietary preference:

- Vegetarian  
- Non-Vegetarian  
- Vegan  
- Eggetarian  

---

### Nutrition Tracker

Users can log meals and track their daily nutrition intake:

- Calories
- Protein
- Carbohydrates
- Fat

---

### Analytics Dashboard

The analytics page visualizes nutrition trends using charts, including:

- Weekly calorie intake
- Protein consumption trends

This helps users understand their progress and stay consistent with their plan.

---

### Gamification (Elite Zone)

To increase engagement, the platform includes a gamification system.

Users can:

- Complete daily challenges
- Earn XP points
- Maintain streaks
- Progress through tiers (**Novice → Diamond**)
- View leaderboard rankings

---

### PDF Export

Users can download the generated weekly plan as a **PDF file** for offline reference.

---

### Responsive Design

The interface is responsive and works on **both desktop and mobile devices**.

---

## Fail-Safe Mechanism

If the AI API request fails, the system automatically switches to a **fallback generator** that uses predefined diet and workout datasets.

The fallback system filters plans based on:

- Diet preference
- Fitness goal
- Activity level

This ensures the user always receives a valid plan even if the AI service is unavailable.

---

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- Node.js
- Express

### Database
- PostgreSQL (Neon)

### AI Integration
- OpenRouter API
- Google Gemini 2.0 Flash

### ORM
- Drizzle ORM

### Charts
- Recharts

### Deployment
- Vercel (Serverless)

---

## System Architecture

```
User
 ↓
React Frontend
 ↓
Express API
 ↓
Gemini AI (OpenRouter)
 ↓
PostgreSQL Database (Neon)
```

If the AI request fails:

```
Express API
 ↓
Fallback Generator
 ↓
Predefined Diet + Workout Dataset
```

---

## Database Schema

The system uses three main tables.

### Users

Stores user profile data.

Fields include:

- username
- age
- weight
- height
- fitness goal
- activity level
- diet preference

---

### Plans

Stores generated diet and workout plans.

Fields include:

- user_id
- diet_plan (JSON)
- workout_plan (JSON)
- target calories
- target macros
- created_at

---

### Meals

Stores logged meals for nutrition tracking.

Fields include:

- meal name
- calories
- protein
- carbs
- fat
- timestamp

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Tanmay2006-Tech/cyros-ai.git
cd cyros-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file in the project root and add:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cyros_db
SESSION_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Open the application

```
http://localhost:5000
```

---

## Future Improvements

Possible improvements for future versions include:

- AI chatbot for fitness guidance
- Water intake tracking
- Workout rest timer
- Progress photo tracking
- Weekly fitness reports
- Integration with wearable devices (Fitbit / Apple Watch)

---

## Exhibition

This project was showcased at **Smart Solutions Exhibition 2.0** under **Category-I: Present a Project**, organized during **Ekatva – University Annual Fest 2026** by the **Board of Professional Activities, Shri Mata Vaishno Devi University (SMVDU)**.

The exhibition highlights innovative student projects that demonstrate practical applications of technology and problem-solving.

---

## License

This project is intended for **educational and demonstration purposes**.

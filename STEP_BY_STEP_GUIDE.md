# Step-by-Step Local Setup Guide for Cyros.AI

Follow these exact steps to run the project on your laptop for the exhibition:

### Step 1: Install Node.js
Download and install the **LTS version** of Node.js from [nodejs.org](https://nodejs.org/). This provides the runtime needed for the app.

### Step 2: Install PostgreSQL
1. Download and install **PostgreSQL** from [postgresql.org](https://www.postgresql.org/download/).
2. During installation, set a password (remember it!).
3. Create a new database named `cyros_db` using pgAdmin or the terminal.

### Step 3: Prepare the Folder
1. Unzip the project files into a folder on your computer.
2. Open that folder in **VS Code**.

### Step 4: Create Environment File (.env)

**CRITICAL**: You must create a file named exactly `.env` (with a dot at the start) in the root folder. If you do not do this, you will get the "DATABASE_URL must be set" error.
Create a new file named `.env` in the root folder and paste this (replace with your database password):
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/cyros_db
SESSION_SECRET=select_any_random_string
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 5: Install Project Packages
Open the VS Code terminal (Ctrl + `) and type:
```bash
npm install
```

### Step 6: Setup the Database Tables
In the same terminal, run:
```bash
npm run db:push
```

### Step 7: Start the Application
Run the following command to start both the backend and frontend:
```bash
npm run dev
```

### Step 8: Open the App
Open your browser and go to:
**http://localhost:5000**

---
**Exhibition Tip:** If the internet is slow, the "Plan Generation" might fail. Ensure your OpenAI API key is active and has credits!


### Troubleshooting: Windows "NODE_ENV" Error
If you see an error about `NODE_ENV`, I have already updated `package.json` to work on Windows by default. Just run `npm run dev` again.
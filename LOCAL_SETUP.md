# How to Run Cyros.AI Locally in VS Code

Follow these steps to get your project running on your own computer for the exhibition.

### 1. Prerequisites
- **Node.js**: Install the latest LTS version from [nodejs.org](https://nodejs.org/).
- **PostgreSQL**: Install and ensure it is running on your machine.
- **VS Code**: Open your project folder in VS Code.

### 2. Setup Environment
Create a `.env` file in the root directory and add:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/cyros_db
SESSION_SECRET=your_random_secret_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Install Dependencies
Open the VS Code terminal and run:
```bash
npm install
```

### 4. Initialize Database
Push the schema to your local PostgreSQL:
```bash
npm run db:push
```

### 5. Run the Project
Start the development server (Frontend + Backend):
```bash
npm run dev
```

### 6. View the App
Open your browser and go to:
`http://localhost:5000`

---
**Note for Exhibition:** Keep your laptop plugged into power and ensure your PostgreSQL service is set to "Start Automatically" so the app is always ready.

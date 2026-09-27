# TitleNode - Complete In-Depth Laptop Setup Guide

This guide walks you through setting up and running TitleNode on your laptop from scratch using GitHub and Docker, ensuring your local database, advocate review UI, and scrapers work identically to your desktop.

---

## 1. Prerequisites on Your Laptop

Before cloning the project, ensure you have the following installed on your laptop:

1. **Git**: https://git-scm.com/downloads
2. **Docker Desktop**: https://www.docker.com/products/docker-desktop/
   - Ensure Docker Desktop is open and the Docker daemon is running (green icon in taskbar).
3. *(Optional for Local Dev)* **Python 3.12+** and **Node.js 20+** (if you want to run code outside Docker with live reload).

---

## 2. Clone the Repository

Open a terminal (PowerShell or Bash) on your laptop:

`ash
git clone <YOUR_GITHUB_REPO_URL>
cd anyror_saas
`

---

## 3. Environment Setup

Create your configuration files from the templates:

### On Windows PowerShell:
`powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
`

### On macOS / Linux:
`ash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
`

### Add your Gemini API Key
Open ackend/.env in any text editor:
`env
GEMINI_API_KEY=your_gemini_api_key_here
HEADLESS=false
DATABASE_URL=postgresql+asyncpg://anyror_admin:supersecretpassword123@localhost:5435/anyror_saas_db
`

---

## 4. Running the Platform (Two Modes)

You can run TitleNode using either **Full Docker Mode** or **Hybrid Developer Mode**:

### Option A: Full Docker Mode (Recommended for quick start)
Run the entire platform (Postgres, Backend, and Frontend) inside Docker containers with a single command:

`ash
docker compose up -d --build
`

- PostgreSQL will start, create the database, and automatically load ackend/seed_dump.sql (16 land records and 127 mutation entries ready to go).
- Backend will build with Playwright and PyTorch CNN.
- Frontend will build and serve on port 3000.

To view container logs:
`ash
docker compose logs -f
`

To stop containers:
`ash
docker compose down
`

---

### Option B: Hybrid Developer Mode (Recommended for active coding)
In this mode, you run only PostgreSQL in Docker, while running the FastAPI backend and Next.js frontend directly in your terminal for instant hot-reload.

#### Step 1: Start PostgreSQL Database in Docker
`ash
docker compose up -d db
`
*(Verify database is running on port 5435)*.

#### Step 2: Start the Backend (Terminal 1)
`ash
cd backend
python -m venv venv

# Activate venv:
# On Windows:
.\venv\Scripts\Activate.ps1
# On Mac/Linux:
source venv/bin/activate

# Install dependencies:
pip install -r requirements.txt
playwright install chromium

# Launch FastAPI server:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
`

#### Step 3: Start the Frontend (Terminal 2)
`ash
cd frontend
npm install
npm run dev
`

---

## 5. Verifying Your Laptop Setup

Once running, test the following URLs in your browser:

1. **Advocate OS Dashboard**:
   - http://localhost:3000/advocate
   - You should see active cases for Survey 3, 2, and others.
2. **HitL Scanned Image Review & Pan Canvas**:
   - http://localhost:3000/advocate/review/3
   - Click and drag to pan across high-res historical deeds.
   - For digital entries, verify the official 4-column AnyRoR blue table layout.
3. **Genealogy Flow Tree**:
   - http://localhost:3000/advocate/tree/3
4. **Backend API Docs**:
   - http://localhost:8000/docs

---

## 6. Keeping Your Laptop in Sync with Desktop

Whenever you make changes on your desktop and push to GitHub, pull the latest changes on your laptop:

`ash
git pull origin main
`

If you modified dependencies:
- In Docker: docker compose up -d --build
- In Local dev: pip install -r backend/requirements.txt and 
pm install in rontend/.

# TitleNode — Autonomous Land Intelligence Platform (Gujarat AnyRoR)

TitleNode is a full-stack, enterprise-grade Land Records Intelligence and Human-in-the-Loop (HitL) Title Verification platform engineered specifically for Gujarat revenue records (**AnyRoR Rural Portal**).

The system transforms raw government revenue records, modern digital tables, and 70+ years of handwritten Gujarati **VF-6 mutation registers** into structured, verifiable land title genealogies and legal dossiers.

---

## Architecture & Features

`
+---------------------------------------------------------------------------------+
|                                 TITLENODE SAAS                                  |
+---------------------------------------------------------------------------------+
|                                                                                 |
|   +-----------------------+     +--------------------+     +----------------+   |
|   | Next.js 14 Frontend   | <-> | FastAPI API Engine | <-> | PostgreSQL 16  |   |
|   | (Advocate OS & Dossier|     | (Scraper, OCR, CNN)|     | (JSONB Records)|   |
|   +-----------------------+     +--------------------+     +----------------+   |
|               |                           |                                     |
|               |                           v                                     |
|               |                 +--------------------+                          |
|               |                 | Playwright Stealth |                          |
|               |                 | + PyTorch CNN      |                          |
|               |                 +--------------------+                          |
|               |                           |                                     |
|               v                           v                                     |
|     +-------------------+       +--------------------+                          |
|     | React Flow Trees  |       | AnyRoR Portal      |                          |
|     | & PDF Dossiers    |       | (Gujarat Revenue)  |                          |
|     +-------------------+       +--------------------+                          |
+---------------------------------------------------------------------------------+
`

### Key Capabilities
1. **Intelligent ASP.NET Scraper**:
   - Automated cascading dropdown navigation (District -> Taluka -> Village -> Survey).
   - Dynamic 6-character distorted CAPTCHA bypass powered by custom PyTorch CNN (captcha/captcha_model_v1.pth).
   - Anti-bot stealth mechanisms and automatic UpdatePanel synchronization.
2. **Smart Date Caching**:
   - Compares the government portal timestamp (* તા. ... ની સ્થિતિએ) with existing database records before downloading documents.
   - Bypasses unnecessary scraping on unchanged parcels, eliminating server bans and saving bandwidth.
3. **AI Vision OCR (Gemini 3.6 Flash)**:
   - Scans and transcribes historical handwritten Gujarati deeds into structured JSON lineages.
4. **Advocate OS (Human-in-the-Loop Review)**:
   - Infinite pan-and-drag viewport with wheel zoom for high-res historical scans.
   - Verbatim AnyRoR 4-column official government table view for digital entries.
   - Instant title tree generation using React Flow and downloadable legal dossiers.

---

## Tech Stack

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, React Flow, Lucide Icons.
* **Backend**: FastAPI, Python 3.12+, SQLAlchemy 2.0 (Asyncpg), Playwright, PyTorch, Pillow, OpenCV, BeautifulSoup4, Structlog.
* **Database**: PostgreSQL 16 Alpine (with JSONB support).
* **Containerization**: Docker & Docker Compose.

---

## Quickstart (Laptop / Desktop)

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
* [Git](https://git-scm.com/) installed.

### 1. Clone the Repository
`ash
git clone <YOUR_GITHUB_REPO_URL>
cd anyror_saas
`

### 2. Configure Environment Variables
Copy the sample environment files:
`ash
# On Windows PowerShell:
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local

# On Linux/macOS:
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
`
Add your free Gemini API key in ackend/.env (from [Google AI Studio](https://aistudio.google.com/)):
`env
GEMINI_API_KEY=your_gemini_api_key_here
`

### 3. Launch with Docker Compose
`ash
docker compose up -d
`
> **Note:** On first startup, Docker automatically imports ackend/seed_dump.sql into PostgreSQL, provisioning 16 verified land records and 127 mutation entries!

### 4. Access the Applications
* **Advocate Dashboard**: [http://localhost:3000/advocate](http://localhost:3000/advocate)
* **Title Verification Queue**: [http://localhost:3000/advocate/review/3](http://localhost:3000/advocate/review/3)
* **Genealogy Tree**: [http://localhost:3000/advocate/tree/3](http://localhost:3000/advocate/tree/3)
* **FastAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

For detailed developer instructions, see [LAPTOP_SETUP_GUIDE.md](LAPTOP_SETUP_GUIDE.md).

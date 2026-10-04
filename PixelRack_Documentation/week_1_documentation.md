# PixelRack: Week 1 Project Documentation

> **Course:** Applications Development and Emerging Technologies (APSI)  
> **Institution:** Holy Angel University — BS Computer Science  
> **Repository:** [rxikou/PixelRack](https://github.com/rxikou/PixelRack.git)  
> **Author:** rxikou  
> **Grading Period:** Week 1 Documentation Milestone  

---

## 1. Overview

PixelRack is a specialized collection-management web application designed for Hot Wheels and die-cast collectors who own dozens of carded or boxed models without the physical shelf space to showcase them all. The application enables collectors to photograph their physical cars, automatically normalize and transform those photos into consistent 16-bit style pixel art sprites, and curate their collection across interactive virtual environments such as a rustic wooden shelf, an auto garage, and a Japanese convenience store lot under Mount Fuji. By blending practical inventory management with a tactile retro-arcade aesthetic, PixelRack transforms static collection spreadsheets into an engaging digital showroom.

---

## 2. Setup and Installation

Follow these steps in order to set up and run the project from a fresh development environment.

### Prerequisites

Ensure you have the following installed before beginning:
* **Node.js**: Version `22.18.0` or higher ([Node.js Official Site](https://nodejs.org/))
* **npm**: Version `10.0.0` or higher (bundled with Node)
* **Git**: Latest stable version
* **Neon CLI**: Required for cloud PostgreSQL database and authentication provisioning:
  ```bash
  npm install -g neon@latest
  ```

---

### Step 1: Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/rxikou/PixelRack.git
cd PixelRack
```

---

### Step 2: Install Dependencies

PixelRack is organized as a client-server repository. Install the dependencies for both packages:

```bash
# Install frontend dependencies
cd client
npm install
cd ..

# Install backend dependencies
cd server
npm install
cd ..
```

---

### Step 3: Environment and Configuration

The application requires environment configuration across three locations: `.env.local` at the root (managed by Neon), `server/.env`, and `client/.env`.

#### A. Managed Cloud Database & Auth (`.env.local`)
PixelRack leverages Neon PostgreSQL and Neon Auth. Log in to your Neon account and link the repository:

```bash
neon login
neon link
neon deploy
```

The Neon CLI will generate a `.env.local` file at the repository root. **Never commit real credentials to version control.** It will contain the following keys:

| Variable | Example Placeholder | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-cool-sample.neon.tech/neondb?sslmode=require` | Pooled connection string used at server runtime |
| `DATABASE_URL_UNPOOLED` | `postgresql://user:pass@ep-cool-sample.neon.tech/neondb?sslmode=require` | Direct connection string required for Prisma migrations |
| `NEON_AUTH_BASE_URL` | `https://auth.sample.neon.tech` | Hosted Neon Auth endpoint |
| `NEON_AUTH_JWKS_URL` | `https://auth.sample.neon.tech/.well-known/jwks.json` | Public key set for JWT token verification |

#### B. Backend Configuration (`server/.env`)
Copy the sample configuration file in the server directory:

```bash
cp server/.env.example server/.env
```

Populate `server/.env` with your local settings:

| Variable | Example / Default | Description |
|---|---|---|
| `PORT` | `5000` | Local port for Express API |
| `NODE_ENV` | `development` | Node runtime environment |
| `PIXELATION_ENABLED` | `false` | Master toggle for the Gemini photo transformation endpoint |
| `PIXELATION_PROVIDER` | `gemini` | Primary transformation engine (`gemini`, `cloudflare`, or `local`) |
| `GEMINI_API_KEY` | `AIzaSyPlaceholderAPIKeyForGemini` | Google AI Studio API key (required if provider is `gemini`) |
| `GEMINI_IMAGE_MODEL` | `gemini-2.5-flash-image` | Gemini vision model for sprite rendering |
| `BG_REMOVAL_TIMEOUT_MS` | `60000` | Timeout cap for the local background removal fallback worker |
| `MAX_UPLOAD_SIZE_MB` | `5` | Maximum upload file size cap |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed frontend client origins |

#### C. Frontend Configuration (`client/.env`)
Copy the sample configuration file in the client directory:

```bash
cp client/.env.example client/.env
```

Populate `client/.env` (note that Vite embeds these at build time):

| Variable | Example / Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000` | Express REST API base endpoint |
| `VITE_NEON_AUTH_URL` | `https://auth.sample.neon.tech` | Matches `NEON_AUTH_BASE_URL` from `.env.local` |

---

### Step 4: Database Setup and Seeding

Run Prisma migrations to initialize the PostgreSQL schema and execute the seed script to populate the baseline environments:

```bash
cd server
npx prisma migrate deploy
npx prisma generate
node prisma/seed.js
cd ..
```

The seed script creates the three persistent scene definitions:
1. `rack` — The Wooden Shelf (default collector grid)
2. `garage` — The Virtual Garage (2 car display bays)
3. `konbini` — 7-Eleven Japan (3 car display bays)

---

## 3. How to Run It

Start both the backend API server and the frontend development server:

### Terminal 1: Backend Server
```bash
cd server
npm run dev
```
* **Expected Output:**
  ```
  [dotenv@loadEnv] Loaded root .env.local and server/.env
  [server] PixelRack API running on http://localhost:5000
  [database] Connected to Neon PostgreSQL via PrismaNeon
  ```

### Terminal 2: Frontend Client
```bash
cd client
npm run dev
```
* **Expected Output:**
  ```
  VITE v6.x.x ready in 250 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ```

### Verification
Open your browser and navigate to **`http://localhost:5173`**. You will be greeted by the PixelRack landing screen showcasing the PixelRack retro emblem, the retro chiptune audio toggle, a demonstration showcase of pixelated die-cast models, and authentication buttons (**"Enter the Rack"** / **"Sign Up"**).

---

## 4. Features and Usage

### Primary User Flow Walkthrough

```mermaid
graph LR
    A["1. Landing Page (/)"] --> B["2. Neon Auth (/login, /register)"]
    B --> C["3. Dashboard Rack (/dashboard)"]
    C --> D["4. Upload Hot Wheels Photo"]
    D --> E["5. Gemini/Sharp Pixelation Pipeline"]
    E --> C
    C --> F["6. Themed Scenes (/garage, /konbini)"]
    F --> G["7. Interactive Placements & Effects"]
```

1. **Account Registration & Session Management (`/register`, `/login`)**:
   * Create an account using email and password managed securely by Neon Auth.
   * Sessions are securely managed via JWT tokens validated on the backend via JWKS.
2. **The Main Rack (`/dashboard`)**:
   * View all digitized cars on a wooden shelf grid displaying 9 cars per row.
   * Filter cars dynamically by casting series or sort alphabetically and by date added.
3. **Uploading a Car**:
   * Drag and drop a photo of a Hot Wheels car into the left sidebar `UploadPanel`.
   * Drag the bounding crop box to tightly frame the vehicle.
   * Provide the vehicle model name (e.g., *"1970 Pontiac Firebird"*) and optional series (e.g., *"Muscle Mania"*).
   * Submit to trigger the backend pixelation engine.
4. **Themed Scenes (`/garage` and `/konbini`)**:
   * Navigate via the top navigation bar to themed environments.
   * **Virtual Garage (`/garage`)**: 2 custom parking slots. Click a parked car to trigger an interactive wash cycle.
   * **7-Eleven Japan (`/konbini`)**: 3 parking bays under Mount Fuji. Click a parked car to trigger a sparkle/gleam animation.
   * Click an empty bay to open the Car Picker modal; click an assigned car to swap or clear it. Placements persist automatically across sessions.

---

### API Endpoint Reference

All endpoints return JSON responses adhering to the format `{ success: true, data: ... }` or `{ success: false, error: ... }`.

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `GET` | `/api/health` | No | Liveness probe returning server health and uptime |
| `GET` | `/api/config` | No | Surfaces runtime feature flags (e.g. `pixelationEnabled`, active provider) |
| `GET` | `/api/users/username-available` | No | Real-time uniqueness validation for username registration |
| `GET` | `/api/users/me` | Yes | Retrieves current user profile linked to Neon Auth identity |
| `PUT` | `/api/users/me` | Yes | Initializes or updates user profile metadata |
| `GET` | `/api/cars` | Yes | Fetches all cars belonging to the authenticated user |
| `POST` | `/api/cars/upload` | Yes | Uploads photo, executes Gemini/Sharp pipeline, saves sprite |
| `PATCH` | `/api/cars/:id` | Yes | Updates car name or assigned series |
| `DELETE` | `/api/cars/:id` | Yes | Deletes a car and removes any active scene placements |
| `GET` | `/api/environments` | No | Lists all registered display environments and their capacities |
| `GET` | `/api/environments/:id/placements` | Yes | Returns user-specific slot assignments for a given scene |
| `PUT` | `/api/environments/:id/placements/:slotIndex` | Yes | Atomically places or clears (`carId: null`) a car in a slot |

---

## 5. Project Structure

```
PixelRack/
├── assets/                          # Raw high-resolution art assets & background sources
├── client/                          # React + Vite frontend application
│   ├── public/                      # Static favicons and sound assets
│   ├── src/
│   │   ├── api/                     # Axios API client & Neon Auth integration
│   │   ├── assets/                  # WebP-optimized scene art & UI icons
│   │   ├── components/              # Modular UI components (Rack, UploadPanel, ScenePage, etc.)
│   │   ├── context/                 # AuthContext & global state providers
│   │   ├── pages/                   # Route views (LandingPage, DashboardPage, GaragePage, etc.)
│   │   ├── utils/                   # Coordinate calculators and display helpers
│   │   ├── App.jsx                  # React Router configuration
│   │   └── index.css                # Tailwind CSS v4 design tokens and retro pixel utilities
│   └── package.json
├── server/                          # Express REST API backend
│   ├── prisma/
│   │   ├── migrations/              # PostgreSQL schema migrations
│   │   ├── schema.prisma            # Prisma 7 database schema definition
│   │   └── seed.js                  # Initializer for environment tables
│   ├── scripts/                     # Asset preparation CLI utilities (prepareIcon.mjs)
│   ├── src/
│   │   ├── controllers/             # Express route controllers (car, environment, user)
│   │   ├── lib/                     # Prisma client, loadEnv, and Gemini client wrappers
│   │   ├── middleware/              # Auth verification, upload handler, feature flags
│   │   ├── routes/                  # Express router declarations
│   │   ├── utils/                   # Pixelation engine & background removal worker
│   │   └── index.js                 # Express application entrypoint
│   └── package.json
├── PixelRack_Documentation/         # Comprehensive course architectural specifications
├── AI-USAGE.md                      # AI co-development declaration & prompt audit trail
├── neon.ts                          # Neon CLI configuration manifest
└── render.yaml                      # Render deployment blueprint
```

---

## 6. Screenshots

### Landing Page & Main Emblem
The entry screen presents the custom PixelRack retro emblem, navigation header, and chiptune soundtrack controls:

![PixelRack Starting Page](C:/Users/ROG/.gemini/antigravity-ide/brain/cb206740-71b9-4bb2-be93-8fc0ea70b580/starting-page.webp)

*(Additional screenshots of the Dashboard Wooden Rack, Virtual Garage, and Japanese Konbini scene will be captured and linked as user placements are finalized).*

---

## 7. Known Issues and Next Steps

In accordance with course grading guidelines, the following represents an honest evaluation of the project's current status, limitations, and planned enhancements:

### Known Issues & Limitations
1. **Local Disk Image Storage**:
   * *Status:* Uploaded source photos and generated pixel sprites are currently written to local disk under `server/temp_uploads/`.
   * *Impact:* On ephemeral cloud hosting platforms (such as Render or Heroku), disk state is reset during dyno cycling or redeployments. (The app gracefully renders a fallback placeholder sprite if an image file is lost, preventing UI breaks).
2. **Generative API Quota Constraint**:
   * *Status:* The preferred Stage 1 pixelation engine uses Google's `gemini-2.5-flash-image` model, which incurs an API cost (~$0.04 per call) without a free-tier quota.
   * *Workaround:* The `PIXELATION_ENABLED` environment flag is defaulted to `false` for public demos, returning HTTP 503 with an "In Development" badge. The offline `@imgly/background-removal-node` local child-process fallback is configured for local testing.
3. **Automated Test Coverage**:
   * *Status:* Automated unit and integration test suites (Vitest for frontend components, Jest + Supertest for backend routes) specified in `audit.md` are not yet written. Verification is currently conducted manually through linting, building, and browser execution.
4. **Free-Tier Cold Starts**:
   * *Status:* When deployed on free-tier compute (Render), the backend spins down after 15 minutes of inactivity, resulting in a ~50-second initial request delay.

### Next Steps & Development Roadmap
* **Milestone 2 (Week 2):** Connect AWS S3 or Cloudinary for persistent remote sprite storage to make the app resilient to cloud redeploys.
* **Milestone 3:** Finalize Vitest test suites for core collection components (`Rack.jsx`, `UploadPanel.jsx`) and Supertest API tests for `/api/cars/upload`.
* **Milestone 4:** Add custom user collection export (JSON / CSV catalog) and high-resolution downloadable scene snapshots.

---

## 8. AI Usage and Attribution

* In compliance with Holy Angel University course policies, an active **`AI-USAGE.md`** file is maintained at the root of the repository documenting all AI-assisted workflows, prompt patterns, and architectural validations.
* **Credit Line:** PixelRack's UI design and chunky retro aesthetic draw visual inspiration from PewDiePie's *Tuber Simulator*. Hot Wheels is a registered trademark of Mattel, Inc. This project is developed strictly for academic, non-commercial educational purposes.

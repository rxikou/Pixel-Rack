# PixelRack: Week 2 Project Documentation

> **Course:** Applications Development and Emerging Technologies (APSI)  
> **Institution:** Holy Angel University - BS Computer Science  
> **Repository:** [rxikou/PixelRack](https://github.com/rxikou/PixelRack.git)  
> **Author:** Seane Karl S. Garcia (`rxikou`)  
> **Grading Period:** Week 2 Documentation Milestone  

---

## 1. Overview

PixelRack is a specialized collection-management web application designed for Hot Wheels and die-cast collectors who own physical models stored in carded packs or bins without the shelf space to showcase them all. The application enables collectors to photograph their physical cars, transform those photos into consistent 16-bit style pixel art sprites, and curate their collection across interactive virtual environments such as a rustic wooden shelf, a virtual mechanic garage, and a Japanese convenience store lot under Mount Fuji.

### Week 2 Milestone Summary
During Week 2, the application transitioned from an initial client-side mockup into an authenticated, production-grade full-stack application backed by cloud infrastructure:
1. **Live Express 5 REST API & PostgreSQL Architecture:** Replaced simulated mock data with an Express 5 backend and Prisma 7 ORM connected to Neon PostgreSQL.
2. **Neon Auth Session Management:** Integrated secure user authentication via Neon Auth, verifying cryptographic JWT signatures on the backend using public keys fetched from Neon's JWKS endpoint.
3. **Dedicated Interactive Scenes with Persistent Placements:** Implemented the Virtual Garage (`/garage`, 2 bays) and 7-Eleven Japan (`/konbini`, 3 bays) with percentage-based coordinate alignment, car picker modals, interactive CSS animations (car wash cycle, sparkle gleam), and atomic database transactions.
4. **Retro Arcade UI/UX Redesign:** Overhauled the interface with a chunky bordered aesthetic inspired by PewDiePie's *Tuber Simulator*, featuring custom pixel navigation icons, Tailwind CSS v4 design tokens, and a hero landing page with opt-in chiptune soundtrack audio.
5. **Production Feature Gating & Resilience:** Added runtime feature detection (`requirePixelation` middleware, `/api/config` endpoint, "In Development" UI badges) to safeguard against unexpected generative AI billing spikes, alongside fallback sprite handling to prevent broken image cards.
6. **Cloud Deployment Blueprints:** Prepared production deployment blueprints for Render (`render.yaml`) and Vercel (`client/vercel.json`).

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

The application requires environment configuration across three locations: `.env.local` at the root (managed by Neon), `server/.env`, and `client/.env`. Never commit real credentials to version control.

#### A. Managed Cloud Database & Auth (`.env.local` at repository root)
PixelRack leverages Neon PostgreSQL and Neon Auth. Log in to your Neon account and link the repository:

```bash
neon login
neon link
neon deploy
```

The Neon CLI will generate a `.env.local` file at the repository root containing:

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

### Step 4: Database Setup, Migrations and Seeding

Run Prisma migrations to initialize the PostgreSQL schema and execute the seed script to populate the baseline environments:

```bash
cd server
npx prisma migrate deploy
npx prisma generate
node prisma/seed.js
cd ..
```

The seed script creates the three persistent scene definitions:
1. `rack`: The Wooden Shelf (default 9-slot collector grid)
2. `garage`: The Virtual Garage (2 car display bays)
3. `konbini`: 7-Eleven Japan (3 car display bays under Mount Fuji)

---

## 3. How to Run It

Start both the backend API server and the frontend development server in separate terminal windows:

### Terminal 1: Backend Server
```bash
cd server
npm run dev
```
* **Expected Terminal Output:**
  ```text
  [dotenv@loadEnv] Loaded root .env.local and server/.env
  [server] PixelRack API running on http://localhost:5000
  [database] Connected to Neon PostgreSQL via PrismaNeon
  ```

### Terminal 2: Frontend Client
```bash
cd client
npm run dev
```
* **Expected Terminal Output:**
  ```text
  VITE v6.x.x ready in 250 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ```

### Verification
Open your browser and navigate to **`http://localhost:5173`**. You will be greeted by the PixelRack landing screen showcasing the retro emblem, interactive feature breakdowns, and chiptune audio toggle controls.

---

## 4. Features and Usage

### System Architecture & Request Flows

```mermaid
graph TD
    subgraph Client ["Client (Vercel)"]
        UI["React 19 + Tailwind v4 UI"]
        Router["React Router 7 Routes"]
        AuthCtx["AuthContext (JWT State)"]
        APIClient["Axios API Client"]
    end

    subgraph ManagedAuth ["Identity Provider (Neon)"]
        NeonAuth["Neon Auth Service"]
        JWKS["JWKS Public Key Set"]
    end

    subgraph Backend ["Backend API (Render)"]
        Express["Express 5 REST API"]
        AuthGuard["requireAuth Middleware (jose)"]
        GateGuard["requirePixelation Middleware"]
        Controllers["Controllers (Car, Env, Placement)"]
        Sharp["Sharp 0.35 Canvas Engine"]
    end

    subgraph Database ["PostgreSQL (Neon)"]
        Prisma["Prisma 7 (PrismaNeon Adapter)"]
        Tables["Tables: users, cars, environments, placements"]
    end

    UI --> Router
    Router --> AuthCtx
    AuthCtx <-->|Sign in / Register| NeonAuth
    AuthCtx --> APIClient
    APIClient -->|HTTP + Bearer JWT| Express
    Express --> AuthGuard
    AuthGuard <-->|Verify JWT Signature| JWKS
    AuthGuard --> GateGuard
    GateGuard --> Controllers
    Controllers --> Prisma
    Prisma --> Tables
```

### Detailed Request Flow: Scene Slot Placement
1. **User Action:** The collector clicks an empty slot in `/garage` or `/konbini`.
2. **Client Selection:** `CarPickerModal` renders all cars owned by the collector. Clicking a car fires `PUT /api/environments/:id/placements/:slotIndex` with `{ carId }` and the `Authorization: Bearer <jwt>` header.
3. **Authentication Guard:** Express routes the request through `requireAuth.js`. The `jose` library verifies the token signature against Neon Auth's remote JWKS endpoint and attaches `req.user.id`.
4. **Database Transaction:** The controller initiates an atomic Prisma transaction:
   - Deletes any existing placement in that specific slot index.
   - Deletes any prior placement of that car in the same environment (moving the car instead of duplicating it).
   - Inserts the new placement record linked to `req.user.id`.
5. **Response & Optimistic Update:** The server returns the updated placement payload with HTTP 200. The React view renders the sprite in place with a smooth entry transition.

---

### Features Walkthrough

#### 1. Account Creation and Session Recovery (`/register`, `/login`)
* **Steps to try:**
  1. Click **"Sign Up"** on the landing page header.
  2. Enter an email, choose a username, and set a password.
  3. Click **"Create Account"**. You will be logged in and redirected to the dashboard.
* **Mechanism:** Neon Auth handles password hashing and token generation. Protected client routes (`ProtectedRoute.jsx`) safeguard `/dashboard`, `/garage`, and `/konbini`.

#### 2. The Main Collection Rack (`/dashboard`)
* **Steps to try:**
  1. Once logged in, view your digitized die-cast collection arranged across the wooden shelf.
  2. Use the sort dropdown to toggle between **Newest First** and **Alphabetical (A-Z)**.
  3. Click a series badge to filter cars belonging to a specific collection line (e.g., *Muscle Mania*).
* **Mechanism:** Queries execute against `/api/cars` scoped to `req.user.id`.

#### 3. Hot Wheels Photo Upload & Crop Box
* **Steps to try:**
  1. On `/dashboard`, drag and drop a car photo into `UploadPanel` on the left sidebar.
  2. Adjust the crop box to frame the vehicle tightly.
  3. Enter a vehicle name and optional series.
  4. Click **"Pixelate & Add to Shelf"**.
* **Mechanism:** When `PIXELATION_ENABLED=false`, the UI displays an **In Development** badge and provides a helpful notice explaining that demo mode is active without charging API fees.

#### 4. Themed Scenes (`/garage` and `/konbini`)
* **Steps to try:**
  1. Click **"Garage"** or **"7-Eleven"** in the top navigation bar.
  2. Click an empty slot to open `CarPickerModal` and pick a car from your shelf.
  3. In `/garage`, click a parked car to trigger an interactive wash spray cycle.
  4. In `/konbini`, click a parked car to trigger an arcade sparkle and gleam animation.
* **Mechanism:** Slot positions use percentage-based CSS positioning (`left%`, `top%`). Placements persist in PostgreSQL via atomic transactions.

---

### API Endpoint Reference

All endpoints return JSON envelopes adhering to `{ success: true, data: ... }` or `{ success: false, error: ... }`.

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `GET` | `/api/health` | No | Liveness probe returning server health and uptime status |
| `GET` | `/api/config` | No | Surfaces runtime feature flags (`pixelationEnabled: boolean`) |
| `GET` | `/api/users/username-available` | No | Validates username uniqueness during registration |
| `GET` | `/api/users/me` | Yes | Retrieves current user profile linked to Neon Auth identity |
| `PUT` | `/api/users/me` | Yes | Updates user profile metadata |
| `GET` | `/api/cars` | Yes | Fetches all cars belonging strictly to the authenticated user |
| `POST` | `/api/cars/upload` | Yes | Uploads photo, executes Gemini/Sharp pipeline, saves sprite |
| `PATCH` | `/api/cars/:id` | Yes | Renames car or updates assigned casting series |
| `DELETE` | `/api/cars/:id` | Yes | Deletes a car and cascades removal from active scene slots |
| `GET` | `/api/environments` | No | Lists all registered display environments and their capacities |
| `GET` | `/api/environments/:id/placements` | Yes | Returns user-specific slot assignments for a given scene |
| `PUT` | `/api/environments/:id/placements/:slotIndex` | Yes | Atomically places or clears (`carId: null`) a car in a slot |

---

## 5. Project Structure

```
PixelRack/
├── assets/                          # Raw high-resolution art assets & background sources
├── client/                          # React 19 + Vite frontend application
│   ├── public/                      # Static favicons (32px, 192px)
│   ├── src/
│   │   ├── api/                     # Axios API clients & Neon Auth integration
│   │   ├── assets/                  # WebP scene art, pixel icons, chiptune soundtrack
│   │   ├── components/              # Modular UI components (Rack, ScenePage, CarPickerModal, etc.)
│   │   ├── context/                 # AuthContext global session state provider
│   │   ├── data/                    # Fallback coordinate mappings
│   │   ├── pages/                   # Route views (LandingPage, DashboardPage, GaragePage, etc.)
│   │   ├── utils/                   # Coordinate calculators and display helpers
│   │   ├── App.jsx                  # React Router 7 route declarations
│   │   └── index.css                # Tailwind CSS v4 design tokens and retro pixel utilities
│   ├── package.json
│   └── vercel.json                  # Vercel SPA routing rewrite rules
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
│   ├── week_1_documentation.md      # Week 1 project milestone documentation
│   ├── week_2_documentation.md      # Week 2 project milestone documentation (this document)
│   ├── SECURITY-CHECKLIST.md        # Week 2 graded security and privacy checklist
│   ├── deployment.md                # Cloud deployment walkthrough
│   ├── proposal.md                  # App proposal specification
│   ├── flow.md                      # Architecture and database schema specification
│   ├── techstack.md                 # Technology stack rationale
│   └── audit.md                     # Quality audit and Definition of Done
├── AI-USAGE.md                      # AI co-development declaration & prompt audit trail
├── SECURITY-CHECKLIST.md            # Graded security checklist (root copy)
├── neon.ts                          # Neon CLI configuration manifest
└── render.yaml                      # Render API deployment blueprint
```

---

## 6. Screenshots

### Landing Page & Main Emblem
The entry screen presents the custom PixelRack retro emblem, navigation header, and chiptune soundtrack controls:

![PixelRack Starting Page](screenshots/starting-page.webp)

*(Additional screenshots of the Dashboard Wooden Rack, Virtual Garage, and Japanese Konbini scene will be captured and linked as user placements are finalized).*

---

## 7. Known Issues and Next Steps

In accordance with course grading guidelines, the following represents an honest evaluation of the project's current status, limitations, and planned enhancements:

### Known Issues & Limitations
1. **Ephemeral Cloud Storage on Render:**
   - *Status:* Uploaded source photos and generated pixel sprites are written to local disk under `server/temp_uploads/`.
   - *Impact:* Render's free compute spins down or cycles dynos, resetting local disk storage. (The client includes fallback handling in `CarSprite.jsx` to render a themed pixel car placeholder if an image file is lost, preventing UI breaks).
2. **Free-Tier Cold Starts:**
   - *Status:* Render free-tier services idle after 15 minutes of inactivity, resulting in a ~50-second initial request delay.
   - *Workaround:* The client shows friendly retro loading indicators to prevent users from assuming the app crashed.
3. **Generative API Quota Management:**
   - *Status:* Gemini image generation carries an API cost (~$0.04 per call).
   - *Workaround:* `PIXELATION_ENABLED` defaults to `false` in public deployments, returning HTTP 503 with an "In Development" notice.

### Week 3 Development Roadmap
* **Milestone 3A (Cloud Storage):** Integrate Cloudinary remote storage to permanently store uploaded photos and generated sprites, making uploads completely resilient to Render redeployments.
* **Milestone 3B (Automated Testing):** Build Jest and Supertest integration test suites for the Express routes (`/api/cars`, `/api/environments`, `/api/auth`) and Vitest component smoke tests for React components (`Rack.jsx`, `CarSprite.jsx`).
* **Milestone 3C (Collection Export):** Add CSV and JSON export functionality so collectors can download their digital catalog.

---

## 8. AI Usage and Attribution

* In accordance with Holy Angel University course policies for assignment M8A9, an active [AI-USAGE.md](file:///c:/Users/ROG/Documents/Holy%20Angel%20University/Computer%20Science/4th%20Year/APSI/PixelRack/AI-USAGE.md) audit log is maintained at the root of the repository.
* The audit trail documents AI-assisted prompt workflows, real development entries with commit links, missteps caught and corrected by the author, and a breakdown of student-engineered code.
* **Credit Line:** PixelRack's UI design and chunky retro aesthetic draw visual inspiration from PewDiePie's *Tuber Simulator*. Hot Wheels is a registered trademark of Mattel, Inc. This project is developed strictly for academic, non-commercial educational purposes.

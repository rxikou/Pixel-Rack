# PixelRack

A hobby web app that turns photos of your Hot Wheels into pixel art sprites and
displays them across themed environments: a wooden rack, a virtual garage, and a
Japanese convenience store car park under Mt Fuji.

Built as coursework for Applications Development and Emerging Technologies
(APSI), Holy Angel University, BS Computer Science.

![The PixelRack starting page](PixelRack_Documentation/screenshots/starting-page.webp)

## Status

Working and deployable, with one feature deliberately switched off.

| Area                       | State                                                    |
| -------------------------- | -------------------------------------------------------- |
| Accounts and sessions      | Working                                                   |
| Collection and the rack    | Working                                                   |
| Garage and konbini scenes  | Working, placements persist per user                      |
| Photo transformation       | **Disabled in the demo.** See [Why it is off](#why-transformation-is-off) |
| Image storage              | Local disk only, does not survive a deploy                |
| Automated tests            | Not written yet                                           |

## Features

**Collection.** Register, sign in, and keep a personal collection. Every query is
scoped by user id, so one account cannot read or edit another's cars.

**The rack.** Your whole collection on a wooden shelf, nine cars per row, with
sorting and filtering.

**Environment scenes.** Each environment is its own page rather than a backdrop
swapped behind the rack:

| Scene            | Route        | Capacity   | Interaction                     |
| ---------------- | ------------ | ---------- | ------------------------------- |
| Wooden Rack      | `/dashboard` | Whole collection | Sort and filter           |
| Virtual Garage   | `/garage`    | 2 cars     | Click a car to wash it          |
| 7-11 Japan       | `/konbini`   | 3 cars     | Click a car to make it gleam    |

Slots are positioned as percentages measured off the artwork, so a car lands in
an actual painted parking bay rather than an approximate spot. Placements are
saved per user and restored on the next visit. Clicking a placed car plays a CSS
effect; all effects are disabled under `prefers-reduced-motion`.

**Pixelation pipeline.** A two stage process, currently switched off. Stage one
asks Gemini to redraw the photo as pixel art, falling back to local background
removal if that fails. Stage two uses `sharp` to trim, fit to a fixed 96x72
canvas, and cap the palette at 16 colours so every car in the collection matches.

Filters alone cannot produce this. Resizing and posterising a photo yields a
pixelated photograph, not a drawn sprite, which is why the generative step
exists. The colour step is a count cap rather than a remap onto a fixed palette:
remapping would force every car to the same hue and defeat the point of
recognising your own cars.

## Tech stack

**Client**

- React 19 with Vite 8
- Tailwind CSS v4, configured with `@theme` tokens in CSS rather than a config file
- React Router 7
- PropTypes for prop validation, no TypeScript
- Jersey 10 for headings, Roboto Mono for body text

**Server**

- Node 22 and Express 5, ESM throughout
- Prisma 7 with the `PrismaNeon` driver adapter
- `jose` for JWT verification against Neon Auth's JWKS endpoint
- `sharp` for image processing, `multer` for uploads

**Managed services**

- Neon Postgres for the database
- Neon Auth for accounts and sessions
- Gemini via `@google/genai` for the redraw step

Prisma 7 moved the connection URL out of `schema.prisma` and into
`prisma.config.mjs`, which is why the datasource block in the schema has no
`url`.

## Project structure

```
PixelRack/
├── client/                      React + Vite front end
│   └── src/
│       ├── api/                 API wrappers and the auth client
│       ├── components/          Reusable UI
│       ├── context/             AuthContext
│       ├── pages/               One file per route
│       ├── utils/               Small helpers
│       └── index.css            Tailwind @theme tokens and pixel utilities
├── server/                      Express API
│   ├── prisma/                  Schema, migrations, seed
│   ├── scripts/                 Asset preparation tools
│   └── src/
│       ├── controllers/         Request handlers
│       ├── lib/                 Env loading, Prisma client
│       ├── middleware/          Auth, uploads, feature flags, errors
│       ├── routes/              Route definitions
│       └── utils/               Pixelation pipeline and providers
├── assets/                      Raw art sources, not shipped to the client
├── PixelRack_Documentation/     Project documentation
├── render.yaml                  Render blueprint for the API
└── neon.ts                      Neon CLI project config
```

Raw artwork lives in `assets/` and the optimised versions the client imports live
in `client/src/assets/`. Keeping the two apart stops multi-megabyte sources from
being bundled.

## Getting started

### Prerequisites

- Node 22.18 or newer
- A Neon account, free tier is enough
- The Neon CLI: `npm i -g neon@latest`

### Setup

```bash
git clone https://github.com/rxikou/Pixel-Rack.git
cd Pixel-Rack

# Install both workspaces
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Connect to Neon

The Neon CLI writes the database and auth values into a repo-root `.env.local`.
That file is gitignored and should never be hand edited or committed.

```bash
neon login
neon link            # writes .env.local
neon deploy          # provisions auth, regenerates .env.local
```

### Configure the app

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Then set `VITE_NEON_AUTH_URL` in `client/.env` to the same value as
`NEON_AUTH_BASE_URL` in `.env.local`.

### Prepare the database

```bash
cd server
npx prisma migrate deploy   # apply migrations
npx prisma generate         # generate the client
node prisma/seed.js         # seed the three environments
```

The seed inserts the three environments with stable string ids (`rack`,
`garage`, `konbini`) rather than UUIDs, so the client can map each one to its
scene renderer.

### Run it

Two terminals:

```bash
cd server && npm run dev    # API on http://localhost:5000
cd client && npm run dev    # UI on http://localhost:5173
```

## Environment variables

### `.env.local` (repo root, managed by the Neon CLI)

| Variable                | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `DATABASE_URL`          | Pooled connection, used at runtime         |
| `DATABASE_URL_UNPOOLED` | Direct connection, used by migrations      |
| `NEON_AUTH_BASE_URL`    | Auth service base URL                      |
| `NEON_AUTH_JWKS_URL`    | Public keys the API verifies tokens against |

### `server/.env`

| Variable               | Default    | Purpose                                          |
| ---------------------- | ---------- | ------------------------------------------------ |
| `PORT`                 | `5000`     | API port                                         |
| `PIXELATION_ENABLED`   | `false`    | Master switch for the upload endpoint            |
| `PIXELATION_PROVIDER`  | `gemini`   | `gemini`, `cloudflare`, or `local`               |
| `GEMINI_API_KEY`       | none       | Required when the provider is `gemini`           |
| `CORS_ORIGINS`         | unset      | Comma separated allowlist. Unset allows any origin |
| `MAX_UPLOAD_SIZE_MB`   | `5`        | Upload size cap                                  |

### `client/.env`

| Variable             | Purpose                            |
| -------------------- | ---------------------------------- |
| `VITE_API_URL`       | Base URL of the Express API        |
| `VITE_NEON_AUTH_URL` | Neon Auth base URL                 |

Vite bakes `VITE_` variables in at build time, so changing one needs a rebuild
rather than a restart.

## API reference

All responses use the shape `{ success, data }` or `{ success, error }`.

| Method | Endpoint                                              | Auth | Purpose                       |
| ------ | ----------------------------------------------------- | ---- | ----------------------------- |
| GET    | `/api/health`                                         | No   | Liveness check                |
| GET    | `/api/config`                                         | No   | Which features are enabled    |
| GET    | `/api/users/username-available`                       | No   | Check a username before signup |
| GET    | `/api/users/me`                                       | Yes  | Current profile               |
| PUT    | `/api/users/me`                                       | Yes  | Create or update profile      |
| GET    | `/api/cars`                                           | Yes  | List your cars                |
| POST   | `/api/cars/upload`                                    | Yes  | Upload and transform a photo  |
| PATCH  | `/api/cars/:id`                                       | Yes  | Rename or reassign a car      |
| DELETE | `/api/cars/:id`                                       | Yes  | Delete a car                  |
| GET    | `/api/environments`                                   | No   | List environments             |
| GET    | `/api/environments/:id/placements`                    | Yes  | Your placements in a scene    |
| PUT    | `/api/environments/:id/placements/:slotIndex`         | Yes  | Place or clear a slot         |

Authentication is a Neon Auth JWT in an `Authorization: Bearer` header, verified
against Neon's JWKS endpoint.

`POST /api/cars/upload` returns **503** with `code: "FEATURE_DISABLED"` while
`PIXELATION_ENABLED` is not `true`.

Sending `{ carId: null }` to the placements endpoint clears the slot. Placing a
car already in that scene moves it rather than duplicating it, handled in a
transaction.

## Database schema

Four tables. Credentials and sessions are not among them: those live in Neon
Auth's own tables, and `users.id` matches the Neon Auth user id.

**users** `id` (matches Neon Auth), `username` (unique), `email` (unique),
`created_at`

**cars** `id`, `user_id`, `original_image_url`, `pixel_image_url`, `name`,
`series`, `created_at`. Both image columns are nullable: a car saves even if the
transformation step fails, so a failed upload never loses the entry.

**environments** `id` (stable string key), `name`, `background_url`,
`is_premium`, `sort_order`, `slots`. A `slots` value of 0 means the scene shows
the whole collection rather than a fixed number.

**placements** `id`, `user_id`, `environment_id`, `slot_index`, `car_id`,
`created_at`. One row per filled slot; an empty slot simply has no row. Unique on
`(user, environment, slot)` and on `(user, environment, car)`.

## Scripts

**Client**

| Command           | Does                             |
| ----------------- | -------------------------------- |
| `npm run dev`     | Dev server on port 5173          |
| `npm run build`   | Production build into `dist/`    |
| `npm run preview` | Serve the built output           |
| `npm run lint`    | ESLint                           |
| `npm run format`  | Prettier                         |

**Server**

| Command           | Does                                |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Nodemon on port 5000                |
| `npm start`       | Production start                    |
| `npm run migrate` | `prisma migrate dev`                |
| `npm run lint`    | ESLint                              |
| `npm test`        | Jest, no tests written yet          |

**Utilities**

`node server/scripts/prepareIcon.mjs <input> <output> [size]` turns generated
artwork on a flat background into a trimmed transparent PNG. Background removal
is a flood fill from the image edges rather than deleting every white pixel,
because several icons contain white artwork that a global key would punch holes
through.

## Deployment

The client deploys to Vercel as a static build and the API to Render as a web
service. The database and auth are already hosted, so only those two need doing.

Full walkthrough: **[PixelRack_Documentation/deployment.md](PixelRack_Documentation/deployment.md)**

Two steps in there are easy to miss and both fail confusingly:

- `CORS_ORIGINS` on the API must be set to the deployed client URL.
- The deployed client URL must be added as a trusted domain in Neon Auth, or
  sign-in fails with an origin error while everything else looks fine.

## Why transformation is off

Gemini image generation has no free tier. Each upload bills roughly $0.04 against
the Google Cloud project behind the API key, so an open upload endpoint on the
public internet spends real money for anyone who finds the URL.

`PIXELATION_ENABLED` defaults to off, so a deployment that forgets to set it
stays closed rather than open. With it off, the upload endpoint returns 503
before the file is even accepted, and the UI shows an "In Development" badge and
explains the situation when the button is clicked. The client reads
`/api/config` at runtime rather than keeping its own copy of the flag, so the two
cannot drift and promise something the API will refuse.

To turn it back on: put credit on the Google Cloud project, then set
`GEMINI_API_KEY`, `PIXELATION_PROVIDER=gemini` and `PIXELATION_ENABLED=true`. The
client needs no change.

## Known limitations

**Uploaded images do not survive a deploy.** Originals and sprites are written to
`server/temp_uploads`, which is local disk. Cars whose sprite file has gone
render the built-in pixel car placeholder rather than a broken image, so the rack
still looks intact. Cloud storage is the fix and is still pending.

**No automated tests.** `audit.md` calls for Vitest and React Testing Library on
the client and Jest with Supertest on the server. Neither exists yet. Changes are
currently verified by linting, building, and driving the real app in a browser.

**Free tier hosting sleeps.** Render idles the API after about 15 minutes, and
the next request takes roughly 50 seconds to wake it.

## Documentation

| File                                                       | Contents                                  |
| ---------------------------------------------------------- | ----------------------------------------- |
| [prd.md](PixelRack_Documentation/prd.md)                   | Requirements, MVP checklist, non-goals    |
| [flow.md](PixelRack_Documentation/flow.md)                 | Architecture, schema, request flows       |
| [techstack.md](PixelRack_Documentation/techstack.md)       | Stack choices and reasoning               |
| [style.md](PixelRack_Documentation/style.md)               | Visual language and palette               |
| [deployment.md](PixelRack_Documentation/deployment.md)     | Deployment walkthrough                    |
| [audit.md](PixelRack_Documentation/audit.md)               | Quality and testing requirements          |
| [CLAUDE.md](PixelRack_Documentation/CLAUDE.md)             | AI assistant directives                   |

## Credits

Interface design is heavily inspired by PewDiePie's Tuber Simulator: chunky
bordered panels, saturated colour coded buttons, and hard pixel shadows.

Hot Wheels is a trademark of Mattel. This is a non-commercial student project and
is not affiliated with or endorsed by Mattel.

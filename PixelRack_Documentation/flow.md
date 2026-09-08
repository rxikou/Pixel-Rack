# Architecture & User Journey Flow

## 1. User Navigation Flow
1. Landing Page: Introduction to PixelRack, pixel art hero image, Login/Register CTAs.
2. Dashboard (My Rack): Primary view showing the user's pixelated collection on a shelf.
3. Upload Modal: Drag-and-drop zone for physical car photos.
4. Processing View: Brief loading state while the backend pixelates the image via the Gemini API + sharp pipeline.
5. Environment Gallery: Cards on the dashboard that navigate to an environment's own page rather than
   reskinning the rack in place.
6. Scene Pages: `/garage` (2 slots) and `/konbini` (3 slots). Each shows the environment art with fixed car
   slots. Clicking an empty slot opens the car picker; clicking a placed car plays its scene effect; double
   clicking swaps it out. Placements are saved per user and restored on the next visit.

## 2. Database Schema (PostgreSQL)

Table: Users (app profile only - credentials live in Neon Auth's own `neon_auth.user` table)
- id (String, PK, matches the Neon Auth user id)
- username (String, Unique)
- email (String, Unique, mirrored from Neon Auth for query convenience)
- created_at (Timestamp)

Table: Cars
- id (UUID, PK)
- user_id (String, FK to Users)
- original_image_url (String, nullable - served from local disk until cloud storage is wired up)
- pixel_image_url (String, nullable - stays null until the Gemini + sharp pipeline runs)
- name (String)
- series (String, nullable)
- created_at (Timestamp)

Table: Environments
- id (String, PK - stable keys "rack" / "garage" / "konbini", not UUIDs, so the client can map each one to its scene renderer)
- name (String)
- background_url (String, nullable - null while environments are drawn in CSS)
- is_premium (Boolean)
- sort_order (Int, controls display order in the gallery)
- slots (Int, how many cars the scene displays; 0 means it shows the whole collection, as the default rack does)

Table: Placements (one row per filled slot; an empty slot simply has no row)
- id (UUID, PK)
- user_id (String, FK to Users, cascade delete)
- environment_id (String, FK to Environments, cascade delete)
- slot_index (Int, zero-based position within the scene)
- car_id (UUID, FK to Cars, cascade delete)
- created_at (Timestamp)
- Unique (user_id, environment_id, slot_index): a slot holds at most one car.
- Unique (user_id, environment_id, car_id): a car appears at most once per scene, so placing an already
  placed car moves it instead of duplicating it.

Seeded by `server/prisma/seed.js` (`node prisma/seed.js`).

## 3. API Request Flow (Upload)
1. Client POSTs image payload to `/api/cars/upload`.
2. Express backend verifies the Neon Auth JWT (from the `Authorization` header) against Neon's JWKS endpoint.
3. Express asks Gemini to redraw the car as a pixel art sprite. If no API key is configured or the call fails, it falls back to `@imgly/background-removal-node` in a child process, which only cuts the car out of its background.
4. Express passes that cutout to `sharp`, which resizes to a fixed 96x72 canvas with nearest-neighbor and reduces to 16 colors so the sprite is pixel-perfect and grid-aligned.
5. Backend writes the sprite next to the original and serves both from `/uploads` (cloud storage such as AWS S3 is still planned).
6. Backend saves image URLs and metadata to PostgreSQL.
7. Backend returns new Car object to React frontend.
8. React updates global state and renders the new pixel car on the rack.

## 4. API Request Flow (Placements)
1. `GET /api/environments` is public and lists the scenes with their slot counts.
2. `GET /api/environments/:environmentId/placements` requires auth and returns the environment plus the
   caller's filled slots, each with its car.
3. `PUT /api/environments/:environmentId/placements/:slotIndex` requires auth. A body of `{ carId }` fills the
   slot; `{ carId: null }` clears it. The write runs in a transaction that first removes whatever occupied
   the target slot and any existing placement of that car in the same scene, so placing moves rather than
   duplicates. The car lookup is scoped by user id, so a caller cannot place someone else's car.

If pixelation fails, the car is still saved with `pixel_image_url` null and the reason is returned as `pixelationError`; the client shows a placeholder sprite and surfaces the message rather than losing the upload.

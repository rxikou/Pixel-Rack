# Architecture & User Journey Flow

## 1. User Navigation Flow
1. Landing Page: Introduction to PixelRack, pixel art hero image, Login/Register CTAs.
2. Dashboard (My Rack): Primary view showing the user's pixelated collection on a shelf.
3. Upload Modal: Drag-and-drop zone for physical car photos.
4. Processing View: Brief loading state while the backend pixelates the image via the Gemini API + sharp pipeline.
5. Environment Selector: Tab or dropdown to switch the background (e.g., 7-11 Japan, Cyberpunk City).

## 2. Database Schema (PostgreSQL)

Table: Users (app profile only - credentials live in Neon Auth's own `neon_auth.user` table)
- id (String, PK, matches the Neon Auth user id)
- username (String, Unique)
- email (String, Unique, mirrored from Neon Auth for query convenience)
- created_at (Timestamp)

Table: Cars
- id (UUID, PK)
- user_id (UUID, FK to Users)
- original_image_url (String)
- pixel_image_url (String)
- name (String)
- series (String, nullable)
- created_at (Timestamp)

Table: Environments
- id (UUID, PK)
- name (String)
- background_url (String)
- is_premium (Boolean)

## 3. API Request Flow (Upload)
1. Client POSTs image payload to `/api/cars/upload`.
2. Express backend verifies the Neon Auth JWT (from the `Authorization` header) against Neon's JWKS endpoint.
3. Express calls the Gemini API via `@google/genai` with the original photo and a fixed prompt (referencing the `style.md` palette) instructing it to remove the background and render the car as a normalized retro pixel art sprite.
4. Express passes the Gemini output to `sharp`, which quantizes colors to the locked palette and resizes/crops to a fixed canvas so the sprite is pixel-perfect and grid-aligned.
5. Backend uploads final image to cloud storage (e.g., AWS S3).
6. Backend saves image URLs and metadata to PostgreSQL.
7. Backend returns new Car object to React frontend.
8. React updates global state and renders the new pixel car on the rack.

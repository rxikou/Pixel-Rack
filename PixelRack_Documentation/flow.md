# Architecture & User Journey Flow

## 1. User Navigation Flow
1. Landing Page: Introduction to PixelRack, pixel art hero image, Login/Register CTAs.
2. Dashboard (My Rack): Primary view showing the user's pixelated collection on a shelf.
3. Upload Modal: Drag-and-drop zone for physical car photos.
4. Processing View: Brief loading state while the backend pixelates the image.
5. Environment Selector: Tab or dropdown to switch the background (e.g., 7-11 Japan, Cyberpunk City).

## 2. Database Schema (PostgreSQL)

Table: Users
- id (UUID, PK)
- username (String, Unique)
- email (String, Unique)
- password_hash (String)
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
2. Express backend validates payload and auth token.
3. Express passes image to processing utility (`sharp`/`jimp`).
4. Utility scales down image, applies color palette restrictions, scales back up (nearest neighbor).
5. Backend uploads final image to cloud storage (e.g., AWS S3).
6. Backend saves image URLs and metadata to PostgreSQL.
7. Backend returns new Car object to React frontend.
8. React updates global state and renders the new pixel car on the rack.

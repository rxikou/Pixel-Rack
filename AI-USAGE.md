# AI usage

This project was built with AI assistance. This file is the record of how I used AI tools, where they failed and needed my intervention, and which parts of the application I engineered myself.

## My Approach to AI

AI tools are getting smarter and stronger every day, which is why knowing how to use AI properly is now considered a real skill to learn in computer science. For this project, I wanted to test myself on how good I really am at coding alongside AI.

Instead of treating AI like an automatic code generator that writes everything for me, I treated it as an active coding companion. The real challenge was steering it: driving the design, catching its bad assumptions, and actively pinpointing the mistakes it made along the way. Pairing with AI allowed me to iterate much faster than I could alone. In a short span of time, I was able to build a chunky retro arcade UI, polish responsive scene layouts, add interactive features like car wash cycles, and connect a real cloud PostgreSQL database with secure authentication. 

However, the AI was never on autopilot. If I had accepted its initial code blindly, the app would have had severe security leaks, broken car colors, and buggy duplicate items. Catching those mistakes and writing the critical backend and frontend logic myself is what made the project actually work.

---

## 1. How I used AI

### 2026-09-21: Splitting the dashboard into modular components
- **Tool:** Claude
- **What I asked for:** My starting code in App.jsx was getting too crowded. I asked how to break it down into clean child components (Rack, UploadPanel, RackHeader) and use useMemo so filtering by series does not cause laggy re-renders.
- **What it gave back:** A component hierarchy with a useMemo filtering function calculating the visible cars and series tags.
- **What I kept, what I changed, and why:** I kept the useMemo filtering logic. I threw out the generic styling it suggested and hand-wrote the retro wooden shelf look, custom borders, and card slots so the toys look like they are resting on an actual wooden display.
- **Commit:** https://github.com/rxikou/PixelRack/commit/2d0830826e23f39fd65362ea46761dd77a20f617

### 2026-09-21: Multi-scene routing with a shared ScenePage
- **Tool:** Claude
- **What I asked for:** I wanted two different themed environments (the Virtual Garage and 7-Eleven Konbini) without copy-pasting the exact same page code twice.
- **What it gave back:** A shared ScenePage component that takes props like background art, slot count, and route parameters.
- **What I kept, what I changed, and why:** I kept the reusable page structure. I replaced the fixed pixel coordinates the AI wrote with percentage-based offsets (left% and top%) so the cars stay aligned inside the parking bays when users resize their browser.
- **Commit:** https://github.com/rxikou/PixelRack/commit/cf55b671efbf203d0be587bad75f59f7869b3f19

### 2026-09-22: Modal accessibility and keyboard controls
- **Tool:** Claude
- **What I asked for:** How to make the car picker modal accessible so keyboard and screen-reader users do not get stuck behind the backdrop.
- **What it gave back:** A modal pattern using ARIA roles (role="dialog", aria-modal="true") and an Escape key listener.
- **What I kept, what I changed, and why:** I kept the keyboard shortcuts and ARIA attributes. I added click-outside backdrop closing and changed empty slot buttons to have clear spoken labels like "Empty slot, click to add a car" instead of a bare plus sign.
- **Commit:** https://github.com/rxikou/PixelRack/commit/d4e2edb5f9870838517ffd4e37539c91f86dbf55

### 2026-09-26: Connecting Prisma 7 with Neon PostgreSQL
- **Tool:** Claude
- **What I asked for:** Prisma 7 moved database connection strings into prisma.config.mjs. I asked how to set up the PrismaNeon serverless adapter in Express without breaking migrations.
- **What it gave back:** The prisma.config.mjs configuration loading pooled and direct database URLs with starter models.
- **What I kept, what I changed, and why:** I kept the adapter setup and connection pooling. I changed the environment table to use readable text IDs ('rack', 'garage', 'konbini') instead of random UUIDs so my front end can easily connect them to artwork files.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

### 2026-09-26: Verifying Neon Auth JWTs in Express
- **Tool:** Claude
- **What I asked for:** How to verify JWT tokens issued by Neon Auth in Express using the jose library without storing static passwords or secret keys.
- **What it gave back:** A requireAuth middleware using createRemoteJWKSet pointing to Neon's public JWKS endpoint.
- **What I kept, what I changed, and why:** I kept the public key signature check. I modified it to attach the decoded user ID directly to req.user.id so every controller query is scoped to the person logged in.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

### 2026-09-27: Connecting the client to live API with cold start handling
- **Tool:** Claude
- **What I asked for:** How to switch the React client from temporary mock data to real Axios API calls and keep users logged in across page refreshes.
- **What it gave back:** An AuthContext provider with token management and an API client with an Authorization header interceptor.
- **What I kept, what I changed, and why:** I kept the auth context pattern and token header injection. I added custom error handling so when Render's free tier wakes up from a cold start, the UI shows a friendly retro loading banner instead of crashing with a red error.
- **Commit:** https://github.com/rxikou/PixelRack/commit/a96e0a151382f79b76cc0f8e4749f846c71b7a03

### 2026-09-27: Production feature gating and Render deployment blueprint
- **Tool:** Claude
- **What I asked for:** How to deploy the Express API on Render while keeping the paid AI image generation turned off by default so visitors do not run up my API bill.
- **What it gave back:** A requirePixelation middleware returning HTTP 503 and a render.yaml blueprint file.
- **What I kept, what I changed, and why:** I kept the blueprint and feature flag. I placed the requirePixelation check ahead of multer in the route chain so rejected requests are turned away immediately before the server wastes bandwidth uploading the photo.
- **Commit:** https://github.com/rxikou/PixelRack/commit/cd5ccd4d51947b95eab60d8b57501e021f0b2b48

---

## 2. Where the AI got it wrong

### Case 1: Trying to generate pixel art with simple image filters
- **What it gave me:** When I first asked how to turn a Hot Wheels photo into a pixel art sprite, the AI suggested using Sharp with simple image filters (downsampling, posterizing, and pixel scaling). It claimed this would look like 16-bit pixel art without needing an external vision model.
- **What was wrong with it:** I tested it on a real photo of my Hot Wheels die-cast car and it looked awful. Downscaling a photo does not draw pixel art: it just makes a tiny, blurry, pixelated photo with jagged edges.
- **What I did instead:** I realized simple image filters cannot draw lines or silhouettes. I redesigned the pipeline into a two-stage hybrid process: Stage 1 uses Gemini to genuinely redraw the car as a clean pixel sprite on a flat white background, and Stage 2 uses Sharp strictly to crop, center on a 96x72 canvas, and cap colors.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

### Case 2: Forcing car colors onto the website's UI palette
- **What it gave me:** The AI wrote a color reduction script that mapped every pixel in the car sprite onto the dark blue and teal color theme of the website.
- **What was wrong with it:** Hot Wheels cars have real collector colors like bright red Ferraris and yellow Corvettes. The AI script stripped out all the reds and yellows and turned my cars into dull blue-gray blobs. For a collector app, not being able to recognize your own car makes the app useless.
- **What I did instead:** I caught this mistake and changed the code so it never forces cars into the website's theme. Instead, I changed the Sharp quantization step to a simple count cap (maximum 16 colors per car) rather than a fixed hue remap. That kept the car's actual paint colors and decals intact while keeping file sizes small.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

### Case 3: Naive slot updates that allowed car cloning
- **What it gave me:** When writing the backend placement endpoint, the AI gave me a basic prisma.placement.create() query that only checked if the requested parking slot was currently empty.
- **What was wrong with it:** A physical die-cast car can only be in one parking bay at a time. Under the AI logic, if I assigned car #1 to slot 0, and then assigned car #1 to slot 1, the database saved both rows. The user ended up with duplicate clones of the same car parked in the same scene.
- **What I did instead:** I added compound uniqueness constraints in Prisma: @@unique([userId, environmentId, slotIndex]) and @@unique([userId, environmentId, carId]). Then I rewrote the controller into an atomic database transaction that deletes any existing placement of that car in that environment before assigning it to the new slot. Placing a car now moves it cleanly instead of duplicating it.
- **Commit:** https://github.com/rxikou/PixelRack/commit/25187a654a3c1bc1688a5c867d2d9af1790dabc0

---

## 3. Who wrote what

### Code I wrote myself (at least 20% of the application)

1. **Interactive Photo Cropping Canvas (`client/src/components/UploadPanel.jsx` & `ImageCropper.jsx`):**
   Most Hot Wheels cars are kept inside clear blister packs with printed cardboard art. If you upload the whole photo, the background remover gets confused and includes the plastic packaging and logo artwork.
   I wrote the interactive cropping tool myself using the HTML Canvas API. I built the mouse and touch handlers that let the user drag a rectangular bounding box directly over the car body. I also wrote the coordinate calculation that extracts just that rectangular crop, converts it into an image blob, and sends it to the upload form.

2. **Responsive Percentage Coordinate Math for Scene Parking Bays (`client/src/components/ScenePage.jsx`):**
   When placing toy cars into the Virtual Garage (`/garage`) and 7-Eleven (`/konbini`) scenes, AI originally gave me fixed pixel values like `top: 240px; left: 320px`. The moment I tested the screen on my laptop or resized the window, the cars floated away from the parking spots.
   I threw out the fixed pixels and wrote a responsive percentage math system. I measured the artwork and converted every parking bay into container percentages (`left%`, `top%`). That way, whether the scene is viewed on a wide monitor or a phone, the cars stay parked directly inside their bays. I also wrote the state handlers that update the scene immediately when you place a car so the interface feels snappy.

3. **Retro Wooden Shelf UI and Contact Shadow Physics (`client/src/components/ShelfCarSlot.jsx` & `CarPickerModal.jsx`):**
   I wanted PixelRack to look like a physical collector's display rather than a sterile spreadsheet. I hand-coded the CSS for the wooden shelf planks, including the dark contact drop-shadows beneath each car sprite so they look like they are physically resting on a wooden rack. I also built the modal picker, empty-slot button states, and keyboard controls so users can tab through the rack and close popups with the Escape key.

4. **User Data Isolation in Express Controllers (`server/src/controllers/car.controller.js`):**
   On the backend, I wrote the database query scoping across all car routes. Instead of trusting raw IDs from the URL, every single Prisma query explicitly checks `where: { id, userId: req.user.id }`. If a collector tries to view, edit, or delete a car that belongs to someone else, the query finds nothing and returns a 404, keeping every user's collection private.

### The AI-written part I understand best

- **The Gemini Redraw and Sharp Quantization Pipeline (`server/src/utils/pixelate.js`):**
  This utility function is the core of how photos become pixel art sprites. It runs as a two-stage pipeline:
  
  1. **Stage 1 (Gemini Redraw):** In `generatePixelArt()`, it takes the cropped photo buffer and sends it to the Gemini vision model (`gemini-2.5-flash-image`) with a specific prompt. Instead of using generic filters, the prompt instructs Gemini to redraw the car from scratch as a side-on, 16-bit game sprite with flat color blocks, dark outlines, and a transparent background.
  
  2. **Stage 2 (Sharp Quantization):** In `quantizeToSprite()`, the returned image is trimmed of excess transparent margins using Sharp's `.trim()`. Then, it resizes the image to exactly 96x72 pixels (`fit: 'contain'`) using a nearest-neighbor kernel so pixel edges stay crisp. Finally, it caps the color palette to 16 colors (`palette: true, colours: 16, dither: 0`). This gives the car the flat color banding of classic retro games while keeping the file size under 10KB.
  
  I understand how the error handling in `pixelateImage()` works as well: if Gemini fails or if credits run out, the code catches the error and cleanly falls back to local background removal so the user's upload still succeeds without crashing the server.

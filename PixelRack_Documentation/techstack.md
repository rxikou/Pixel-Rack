# Technical Architecture & Stack

## 1. Frontend
* Framework: React (via Vite)
* Styling: Vanilla CSS Modules or Tailwind CSS (restricted to the pixel color palette).
* State Management: React Context API (for global user state) and standard Hooks.
* Image Handling: HTML5 File API for uploads.

## 2. Backend
* Runtime Environment: Node.js
* Web Framework: Express.js
* Image Processing (hybrid pipeline):
  * `@google/genai` (Gemini API) generates a background-removed, style-normalized pixel art render from the source photo, using a fixed prompt template and the palette in `style.md`.
  * `sharp` post-processes the Gemini output: quantizes colors to the locked palette and resizes/crops to a fixed canvas so every sprite is pixel-perfect and grid-aligned regardless of AI output variance.
* Authentication: JWT (JSON Web Tokens) with bcrypt for password hashing.

## 3. Database
* Type: PostgreSQL
* ORM/Query Builder: Prisma or raw `pg` queries. (Prisma recommended for rapid MVP schema iteration).

## 4. Hosting/Deployment (Planned)
* Frontend: Vercel or Netlify.
* Backend & DB: Render, Railway, or Heroku.
* Image Storage: AWS S3 or Cloudinary (for storing original and pixelated images).

## 5. Strict Constraints
* Do not introduce alternative frameworks like Next.js, Vue, or Angular.
* Stick strictly to PostgreSQL; do not suggest NoSQL alternatives like MongoDB.

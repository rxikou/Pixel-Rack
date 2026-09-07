# Technical Architecture & Stack

## 1. Frontend
* Framework: React (via Vite)
* Styling: Vanilla CSS Modules or Tailwind CSS (restricted to the pixel color palette).
* State Management: React Context API (for global user state) and standard Hooks.
* Image Handling: HTML5 File API for uploads.

## 2. Backend
* Runtime Environment: Node.js
* Web Framework: Express.js
* Image Processing: `jimp` or `sharp` (Node.js libraries) for downscaling, color quantization, and pixelation algorithms.
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

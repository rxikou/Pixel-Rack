# PixelRack AI Assistant Master Directives

## 1. Project Context
You are assisting in the development of PixelRack, a hobbyist web application for Hot Wheels collectors to digitize and display their collections in pixel art environments. 

## 2. Command Reference
* Frontend Start: `cd client && npm run dev`
* Frontend Build: `cd client && npm run build`
* Backend Start: `cd server && npm run dev`
* Database Migrations: `cd server && npm run migrate`

## 3. Code Style Directives
* Frontend: Functional React components, Hooks, strict PropTypes or TypeScript interfaces (if adopted later).
* Backend: Express REST API, modular route controllers, async/await error handling.
* General: Standard JS/ES6+ syntax. Avoid class components.
* Pixelation Logic: Execute pixelation processing on the backend as a two-stage pipeline - the `@google/genai` SDK (Gemini API) normalizes background, angle, and style per a fixed prompt using the palette in `style.md`, then `sharp` deterministically quantizes colors to that palette and resizes to a fixed canvas for pixel-perfect grid alignment.

## 4. Memory Anchoring
* Always refer to the database schema in `flow.md` before suggesting backend changes.
* Ensure all UI components align with the retro-pixel aesthetic defined in `style.md`.
* Emdashes are strictly prohibited in user-facing text and documentation. Use hyphens or colons instead.

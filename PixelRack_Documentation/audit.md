# Quality Audit & Definition of Done

## 1. AI Self-Review Checklists
* Verify all React components are functional and use hooks properly.
* Check that backend routes have proper error handling and return consistent JSON structures (e.g., `{ success: true, data: ... }`).
* Validate that database queries are parameterized to prevent SQL injection.

## 2. Automated Testing Protocols
* Frontend: Vitest + React Testing Library for core component rendering (e.g., ensuring the Rack maps over car arrays correctly).
* Backend: Jest + Supertest for API endpoint validation (especially the upload and auth routes).

## 3. Definition of Done (DoD)
* Feature is fully functional locally.
* Code passes linting (`eslint`) and formatting (`prettier`).
* Pixelation algorithm output has been visually verified for correct "retro" scaling (no blurred edges).
* Documentation (this file set) is updated if architecture changed.

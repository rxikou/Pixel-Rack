# Week 2 Reflection Journal

> **Student Name:** Garcia, Seane Karl S.  
> **Section:** CS - 401  
> **Course Code:** 6APSI-2203  
> **Course:** Applications Development and Emerging Technologies (APSI)  
> **Institution:** Holy Angel University - BS Computer Science  
> **Project:** [PixelRack](https://github.com/rxikou/PixelRack.git)  

---

## A. The front end, in my own words

In Week 2, the front end moved from a single dashboard grid into a multi-page interactive web app. Taking inspiration from the chunky retro look of PewDiePie's *Tuber Simulator*, I gave PixelRack an arcade aesthetic: custom pixel navigation icons, high-contrast borders, and an optional 8-bit chiptune soundtrack on the landing page that visitors can toggle on or off.

Building the two dedicated themed scenes - the Virtual Garage (`/garage`) and 7-Eleven Japan (`/konbini`) - was where component architecture really made sense to me. Instead of creating two completely separate page components with duplicate logic, I built a reusable `ScenePage` component that takes scene-specific props: the background artwork, the slot coordinates, and the interactive animations. 

What clicked about responsive layout was coordinate positioning. If you hardcode pixel coordinates like `top: 240px; left: 320px`, the cars immediately misalign as soon as you resize the browser or open the inspector. Instead, I calculated coordinates as percentages (`left%`, `top%`) relative to the scene container. That way, whether the scene is viewed on a 1080p desktop monitor or a laptop screen, the die-cast cars sit directly inside their designated parking bays.

I also added micro-animations to make the environments feel alive: clicking a parked car in the garage triggers a car wash water spray cycle, and clicking a car at the 7-Eleven triggers an arcade sparkle and gleam animation. To keep the app accessible, I wrapped all animation triggers in CSS media queries that respect the user's `prefers-reduced-motion` operating system setting.

State management across modals was another big learning step. The `CarPickerModal` appears when you click an empty parking bay, loads your available cars from the collection, and communicates the chosen car back up to the parent scene. Updating the scene state optimistically before the server responds makes the app feel snappy instead of sluggish.

---

## B. The backend half

Moving from mock data to a real live Express 5 REST API connected to Neon PostgreSQL through Prisma 7 was the most demanding part of Week 2, but also the most satisfying.

A server listening on a port is one thing, but securing it is another. For authentication, instead of building my own fragile password-hashing system, we used Neon Auth. Neon Auth manages credentials and issues cryptographically signed JSON Web Tokens (JWTs). On my Express backend, I wrote the `requireAuth.js` middleware using the `jose` library. When a request arrives, the middleware extracts the Bearer token from the `Authorization` header, fetches the public key set from Neon's remote JWKS endpoint, and verifies the cryptographic signature. Once verified, it attaches `req.user.id` to the request object. Understanding that the backend never needs to know the user's password to trust their identity was a huge revelation for me.

The database query I am proudest of this week is the atomic scene placement in `environment.controller.js`. When a collector places a car into a parking slot, two things must happen:
1. Any car currently sitting in that slot must be cleared.
2. If that specific car is already parked in another bay in the same scene, it should be moved rather than cloned.

If either step fails halfway through, the database could end up in an invalid state with duplicate cars. Using `prisma.$transaction()` allowed me to bundle the delete and insert operations into a single atomic database transaction. If anything fails, the entire transaction rolls back cleanly.

Finally, I built a feature-gating middleware called `requirePixelation.js`. Because the Gemini generative vision API costs around $0.04 per call, letting anyone freely upload photos on a public cloud deployment could quickly drain an API balance. By placing `requirePixelation` before Multer in the middleware chain, the server immediately returns HTTP 503 with an "In Development" notice if the feature flag is disabled, rejecting the request before any file is written to disk.

---

## C. What clicked, and what is still shaky

**What clicked:** The complete lifecycle of an authenticated request. Before this week, JWTs felt like an abstract concept from slides. Seeing the exact sequence in action - client logs in through Neon Auth, receives a signed JWT, stores it in `AuthContext`, attaches it as `Bearer <token>` in Axios interceptors, and Express verifies the signature against remote JWKS keys - made the client-server separation completely click.

**Still shaky, precisely:** Dealing with ephemeral cloud disk storage versus persistent remote object storage. When deploying on Render's free tier, uploaded source photos and generated pixel sprites are written to local disk under `server/temp_uploads/`. Whenever Render restarts or cycles the server dyno, that local folder is wiped clean. I wrote fallback logic in `CarSprite.jsx` to render a retro pixel placeholder so the UI does not crash if an image is missing, but migrating from local disk to Cloudinary or AWS S3 is something I still need more hands-on practice with.

**Bug I am proud of:** After integrating Neon Auth, every time I refreshed the page, the user was logged out and redirected back to `/login`. I spent nearly two hours inspecting `ProtectedRoute.jsx` and React Router, thinking the routes were unmounting before the session resolved. When I finally added a console log inside `AuthContext.jsx` to inspect what `authClient.getSession()` returned, I saw the payload structure:
```json
{
  "session": { ... },
  "user": { "id": "...", "email": "..." }
}
```
The `user` object was a direct sibling of `session`, not nested inside `session.user`! My code had been reading `data.session.user`, which was undefined. Changing it to `data?.user` fixed the session persistence across page refreshes immediately.

**Error I now recognize on sight:** `401 Unauthorized: JWSInvalid` or `JWSSignatureVerificationFailed`. It almost always means the client either forgot to attach the Bearer token in the `Authorization` header, the token expired, or the `NEON_AUTH_JWKS_URL` environment variable was not loaded properly by `loadEnv.js`.

---

## D. How I work

My debugging workflow has matured a lot since Week 1. Back then, if something broke, my reflex was to randomly tweak React component state or rewrite route handlers and hope for the best. Now, my first step is always to open the browser's Network tab and check the terminal logs. Looking at the exact HTTP status code, request payload (FormData vs JSON), and Prisma query logs tells me within seconds whether the failure is on the client or the server.

I used AI tools throughout Week 2 as a pair-programming companion, mainly for checking Prisma relation syntax, drafting regex helpers, and reviewing JWT verification logic with `jose`. But I kept strict control over the code. When an AI snippet suggested reading `data.session.user`, I was the one who caught the bug by inspecting real runtime data. My personal rule remains firm: I never paste in any line of code or library method unless I can explain exactly what it does and why it is there.

In terms of workload, Week 2 took approximately 18 hours of dedicated development. What helped me stay focused was breaking the sprint into bite-sized milestones: setting up the Prisma schema and migrations first, getting authentication solid second, wiring up the interactive scenes third, and finishing with thorough documentation and security checks.

---

## E. Looking forward to the final project

PixelRack now has a working full-stack foundation: user authentication, live database persistence, and interactive themed environments where collectors can curate their die-cast models.

For Week 3 and the final project submission, my main technical goals are:
1. **Cloud Object Storage:** Integrate Cloudinary remote storage to replace ephemeral local disk uploads, ensuring collector photos and pixel sprites survive server restarts permanently.
2. **Automated Testing:** Write automated integration test suites for the Express routes (`/api/cars`, `/api/environments`, `/api/auth`) using Jest and Supertest, along with Vitest smoke tests for React components (`Rack.jsx`, `CarSprite.jsx`), so regressions are caught automatically rather than through manual clicking.
3. **Collection Export:** Add CSV and JSON export functionality so collectors can download and back up their digital showroom catalog.

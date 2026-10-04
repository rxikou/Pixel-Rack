# Security and Privacy Checklist

> **Course:** Applications Development and Emerging Technologies (APSI)  
> **Student:** Seane Karl S. Garcia (`rxikou`)  
> **Repository:** [rxikou/PixelRack](https://github.com/rxikou/PixelRack.git)  

Every item is verified and answered with direct evidence from the PixelRack codebase.

---

## 1. Repository Hygiene (Before First Push)

| Checklist Item | Answer | Evidence in My Own Words |
|---|:---:|---|
| `.gitignore` includes `.env` and `.env.local` | **Yes** | Verified with `.gitignore` lines 15-19; `.env` and `.env.local` are untracked. |
| `git ls-files \| grep -iE '\.env$\|\.pem$\|id_rsa'` prints nothing | **Yes** | Command executed in terminal returned 0 matched files; no private keys exist. |
| `.env.example` committed with placeholder values only | **Yes** | Root, server, and client `.env.example` files contain placeholder strings only. |
| No connection strings, keys, or passwords committed | **Yes** | Database credentials are provisioned dynamically by Neon and kept in local `.env.local`. |
| No student IDs, personal phone numbers, or private emails | **Yes** | Only the academic author name and public GitHub handle appear in documentation. |

---

## 2. Application & Backend Security

| Checklist Item | Answer | Evidence in My Own Words |
|---|:---:|---|
| Every SQL query is parameterized | **Yes** | All database operations use Prisma 7 prepared statements; raw query concatenation is not used. |
| Input validation performed on the server | **Yes** | `uploadCar` checks `req.body.name` string presence and `upload.js` enforces a 5MB size limit. |
| Strict CORS origin allowlist | **Yes** | Express `cors()` in `server/src/index.js` validates origins against the `CORS_ORIGINS` allowlist. |
| User data isolation in queries | **Yes** | All car and placement queries filter on `where: { id, userId: req.user.id }`. |
| Passwords hashed and securely managed | **Yes** | Password hashing and session tokens are delegated to Neon Auth; passwords never touch app tables. |
| Protected API endpoints enforce authentication | **Yes** | `requireAuth.js` validates JWT cryptographic signatures against Neon's remote JWKS endpoint. |
| Feature gating on billed endpoints | **Yes** | `requirePixelation.js` returns HTTP 503 before Multer saves uploads if API flags are disabled. |

---

## 3. Privacy & Data Minimization

| Checklist Item | Answer | Evidence in My Own Words |
|---|:---:|---|
| No real personal photos or classmates' private data | **Yes** | All demo photos and seed data are toy die-cast Hot Wheels vehicles. |
| Data minimization policy | **Yes** | The app stores only vehicle model name, optional series string, and generated sprite URLs. |
| Consent and transparency | **Yes** | The application does not track analytics, telemetry, cookies, or third-party behavioral trackers. |

---

## Security Tradeoff Analysis (Journal Note)

The most notable security tradeoff in PixelRack is the generative AI pixelation pipeline. Because generative vision APIs bill per call, exposing an unauthenticated or unrestricted upload route on a public domain creates a financial denial-of-service risk. To mitigate this without breaking the user experience, the endpoint is protected by a two-stage defense: `requireAuth` ensures only registered users can make calls, and `requirePixelation` acts as a master circuit-breaker returning HTTP 503 when public demo mode is active.

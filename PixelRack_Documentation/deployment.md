# Deployment

The demo runs as two deployments plus two managed services:

| Piece    | Where                    | What it is                  |
| -------- | ------------------------ | --------------------------- |
| Client   | Vercel                   | Static Vite build           |
| API      | Render                   | Express web service         |
| Database | Neon                     | Already hosted, no work     |
| Auth     | Neon Auth                | Already hosted, needs a domain added |

Database and auth are already in the cloud, so only the client and API need deploying.

## Before you start

Photo transformation is switched off for the demo. `PIXELATION_ENABLED` defaults
to off, and the API returns 503 for uploads unless it is set to exactly `true`.
Leave it unset on the deployment. The reason is money, not polish: the Gemini
step bills roughly $0.04 per upload, and an open endpoint on the public internet
spends real money for anyone who finds it.

You will need the values the Neon CLI keeps in the repo-root `.env.local`. That
file is gitignored and must never be committed. Open it to copy values out:

```
DATABASE_URL
DATABASE_URL_UNPOOLED
NEON_AUTH_BASE_URL
NEON_AUTH_JWKS_URL
```

If it is missing, run `neon link` to regenerate it.

## Step 1: deploy the API to Render

1. Push to GitHub first. Render deploys from the repo.
2. At [dashboard.render.com](https://dashboard.render.com), choose **New** then
   **Web Service**, and connect the `Pixel-Rack` repository.
3. Render should read `render.yaml` at the repo root and prefill the settings.
   If it does not, set them by hand:
   - Root directory: `server`
   - Build command: `npm ci && npx prisma generate`
   - Start command: `npm start`
   - Health check path: `/api/health`
   - Instance type: Free
4. Add the environment variables. `render.yaml` marks the secrets as
   `sync: false`, which means Render prompts for them rather than reading them
   from the repo:

   | Variable                | Value                                  |
   | ----------------------- | -------------------------------------- |
   | `DATABASE_URL`          | from `.env.local`                      |
   | `DATABASE_URL_UNPOOLED` | from `.env.local`                      |
   | `NEON_AUTH_BASE_URL`    | from `.env.local`                      |
   | `NEON_AUTH_JWKS_URL`    | from `.env.local`                      |
   | `CORS_ORIGINS`          | leave blank for now, set in step 3     |
   | `PIXELATION_ENABLED`    | `false`                                |
   | `NODE_VERSION`          | `22.18.0`                              |

5. Deploy, then confirm it is alive:

   ```
   curl https://<your-api>.onrender.com/api/health
   curl https://<your-api>.onrender.com/api/config
   ```

   Health should report ok, and config should report `"pixelationEnabled": false`.

## Step 2: deploy the client to Vercel

1. At [vercel.com/new](https://vercel.com/new), import the same repository.
2. Set **Root Directory** to `client`. Vercel reads `client/vercel.json` for the
   rest, including the rewrite that makes client-side routes like `/garage` work
   on a hard refresh.
3. Add two environment variables:

   | Variable             | Value                                    |
   | -------------------- | ---------------------------------------- |
   | `VITE_API_URL`       | `https://<your-api>.onrender.com`        |
   | `VITE_NEON_AUTH_URL` | same as `NEON_AUTH_BASE_URL`             |

   These are baked in at build time, so changing one later needs a redeploy, not
   just a restart.
4. Deploy and note the resulting URL.

## Step 3: connect the two

Two things still point at nothing, and both cause confusing failures if skipped.

**Point the API's CORS at the client.** In Render, set `CORS_ORIGINS` to the
Vercel URL exactly, scheme included and no trailing slash, for example
`https://pixelrack.vercel.app`. Save, which redeploys. Left unset the API
accepts any origin, which works but leaves it open to any site.

**Tell Neon Auth about the new domain.** In the Neon console, under your project
then Auth then Configuration, add the Vercel URL as a trusted domain. Skip this
and sign-in fails with a redirect or origin error even though everything else is
correct.

## Step 4: check it

Open the Vercel URL and confirm:

- The starting page loads with artwork and music toggle.
- Register works, and a refresh keeps you signed in.
- The dashboard, `/garage` and `/konbini` all load, including on hard refresh.
- The pixelator panel shows the amber "In Development" badge, and clicking
  **Upload & Transform** shows the still in the works notice rather than
  uploading.

## Known limits of this demo

**The API sleeps.** Render's free tier idles a service after about 15 minutes of
inactivity, and the next request takes roughly 50 seconds to wake it. Before
demonstrating in front of anyone, load the site once and wait for it to respond
so the audience does not sit through a cold start.

**Uploaded images do not survive a deploy.** Originals and sprites are written to
`server/temp_uploads`, which is local disk and is wiped on every deploy. Any car
row whose sprite file has gone renders the built-in pixel car placeholder rather
than a broken image, so the rack still looks intact. Cloud storage such as S3 or
Cloudinary is the fix, and is still pending.

**Transformation is off**, so the demo shows the collection, the rack and the
environments, not the pixelation pipeline.

## Turning transformation back on later

1. Put credit on the Google Cloud project behind `GEMINI_API_KEY`. Image
   generation has no free tier.
2. In Render, set `GEMINI_API_KEY`, `PIXELATION_PROVIDER=gemini`, and
   `PIXELATION_ENABLED=true`.
3. Sort out image storage first if uploads need to outlive a deploy.

The client needs no change. It reads `/api/config` at runtime, so the panel drops
its badge and starts accepting uploads as soon as the API reports the feature on.

import sharp from 'sharp'

// Stable Diffusion 1.5 img2img on Cloudflare Workers AI. Free tier, and
// genuinely image-to-image, so it transforms the user's actual car rather
// than inventing a generic one from text.
const MODEL = '@cf/runwayml/stable-diffusion-v1-5-img2img'

// SD 1.5 was trained at 512x512 and degrades badly at other sizes, so the
// photo is letterboxed into a square before being sent.
const CANVAS = 512

const PROMPT = [
  '16-bit pixel art sprite of a single toy car, side view,',
  'flat blocks of solid colour, hard pixel edges, dark outline,',
  'retro SNES game sprite, simple shapes, no gradients, no photo texture,',
  'plain flat background',
].join(' ')

const NEGATIVE_PROMPT = [
  'photograph, realistic, 3d render, blurry, soft shading, gradient,',
  'packaging, cardboard, blister pack, plastic wrap, text, logo, watermark,',
  'hands, cluttered background, multiple cars',
].join(' ')

export async function generateWithCloudflare(imageBuffer) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!accountId || !token) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN are not configured')
  }

  const square = await sharp(imageBuffer)
    .resize(CANVAS, CANVAS, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer()

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: PROMPT,
        negative_prompt: NEGATIVE_PROMPT,
        image_b64: square.toString('base64'),
        // Enough to restyle into sprite art, but not so much that the car
        // stops resembling the one in the photo.
        strength: Number(process.env.CF_IMG2IMG_STRENGTH || 0.62),
        guidance: Number(process.env.CF_IMG2IMG_GUIDANCE || 8.5),
        num_steps: 20,
      }),
    },
  )

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`
    try {
      const body = await res.json()
      detail = body?.errors?.[0]?.message ?? JSON.stringify(body).slice(0, 200)
    } catch {
      // non-JSON error body; the status line is all we have
    }
    throw new Error(`Cloudflare Workers AI failed: ${detail}`)
  }

  const buf = Buffer.from(await res.arrayBuffer())
  if (!buf.length) throw new Error('Cloudflare Workers AI returned an empty image')
  return buf
}

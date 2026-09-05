const CACHE_PATH = '/__portfolio-engagement-v1'
const EMPTY_STATS = { visitors: 0, likes: 0 }

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

async function readStats(request) {
  const cache = caches.default
  const cacheUrl = new URL(CACHE_PATH, request.url)
  const cached = await cache.match(new Request(cacheUrl, { method: 'GET' }))
  if (!cached) return { ...EMPTY_STATS }

  try {
    const data = await cached.json()
    return {
      visitors: Number(data.visitors) || 0,
      likes: Number(data.likes) || 0,
    }
  } catch {
    return { ...EMPTY_STATS }
  }
}

async function writeStats(request, stats) {
  const cacheUrl = new URL(CACHE_PATH, request.url)
  await caches.default.put(
    new Request(cacheUrl, { method: 'GET' }),
    new Response(JSON.stringify(stats), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000',
      },
    }),
  )
}

export async function onRequestGet({ request }) {
  return json(await readStats(request))
}

export async function onRequestPost({ request }) {
  let action
  try {
    action = (await request.json()).action
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }
  if (action !== 'visit' && action !== 'like') return json({ error: 'Invalid action' }, 400)

  const stats = await readStats(request)
  if (action === 'visit') stats.visitors += 1
  if (action === 'like') stats.likes += 1
  await writeStats(request, stats)
  return json(stats)
}

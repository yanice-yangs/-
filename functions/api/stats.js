const VISITOR_ID_PATTERN = /^[a-zA-Z0-9-]{16,80}$/

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

function chinaDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

async function hashVisitorId(visitorId) {
  const bytes = new TextEncoder().encode(visitorId)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
}

async function readStats(db, visitorHash, dateKey) {
  const [visitors, legacyLikes, dailyLikes, likedToday] = await db.batch([
    db.prepare("SELECT value FROM engagement_counters WHERE name = 'visitors'"),
    db.prepare("SELECT value FROM engagement_counters WHERE name = 'legacy_likes'"),
    db.prepare('SELECT COUNT(*) AS value FROM engagement_daily_likes'),
    visitorHash
      ? db.prepare('SELECT 1 AS liked FROM engagement_daily_likes WHERE visitor_hash = ?1 AND like_date = ?2 LIMIT 1').bind(visitorHash, dateKey)
      : db.prepare('SELECT 0 AS liked'),
  ])

  return {
    visitors: Number(visitors.results?.[0]?.value) || 0,
    likes: (Number(legacyLikes.results?.[0]?.value) || 0) + (Number(dailyLikes.results?.[0]?.value) || 0),
    likedToday: Boolean(likedToday.results?.[0]?.liked),
    dateKey,
  }
}

function getDatabase(env) {
  return env?.PORTFOLIO_DB
}

export async function onRequestGet({ env }) {
  const db = getDatabase(env)
  if (!db) return json({ error: 'Persistent stats database is not configured' }, 503)
  return json(await readStats(db, null, chinaDateKey()))
}

export async function onRequestPost({ request, env }) {
  const db = getDatabase(env)
  if (!db) return json({ error: 'Persistent stats database is not configured' }, 503)

  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }

  const { action, visitorId } = payload
  if (action !== 'visit' && action !== 'like') return json({ error: 'Invalid action' }, 400)
  if (typeof visitorId !== 'string' || !VISITOR_ID_PATTERN.test(visitorId)) {
    return json({ error: 'Invalid visitor identifier' }, 400)
  }

  const dateKey = chinaDateKey()
  const visitorHash = await hashVisitorId(visitorId)

  if (action === 'visit') {
    await db.prepare("UPDATE engagement_counters SET value = value + 1 WHERE name = 'visitors'").run()
  } else {
    await db.prepare(
      'INSERT OR IGNORE INTO engagement_daily_likes (visitor_hash, like_date) VALUES (?1, ?2)',
    ).bind(visitorHash, dateKey).run()
  }

  return json(await readStats(db, visitorHash, dateKey))
}

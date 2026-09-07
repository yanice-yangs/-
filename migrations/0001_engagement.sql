CREATE TABLE IF NOT EXISTS engagement_counters (
  name TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0 CHECK (value >= 0)
);

-- Preserve the public totals captured immediately before the D1 cutover.
INSERT OR IGNORE INTO engagement_counters (name, value) VALUES ('visitors', 9);
INSERT OR IGNORE INTO engagement_counters (name, value) VALUES ('legacy_likes', 1);

CREATE TABLE IF NOT EXISTS engagement_daily_likes (
  visitor_hash TEXT NOT NULL,
  like_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (visitor_hash, like_date)
);

CREATE INDEX IF NOT EXISTS engagement_daily_likes_date_idx
  ON engagement_daily_likes (like_date);

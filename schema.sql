-- Feedback from the landing page form (functions/api/feedback.js)
CREATE TABLE IF NOT EXISTS feedback (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  type       TEXT    NOT NULL CHECK (type IN ('idea', 'bug', 'other')),
  message    TEXT    NOT NULL,
  contact    TEXT,
  ip_hash    TEXT    NOT NULL,
  status     TEXT    NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS feedback_ip_time ON feedback (ip_hash, created_at);

import { sql, json, readBody } from './_db.js';
import { getUser } from './_auth.js';

// Public intake form.
// POST /api/intake  -> anyone can submit (no login)
// GET  /api/intake  -> logged-in users only: list all submissions

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await sql`CREATE TABLE IF NOT EXISTS intake_forms (
    id SERIAL PRIMARY KEY,
    full_name TEXT,
    contact TEXT,
    answers JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  tableReady = true;
}

const str = (v, max = 500) => (v == null ? null : String(v).trim().slice(0, max) || null);

export default async function handler(req, res) {
  try {
    await ensureTable();

    if (req.method === 'GET') {
      const auth = getUser(req);
      if (!auth) return json(res, 401, { error: 'Not authenticated' });
      const rows = await sql`SELECT id, full_name, contact, answers, created_at FROM intake_forms ORDER BY created_at DESC LIMIT 500`;
      return json(res, 200, { rows });
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      // Honeypot: bots fill hidden fields, people don't.
      if (body.website) return json(res, 200, { ok: true });
      const answers = body.answers;
      if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return json(res, 400, { error: 'Invalid payload' });
      const raw = JSON.stringify(answers);
      if (raw.length > 20000) return json(res, 413, { error: 'Form too large' });
      const fullName = str(answers.full_name, 120);
      if (!fullName) return json(res, 400, { error: 'Name is required' });
      const rows = await sql`INSERT INTO intake_forms (full_name, contact, answers) VALUES (${fullName}, ${str(answers.contact, 200)}, ${raw}::jsonb) RETURNING id, created_at`;
      return json(res, 200, { ok: true, id: rows[0].id, created_at: rows[0].created_at });
    }

    return json(res, 405, { error: 'GET or POST only' });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

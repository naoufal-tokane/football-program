import { sql, json, readBody } from './_db.js';

export default async function handler(req, res) {
if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
try {
const { day_num, item_index, done } = await readBody(req);
if (day_num == null || item_index == null)
  return json(res, 400, { error: 'Invalid payload' });

const rows = await sql`
INSERT INTO daily_checklist (day_num, item_index, done)
VALUES (${day_num}, ${item_index}, ${!!done})
ON CONFLICT (day_num, item_index)
DO UPDATE SET done = EXCLUDED.done
RETURNING day_num, item_index, done`;
json(res, 200, { ok: true, row: rows[0] });
} catch (e) {
  json(res, 500, { error: String(e.message || e) });
}
  }

import { sql, json, readBody } from './_db.js';
import { getUser } from './_auth.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  const auth = getUser(req);
  if (!auth) return json(res, 401, { error: 'Not authenticated' });
  try {
    const { cycle_id, day_num, weight_kg } = await readBody(req);
    if (cycle_id == null || day_num == null || weight_kg == null)
      return json(res, 400, { error: 'Invalid payload' });
    const own = await sql`SELECT id FROM cycles WHERE id = ${cycle_id} AND user_id = ${auth.id}`;
    if (!own[0]) return json(res, 403, { error: 'Forbidden' });
    const rows = await sql`
    INSERT INTO weights (cycle_id, day_num, weight_kg, logged_at)
    VALUES (${cycle_id}, ${day_num}, ${weight_kg}, now())
    ON CONFLICT (cycle_id, day_num)
    DO UPDATE SET weight_kg = EXCLUDED.weight_kg, logged_at = now()
    RETURNING day_num, weight_kg`;
    json(res, 200, { ok: true, row: rows[0] });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

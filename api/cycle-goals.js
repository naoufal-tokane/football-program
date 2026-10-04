import { sql, json, readBody } from './_db.js';
import { getUser } from './_auth.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  const auth = getUser(req);
  if (!auth) return json(res, 401, { error: 'Not authenticated' });
  try {
    const { cycle_id, protein_g, carbs_g, fats_g, water_ml, calories } = await readBody(req);
    if (cycle_id == null) return json(res, 400, { error: 'Invalid payload' });
    const own = await sql`SELECT id FROM cycles WHERE id = ${cycle_id} AND user_id = ${auth.id}`;
    if (!own[0]) return json(res, 403, { error: 'Forbidden' });
    const rows = await sql`INSERT INTO cycle_goals (cycle_id, protein_g, carbs_g, fats_g, water_ml, calories, updated_at) VALUES (${cycle_id}, ${protein_g}, ${carbs_g}, ${fats_g}, ${water_ml}, ${calories}, now()) ON CONFLICT (cycle_id) DO UPDATE SET protein_g = EXCLUDED.protein_g, carbs_g = EXCLUDED.carbs_g, fats_g = EXCLUDED.fats_g, water_ml = EXCLUDED.water_ml, calories = EXCLUDED.calories, updated_at = now() RETURNING cycle_id, protein_g, carbs_g, fats_g, water_ml, calories`;
    json(res, 200, { ok: true, row: rows[0] });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

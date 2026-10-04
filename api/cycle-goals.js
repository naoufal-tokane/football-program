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
    const updated = await sql`UPDATE cycle_goals SET protein_g = ${protein_g}, carbs_g = ${carbs_g}, fats_g = ${fats_g}, water_ml = ${water_ml}, calories = ${calories}, updated_at = now() WHERE cycle_id = ${cycle_id} RETURNING cycle_id, protein_g, carbs_g, fats_g, water_ml, calories`;
    let row = updated[0];
    if (!row) {
      const inserted = await sql`INSERT INTO cycle_goals (cycle_id, protein_g, carbs_g, fats_g, water_ml, calories, updated_at) VALUES (${cycle_id}, ${protein_g}, ${carbs_g}, ${fats_g}, ${water_ml}, ${calories}, now()) RETURNING cycle_id, protein_g, carbs_g, fats_g, water_ml, calories`;
      row = inserted[0];
    }
    json(res, 200, { ok: true, row });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

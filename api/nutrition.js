import { sql, json, readBody } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  try {
    const { cycle_id, day_num, protein_g, carbs_g, fats_g, calories, water_ml } = await readBody(req);
    if (cycle_id == null || day_num == null) return json(res, 400, { error: 'Invalid payload' });
    const rows = await sql`INSERT INTO nutrition (cycle_id, day_num, protein_g, carbs_g, fats_g, calories, water_ml, logged_at) VALUES (${cycle_id}, ${day_num}, ${protein_g}, ${carbs_g}, ${fats_g}, ${calories}, ${water_ml}, now()) ON CONFLICT (cycle_id, day_num) DO UPDATE SET protein_g = EXCLUDED.protein_g, carbs_g = EXCLUDED.carbs_g, fats_g = EXCLUDED.fats_g, calories = EXCLUDED.calories, water_ml = EXCLUDED.water_ml, logged_at = now() RETURNING day_num, protein_g, carbs_g, fats_g, calories, water_ml`;
    json(res, 200, { ok: true, row: rows[0] });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

import { sql, json, readBody } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  try {
    const { day_num, weight_kg } = await readBody(req);
    if (day_num == null || weight_kg == null)
      return json(res, 400, { error: 'Invalid payload' });

  const rows = await sql`
  INSERT INTO weights (day_num, weight_kg, logged_at)
  VALUES (${day_num}, ${weight_kg}, now())
  ON CONFLICT (day_num)
  DO UPDATE SET weight_kg = EXCLUDED.weight_kg, logged_at = now()
  RETURNING day_num, weight_kg, logged_at`;
    json(res, 200, { ok: true, row: rows[0] });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

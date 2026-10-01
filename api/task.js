import { sql, json, readBody } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  try {
    const { day_num, session, task_index, done } = await readBody(req);
    if (day_num == null || !['am','pm'].includes(session) || task_index == null)
      return json(res, 400, { error: 'Invalid payload' });

  const rows = await sql`
  INSERT INTO task_progress (day_num, session, task_index, done, updated_at)
  VALUES (${day_num}, ${session}, ${task_index}, ${!!done}, now())
  ON CONFLICT (day_num, session, task_index)
  DO UPDATE SET done = EXCLUDED.done, updated_at = now()
  RETURNING day_num, session, task_index, done`;
    json(res, 200, { ok: true, row: rows[0] });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

import { sql, json, readBody } from './_db.js';
import { getUser } from './_auth.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  const auth = getUser(req);
  if (!auth) return json(res, 401, { error: 'Not authenticated' });
  try {
    const { cycle_id, day_num, session, task_index, done } = await readBody(req);
    if (cycle_id == null || day_num == null || !['am','pm'].includes(session) || task_index == null)
      return json(res, 400, { error: 'Invalid payload' });
    const own = await sql`SELECT id FROM cycles WHERE id = ${cycle_id} AND user_id = ${auth.id}`;
    if (!own[0]) return json(res, 403, { error: 'Forbidden' });
    const rows = await sql`
    INSERT INTO task_progress (cycle_id, day_num, session, task_index, done, updated_at)
    VALUES (${cycle_id}, ${day_num}, ${session}, ${task_index}, ${!!done}, now())
    ON CONFLICT (cycle_id, day_num, session, task_index)
    DO UPDATE SET done = EXCLUDED.done, updated_at = now()
    RETURNING day_num, session, task_index, done`;
    json(res, 200, { ok: true, row: rows[0] });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

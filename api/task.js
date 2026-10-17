import { sql, json, readBody } from './_db.js';
import { getUser } from './_auth.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  const auth = getUser(req);
  if (!auth) return json(res, 401, { error: 'Not authenticated' });
  try {
    const body = await readBody(req);
    const { cycle_id, day_num, session, task_index, done } = body;
    if (cycle_id == null || day_num == null || !['am','pm','mode'].includes(session) || task_index == null)
      return json(res, 400, { error: 'Invalid payload' });
    const own = await sql`SELECT id FROM cycles WHERE id = ${cycle_id} AND user_id = ${auth.id}`;
    if (!own[0]) return json(res, 403, { error: 'Forbidden' });
    // Strength log: { weight_kg } and/or { reps } update only those values and keep the done flag.
    const hasW = Object.prototype.hasOwnProperty.call(body, 'weight_kg');
    const hasR = Object.prototype.hasOwnProperty.call(body, 'reps');
    if (done === undefined && (hasW || hasR)) {
      const w = hasW && body.weight_kg !== null && body.weight_kg !== '' ? Number(body.weight_kg) : null;
      const r = hasR && body.reps !== null && body.reps !== '' ? Math.round(Number(body.reps)) : null;
      if ((w !== null && (!isFinite(w) || w < 0)) || (r !== null && (!isFinite(r) || r < 0)))
        return json(res, 400, { error: 'Invalid value' });
      const rows = await sql`
      INSERT INTO task_progress (cycle_id, day_num, session, task_index, done, weight_kg, reps, updated_at)
      VALUES (${cycle_id}, ${day_num}, ${session}, ${task_index}, false, ${w}::numeric, ${r}::integer, now())
      ON CONFLICT (cycle_id, day_num, session, task_index)
      DO UPDATE SET
        weight_kg = CASE WHEN ${hasW}::boolean THEN EXCLUDED.weight_kg ELSE task_progress.weight_kg END,
        reps = CASE WHEN ${hasR}::boolean THEN EXCLUDED.reps ELSE task_progress.reps END,
        updated_at = now()
      RETURNING day_num, session, task_index, done, weight_kg, reps`;
      return json(res, 200, { ok: true, row: rows[0] });
    }
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

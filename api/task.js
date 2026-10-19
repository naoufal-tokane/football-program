import { sql, json, readBody } from './_db.js';
import { getUser } from './_auth.js';
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
// Parse a metric value: null/'' clears it, otherwise it must be a finite number >= 0.
function num(v, int) {
  if (v === null || v === '' || v === undefined) return null;
  const n = Number(v);
  if (!isFinite(n) || n < 0) throw new Error('Invalid value');
  return int ? Math.round(n) : n;
}
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
    // Metrics: weight_kg, reps, distance_km, time_s (+ task_label). Only the fields sent are updated; done is kept.
    const hasW = has(body, 'weight_kg'), hasR = has(body, 'reps'), hasD = has(body, 'distance_km'), hasT = has(body, 'time_s');
    const hasL = typeof body.task_label === 'string' && body.task_label.length > 0;
    if (done === undefined && (hasW || hasR || hasD || hasT)) {
      let w, r, d, t;
      try { w = num(body.weight_kg); r = num(body.reps, true); d = num(body.distance_km); t = num(body.time_s); }
      catch (e) { return json(res, 400, { error: 'Invalid value' }); }
      const label = hasL ? body.task_label.slice(0, 120) : null;
      const rows = await sql`
      INSERT INTO task_progress (cycle_id, day_num, session, task_index, done, weight_kg, reps, distance_km, time_s, task_label, updated_at)
      VALUES (${cycle_id}, ${day_num}, ${session}, ${task_index}, false, ${w}::numeric, ${r}::integer, ${d}::numeric, ${t}::numeric, ${label}, now())
      ON CONFLICT (cycle_id, day_num, session, task_index)
      DO UPDATE SET
        weight_kg = CASE WHEN ${hasW}::boolean THEN EXCLUDED.weight_kg ELSE task_progress.weight_kg END,
        reps = CASE WHEN ${hasR}::boolean THEN EXCLUDED.reps ELSE task_progress.reps END,
        distance_km = CASE WHEN ${hasD}::boolean THEN EXCLUDED.distance_km ELSE task_progress.distance_km END,
        time_s = CASE WHEN ${hasT}::boolean THEN EXCLUDED.time_s ELSE task_progress.time_s END,
        task_label = COALESCE(EXCLUDED.task_label, task_progress.task_label),
        updated_at = now()
      RETURNING day_num, session, task_index, done, weight_kg, reps, distance_km, time_s, task_label`;
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

import { sql, json } from './_db.js';
import { getUser } from './_auth.js';
export default async function handler(req, res) {
  const auth = getUser(req);
  if (!auth) return json(res, 401, { error: 'Not authenticated' });
  try {
    let cyc = await sql`SELECT id, cycle_num, start_date FROM cycles WHERE user_id = ${auth.id} AND finished_at IS NULL ORDER BY cycle_num DESC LIMIT 1`;
    if (!cyc[0]) {
      cyc = await sql`INSERT INTO cycles (cycle_num, start_date, user_id) VALUES (1, CURRENT_DATE, ${auth.id}) RETURNING id, cycle_num, start_date`;
    }
    const cycle = cyc[0];
    const cid = cycle ? cycle.id : 0;
    const [profile, days, task_progress, weights, history, nutrition, records] = await Promise.all([
      sql`SELECT id, email, first_name, last_name FROM users WHERE id = ${auth.id}`,
      sql`SELECT day_num, week, title, am_tasks, pm_tasks, is_rest FROM days WHERE user_id = ${auth.id} ORDER BY day_num`,
      sql`SELECT day_num, session, task_index, done, weight_kg, reps, distance_km, time_s FROM task_progress WHERE cycle_id = ${cid}`,
      sql`SELECT day_num, weight_kg, logged_at FROM weights WHERE cycle_id = ${cid} ORDER BY day_num`,
      sql`SELECT cycle_num, start_date, finished_at, summary FROM cycles WHERE user_id = ${auth.id} AND finished_at IS NOT NULL ORDER BY cycle_num DESC`,
      sql`SELECT day_num, protein_g, carbs_g, fats_g, calories, water_ml FROM nutrition WHERE cycle_id = ${cid} ORDER BY day_num`,
      sql`SELECT tp.cycle_id, c.cycle_num, tp.day_num, tp.session, tp.task_index, tp.task_label, tp.weight_kg, tp.reps, tp.distance_km, tp.time_s FROM task_progress tp JOIN cycles c ON c.id = tp.cycle_id WHERE c.user_id = ${auth.id} AND tp.task_label IS NOT NULL AND (tp.weight_kg IS NOT NULL OR tp.reps IS NOT NULL OR tp.distance_km IS NOT NULL OR tp.time_s IS NOT NULL)`
      ]);
    const p = profile[0] || {};
    const user = { id: auth.id, email: p.email || auth.email, first_name: p.first_name || null, last_name: p.last_name || null };
    let goals = null; try { const g = await sql`SELECT cycle_id, protein_g, carbs_g, fats_g, water_ml, calories FROM cycle_goals WHERE cycle_id = ${cid}`; goals = g[0] || null; } catch (ge) { goals = null; }
    json(res, 200, { user, cycle, days, task_progress, weights, checklist: [], history, nutrition, records, goals, has_program: days.length > 0 });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

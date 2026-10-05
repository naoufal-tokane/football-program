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
    const mine = await sql`SELECT count(*)::int AS n FROM days WHERE user_id = ${auth.id}`;
    if (!mine[0] || mine[0].n === 0) {
      await sql`INSERT INTO days (user_id, day_num, week, title, am_tasks, pm_tasks, is_rest) SELECT ${auth.id}, day_num, week, title, am_tasks, pm_tasks, is_rest FROM days WHERE user_id IS NULL ORDER BY day_num`;
    }
    const [days, task_progress, weights, checklist, history, nutrition] = await Promise.all([
      sql`SELECT day_num, week, title, am_tasks, pm_tasks, is_rest FROM days WHERE user_id = ${auth.id} ORDER BY day_num`,
      sql`SELECT day_num, session, task_index, done FROM task_progress WHERE cycle_id = ${cid}`,
      sql`SELECT day_num, weight_kg, logged_at FROM weights WHERE cycle_id = ${cid} ORDER BY day_num`,
      sql`SELECT day_num, item_index, done FROM daily_checklist WHERE cycle_id = ${cid}`,
      sql`SELECT cycle_num, start_date, finished_at, summary FROM cycles WHERE user_id = ${auth.id} AND finished_at IS NOT NULL ORDER BY cycle_num DESC`,
      sql`SELECT day_num, protein_g, carbs_g, fats_g, calories, water_ml FROM nutrition WHERE cycle_id = ${cid} ORDER BY day_num`
      ]);
    let goals = null; try { const g = await sql`SELECT cycle_id, protein_g, carbs_g, fats_g, water_ml, calories FROM cycle_goals WHERE cycle_id = ${cid}`; goals = g[0] || null; } catch (ge) { goals = null; }
    json(res, 200, { user: { id: auth.id, email: auth.email }, cycle, days, task_progress, weights, checklist, history, nutrition, goals });
  } catch (e) {
    json(res, 500, { error: String(e.message || e) });
  }
}

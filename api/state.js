import { sql, json } from './_db.js';

export default async function handler(req, res) {
try {
const cyc = await sql`SELECT id, cycle_num, start_date FROM cycles WHERE finished_at IS NULL ORDER BY cycle_num DESC LIMIT 1`;
const cycle = cyc[0];
const cid = cycle ? cycle.id : 0;
const [days, task_progress, weights, checklist, history] = await Promise.all([
sql`SELECT day_num, week, title, am_tasks, pm_tasks, is_rest FROM days ORDER BY day_num`,
sql`SELECT day_num, session, task_index, done FROM task_progress WHERE cycle_id = ${cid}`,
sql`SELECT day_num, weight_kg, logged_at FROM weights WHERE cycle_id = ${cid} ORDER BY day_num`,
sql`SELECT day_num, item_index, done FROM daily_checklist WHERE cycle_id = ${cid}`,
sql`SELECT cycle_num, start_date, finished_at, summary FROM cycles WHERE finished_at IS NOT NULL ORDER BY cycle_num DESC`
]);
json(res, 200, { cycle, days, task_progress, weights, checklist, history });
} catch (e) {
json(res, 500, { error: String(e.message || e) });
}
}

import { sql, json } from './_db.js';

export default async function handler(req, res) {
try {
const [days, task_progress, weights, checklist] = await Promise.all([
  sql`SELECT day_num, week, title, am_tasks, pm_tasks, is_rest FROM days ORDER BY day_num`,
  sql`SELECT day_num, session, task_index, done FROM task_progress`,
  sql`SELECT day_num, weight_kg, logged_at FROM weights ORDER BY day_num`,
  sql`SELECT day_num, item_index, done FROM daily_checklist`
]);
json(res, 200, { days, task_progress, weights, checklist });
} catch (e) {
json(res, 500, { error: String(e.message || e) });
}
}

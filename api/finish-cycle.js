import { sql, json, readBody } from './_db.js';

export default async function handler(req, res) {
if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
try {
const { cycle_id, summary } = await readBody(req);
if (cycle_id == null) return json(res, 400, { error: 'Invalid payload' });

const cur = await sql`SELECT cycle_num, start_date FROM cycles WHERE id = ${cycle_id}`;
if (!cur[0]) return json(res, 404, { error: 'Cycle not found' });

await sql`UPDATE cycles SET finished_at = now(), summary = ${JSON.stringify(summary || {})}::jsonb WHERE id = ${cycle_id}`;

const nextStart = await sql`SELECT (${cur[0].start_date}::date + INTERVAL '14 days')::date AS d`;
const nextNum = cur[0].cycle_num + 1;
const ins = await sql`INSERT INTO cycles (cycle_num, start_date) VALUES (${nextNum}, ${nextStart[0].d}) RETURNING id, cycle_num, start_date`;

json(res, 200, { ok: true, cycle: ins[0] });
} catch (e) {
json(res, 500, { error: String(e.message || e) });
}
}

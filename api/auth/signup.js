import { sql, json, readBody } from '../_db.js';
import bcrypt from 'bcryptjs';
import { signToken, setAuthCookie } from '../_auth.js';
export default async function handler(req, res) {
if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
try {
const { email, password } = await readBody(req);
const e = (email || '').trim().toLowerCase();
if (!e || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return json(res, 400, { error: 'Valid email required' });
if (!password || String(password).length < 8) return json(res, 400, { error: 'Password must be at least 8 characters' });
const existing = await sql`SELECT id FROM users WHERE email = ${e}`;
if (existing[0]) return json(res, 409, { error: 'An account with this email already exists' });
const hash = await bcrypt.hash(String(password), 10);
const rows = await sql`INSERT INTO users (email, password_hash, created_at) VALUES (${e}, ${hash}, now()) RETURNING id, email`;
const user = rows[0];
setAuthCookie(res, signToken(user));
json(res, 200, { ok: true, user: { id: user.id, email: user.email } });
} catch (err) {
json(res, 500, { error: String(err.message || err) });
}
}

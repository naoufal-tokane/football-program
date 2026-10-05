import { sql, json, readBody } from '../_db.js';
import bcrypt from 'bcryptjs';
import { signToken, setAuthCookie } from '../_auth.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'POST only' });
  try {
    const { email, password } = await readBody(req);
    const e = (email || '').trim().toLowerCase();
    if (!e || !password) return json(res, 400, { error: 'Email and password required' });
    const rows = await sql`SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ${e}`;
    const user = rows[0];
    if (!user) return json(res, 401, { error: 'Invalid email or password' });
    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) return json(res, 401, { error: 'Invalid email or password' });
    setAuthCookie(res, signToken(user));
    json(res, 200, { ok: true, user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name } });
  } catch (err) {
    json(res, 500, { error: String(err.message || err) });
  }
}

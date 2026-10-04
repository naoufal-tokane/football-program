import { json } from '../_db.js';
import { clearAuthCookie } from '../_auth.js';
export default async function handler(req, res) {
  clearAuthCookie(res);
  json(res, 200, { ok: true });
}

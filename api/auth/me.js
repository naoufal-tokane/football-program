import { json } from '../_db.js';
import { getUser } from '../_auth.js';
export default async function handler(req, res) {
const user = getUser(req);
json(res, 200, { user: user ? { id: user.id, email: user.email } : null });
}

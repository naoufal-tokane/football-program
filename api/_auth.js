import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const COOKIE = 'fp_session';
export function signToken(user) { return jwt.sign({ uid: user.id, email: user.email }, SECRET, { expiresIn: '30d' }); }
export function setAuthCookie(res, token) { res.setHeader('Set-Cookie', COOKIE + '=' + token + '; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=' + (60*60*24*30)); }
export function clearAuthCookie(res) { res.setHeader('Set-Cookie', COOKIE + '=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'); }
export function getUser(req) { try { const raw = req.headers.cookie || ''; const m = raw.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '=')); if (!m) return null; const token = m.slice(COOKIE.length + 1); const p = jwt.verify(token, SECRET); return { id: p.uid, email: p.email }; } catch (e) { return null; } }

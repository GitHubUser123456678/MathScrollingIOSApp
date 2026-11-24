// Accounts, public posts, likes and comments, talking to Supabase's REST API directly
// (no extra library needed). Everything here is a no-op when config.js is empty.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const BASE = (SUPABASE_URL || '').replace(/\/+$/, '');
export const cloudEnabled = Boolean(BASE && SUPABASE_ANON_KEY);

const SESSION_KEY = 'ms:session';
let session = null;
try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { session = null; }
const listeners = new Set();

function saveSession(s) {
  session = s;
  try { if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s)); else localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  listeners.forEach((fn) => fn(currentUser()));
}
export function onAuthChange(fn) { listeners.add(fn); }
export function currentUser() {
  if (!session?.user) return null;
  return { id: session.user.id, email: session.user.email, username: session.profile?.username || session.user.user_metadata?.username, displayName: session.profile?.display_name || session.user.user_metadata?.display_name };
}

function errorText(data, status) {
  const raw = data?.msg || data?.error_description || data?.message || data?.error || `Request failed (${status})`;
  if (/invalid login credentials|invalid_grant/i.test(raw)) return 'Wrong email or password.';
  if (/email not confirmed/i.test(raw)) return 'Confirm your email first — check your inbox for the link.';
  if (/already registered|already been registered|user_already_exists/i.test(raw)) return 'There’s already an account with that email. Try signing in.';
  if (/password should be at least/i.test(raw)) return 'Password must be at least 6 characters.';
  if (/rate limit/i.test(raw)) return 'Too many tries. Wait a minute and try again.';
  if (/duplicate key|unique/i.test(raw)) return 'That name is taken.';
  return raw;
}

async function request(path, { method = 'GET', body, auth = true, prefer, timeout = 15000 } = {}) {
  if (!cloudEnabled) throw new Error('Accounts aren’t set up for this app yet.');
  if (auth) await ensureFresh();
  const headers = { apikey: SUPABASE_ANON_KEY, 'Content-Type': 'application/json' };
  headers.Authorization = `Bearer ${auth && session?.access_token ? session.access_token : SUPABASE_ANON_KEY}`;
  if (prefer) headers.Prefer = prefer;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: ctrl.signal });
  } catch (e) {
    throw new Error(e.name === 'AbortError' ? 'The server took too long to answer.' : 'Couldn’t reach the server. Check your connection.');
  } finally { clearTimeout(t); }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (res.status === 401 && auth && session) {
    // Session no longer valid: sign out locally so the app keeps working.
    saveSession(null);
  }
  if (!res.ok) throw new Error(errorText(data, res.status));
  return data;
}

let refreshing = null;
async function ensureFresh() {
  if (!session?.refresh_token) return;
  const now = Math.floor(Date.now() / 1000);
  if (session.expires_at && session.expires_at - 60 > now) return;
  refreshing ||= (async () => {
    try {
      const data = await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: session.refresh_token }, auth: false });
      saveSession({ ...data, profile: session.profile, expires_at: data.expires_at || now + (data.expires_in || 3600) });
    } catch {
      saveSession(null);
    } finally { refreshing = null; }
  })();
  await refreshing;
}

async function loadProfile() {
  if (!session?.user) return;
  try {
    const rows = await request(`/rest/v1/profiles?id=eq.${session.user.id}&select=*`);
    if (rows?.[0]) saveSession({ ...session, profile: rows[0] });
  } catch { /* keep going without it */ }
}

// ------------------------------------------------------------------ auth
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
export function validUsername(u) { return USERNAME_RE.test(u); }

export async function usernameTaken(username) {
  const rows = await request(`/rest/v1/profiles?username=ilike.${encodeURIComponent(username)}&select=id`, { auth: false });
  return rows.length > 0;
}

export async function signUp({ email, password, username }) {
  if (!validUsername(username)) throw new Error('Usernames are 3–20 letters, numbers or underscores.');
  if (await usernameTaken(username)) throw new Error('That username is taken.');
  const data = await request('/auth/v1/signup', { method: 'POST', auth: false, body: { email, password, data: { username, display_name: username } } });
  if (data?.access_token) {
    saveSession({ ...data, expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600) });
    await loadProfile();
    return { signedIn: true };
  }
  return { signedIn: false, needsConfirm: true };
}

export async function signIn({ email, password }) {
  const data = await request('/auth/v1/token?grant_type=password', { method: 'POST', auth: false, body: { email, password } });
  saveSession({ ...data, expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600) });
  await loadProfile();
  return currentUser();
}

export async function signOut() {
  try { await request('/auth/v1/logout', { method: 'POST' }); } catch { /* signing out locally is enough */ }
  saveSession(null);
}

export async function updateDisplayName(name) {
  const u = currentUser();
  if (!u) return;
  const rows = await request(`/rest/v1/profiles?id=eq.${u.id}`, { method: 'PATCH', body: { display_name: name.slice(0, 40) }, prefer: 'return=representation' });
  if (rows?.[0]) saveSession({ ...session, profile: rows[0] });
}

// Refresh the profile in the background on start.
if (cloudEnabled && session) ensureFresh().then(loadProfile);

// ------------------------------------------------------------------ posts
const POST_SELECT = 'select=id,user_id,kind,title,body,answer,solution,topic,difficulty,like_count,comment_count,created_at,profiles(username,display_name)';

export async function listPosts({ order = 'new', limit = 15, offset = 0, userId = null } = {}) {
  const ord = order === 'top' ? 'like_count.desc,created_at.desc' : 'created_at.desc';
  const who = userId ? `&user_id=eq.${userId}` : '';
  return request(`/rest/v1/posts?${POST_SELECT}${who}&order=${ord}&limit=${limit}&offset=${offset}`, { auth: !!session });
}

export async function getPost(id) {
  const rows = await request(`/rest/v1/posts?${POST_SELECT}&id=eq.${Number(id)}`, { auth: !!session });
  return rows?.[0] || null;
}

export async function createPost(p) {
  const rows = await request('/rest/v1/posts', {
    method: 'POST', prefer: 'return=representation',
    body: { kind: p.k, title: p.t || null, body: p.b, answer: p.a || null, solution: p.s || null, topic: p.topic || null, difficulty: p.difficulty || null },
  });
  return rows?.[0];
}

export async function deletePost(id) {
  await request(`/rest/v1/posts?id=eq.${Number(id)}`, { method: 'DELETE' });
}

export async function myLikes(postIds) {
  const u = currentUser();
  if (!u || !postIds.length) return new Set();
  const rows = await request(`/rest/v1/likes?select=post_id&user_id=eq.${u.id}&post_id=in.(${postIds.map(Number).join(',')})`);
  return new Set(rows.map((r) => r.post_id));
}

export async function setLike(postId, on) {
  const u = currentUser();
  if (!u) throw new Error('Sign in to like posts.');
  if (on) await request('/rest/v1/likes', { method: 'POST', body: { post_id: Number(postId) }, prefer: 'resolution=ignore-duplicates' });
  else await request(`/rest/v1/likes?post_id=eq.${Number(postId)}&user_id=eq.${u.id}`, { method: 'DELETE' });
}

// ------------------------------------------------------------------ comments & reports
export async function listComments(postId) {
  return request(`/rest/v1/comments?select=id,user_id,body,created_at,profiles(username,display_name)&post_id=eq.${Number(postId)}&order=created_at.asc&limit=200`, { auth: !!session });
}
export async function addComment(postId, body) {
  if (!currentUser()) throw new Error('Sign in to comment.');
  const rows = await request('/rest/v1/comments', { method: 'POST', prefer: 'return=representation', body: { post_id: Number(postId), body: body.slice(0, 1000) } });
  return rows?.[0];
}
export async function deleteComment(id) {
  await request(`/rest/v1/comments?id=eq.${Number(id)}`, { method: 'DELETE' });
}
export async function report({ postId = null, commentId = null, reason = '' }) {
  if (!currentUser()) throw new Error('Sign in to report.');
  await request('/rest/v1/reports', { method: 'POST', body: { post_id: postId, comment_id: commentId, reason: reason.slice(0, 300) } });
}

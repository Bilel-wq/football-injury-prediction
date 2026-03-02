const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
  : 'http://localhost:8000';

async function fetchJson(input: RequestInfo, init?: RequestInit) {
  const r = await fetch(input, init);
  const data = await r.json();
  if (!r.ok) {
    throw Object.assign(new Error(data?.detail || 'Request failed'), { data });
  }
  return data;
}

export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    fetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  login: (data: { username: string; password: string }) =>
    fetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  addPlayer: (
    data: { name: string; number: number; position: string; image_url?: string },
    token: string
  ) =>
    fetchJson(`${API_BASE}/admin/add-player`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  getPlayerAccounts: (token: string) =>
    fetchJson(`${API_BASE}/admin/player-accounts`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

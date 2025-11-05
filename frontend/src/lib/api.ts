import { API_BASE } from './config';

export async function authedFetch(path: string, options: RequestInit = {}, getToken: () => Promise<string | null>) {
  const token = await getToken();
  if (!token) throw new Error('No auth token');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers||{}),
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`API ${res.status}: ${t}`);
  }
  return res.json();
}

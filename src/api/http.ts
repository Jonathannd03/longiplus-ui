import type { useAuthStore } from '@/stores/auth';

const API_BASE = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/v1';

export function createApiClient(store: ReturnType<typeof useAuthStore>) {
  return async function apiFetch<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const token = store.token;
    const schoolId = store.schoolId;

    const isFormData = init.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(init.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (schoolId) headers['X-School-Id'] = schoolId;

    const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

    if (res.status === 401) {
      store.logout();
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`API error ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  };
}

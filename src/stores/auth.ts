import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import keycloak, { initKeycloak } from '@/auth/keycloak';

export type StaffRole =
  | 'owner'
  | 'director'
  | 'bursar'
  | 'secretary'
  | 'teacher'
  | 'class_teacher'
  | 'longiplus_admin';

export interface AuthUser {
  keycloakUserId: string;
  email: string;
  role: StaffRole;
  schoolId: string;
}

export interface SchoolRef {
  id: string;
  name: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const schools = ref<SchoolRef[]>([]);
  const token = ref<string | null>(null);
  const schoolId = ref<string | null>(null);
  const authReady = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  async function initFromKeycloak(): Promise<void> {
    try {
      let authenticated: boolean;
      try {
        authenticated = await initKeycloak();
      } catch {
        return;
      }
      if (!authenticated) return;

      token.value = keycloak.token ?? null;

      const API_BASE = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/v1';
      const storedSchoolId = sessionStorage.getItem('longiplus_school_id');

      // POST /auth/session on first login; GET /auth/me on reload
      const method = storedSchoolId ? 'GET' : 'POST';
      const path = storedSchoolId ? '/auth/me' : '/auth/session';
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      };
      if (storedSchoolId) headers['X-School-Id'] = storedSchoolId;

      try {
        const res = await fetch(`${API_BASE}${path}`, { method, headers });
        if (!res.ok) return;

        const data = await res.json() as { user: AuthUser; schools: SchoolRef[] };
        user.value = data.user;
        schools.value = data.schools;
        schoolId.value = data.user.schoolId;
        sessionStorage.setItem('longiplus_school_id', data.user.schoolId);
      } catch {
        // Network error — stay unauthenticated in the UI
      }
    } finally {
      authReady.value = true;
    }
  }

  function login(): void {
    keycloak.login({ locale: 'fr' });
  }

  function logout(): void {
    sessionStorage.removeItem('longiplus_school_id');
    user.value = null;
    token.value = null;
    schoolId.value = null;
    keycloak.logout({ redirectUri: `${window.location.origin}/login` });
  }

  async function switchSchool(id: string): Promise<void> {
    sessionStorage.setItem('longiplus_school_id', id);
    schoolId.value = id;

    const API_BASE = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/v1';
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'X-School-Id': id,
        },
      });
      if (!res.ok) return;
      const data = await res.json() as { user: AuthUser; schools: SchoolRef[] };
      user.value = data.user;
      schools.value = data.schools;
    } catch { /* ignore */ }
  }

  return {
    user,
    schools,
    token,
    schoolId,
    authReady,
    isAuthenticated,
    initFromKeycloak,
    login,
    logout,
    switchSchool,
  };
});

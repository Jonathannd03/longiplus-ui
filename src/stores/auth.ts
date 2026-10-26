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

const API_BASE = () => import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/v1';
const KC_URL = () => import.meta.env['VITE_KEYCLOAK_URL'] ?? 'http://localhost:8080';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const schools = ref<SchoolRef[]>([]);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const schoolId = ref<string | null>(null);
  const authReady = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  function scheduleRefresh(expiresIn: number) {
    if (refreshTimer) clearTimeout(refreshTimer);
    const delay = Math.max((expiresIn - 30) * 1000, 10_000);
    refreshTimer = setTimeout(async () => {
      await silentRefresh();
    }, delay);
  }

  async function silentRefresh() {
    if (!refreshToken.value) return;
    try {
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: 'longiplus-web',
        refresh_token: refreshToken.value,
      });
      const res = await fetch(`${KC_URL()}/realms/longiplus/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) { logout(); return; }
      const data = await res.json() as { access_token: string; refresh_token: string; expires_in: number };
      token.value = data.access_token;
      refreshToken.value = data.refresh_token;
      scheduleRefresh(data.expires_in);
    } catch {
      logout();
    }
  }

  async function resolveSession(accessToken: string): Promise<boolean> {
    const storedSchoolId = sessionStorage.getItem('longiplus_school_id');
    const method = storedSchoolId ? 'GET' : 'POST';
    const path = storedSchoolId ? '/auth/me' : '/auth/session';
    const headers: Record<string, string> = { 'Authorization': `Bearer ${accessToken}` };
    if (storedSchoolId) headers['X-School-Id'] = storedSchoolId;

    try {
      const res = await fetch(`${API_BASE()}${path}`, { method, headers });
      if (!res.ok) return false;
      const data = await res.json() as { user: AuthUser; schools: SchoolRef[] };
      user.value = data.user;
      schools.value = data.schools;
      schoolId.value = data.user.schoolId;
      sessionStorage.setItem('longiplus_school_id', data.user.schoolId);
      return true;
    } catch {
      return false;
    }
  }

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
      if (token.value) await resolveSession(token.value);
    } finally {
      authReady.value = true;
    }
  }

  async function loginWithCredentials(identifier: string, password: string): Promise<string | null> {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: 'longiplus-web',
      username: identifier.trim(),
      password,
      scope: 'openid',
    });

    let tokenData: { access_token: string; refresh_token: string; expires_in: number };
    try {
      const res = await fetch(`${KC_URL()}/realms/longiplus/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string; error_description?: string };
        if (err.error === 'invalid_grant') return 'Identifiant ou mot de passe incorrect.';
        return 'Une erreur est survenue. Veuillez réessayer.';
      }
      tokenData = await res.json() as typeof tokenData;
    } catch {
      return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    }

    token.value = tokenData.access_token;
    refreshToken.value = tokenData.refresh_token;
    scheduleRefresh(tokenData.expires_in);

    const ok = await resolveSession(tokenData.access_token);
    if (!ok) return 'Connexion refusée. Contactez votre administrateur.';
    return null;
  }

  function login(): void {
    keycloak.login({ locale: 'fr' });
  }

  function logout(): void {
    if (refreshTimer) clearTimeout(refreshTimer);
    sessionStorage.removeItem('longiplus_school_id');
    const rt = refreshToken.value;
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    schoolId.value = null;
    if (rt) {
      // Revoke the refresh token (fire-and-forget)
      const body = new URLSearchParams({ client_id: 'longiplus-web', refresh_token: rt });
      fetch(`${KC_URL()}/realms/longiplus/protocol/openid-connect/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      }).catch(() => {});
    } else {
      keycloak.logout({ redirectUri: `${window.location.origin}/login` });
    }
  }

  async function switchSchool(id: string): Promise<void> {
    sessionStorage.setItem('longiplus_school_id', id);
    schoolId.value = id;

    try {
      const res = await fetch(`${API_BASE()}/auth/me`, {
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
    loginWithCredentials,
    login,
    logout,
    switchSchool,
  };
});

<template>
  <aside class="sidebar">
    <div class="sidebar__logo">
      <RouterLink to="/app/dashboard">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="28" />
      </RouterLink>
    </div>

    <div class="sidebar__school">
      <SchoolSwitcher />
      <p class="sidebar__school-meta">Année {{ school.year }} · {{ school.commune }}</p>
    </div>

    <nav class="sidebar__nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(item.to) }"
      >
        <span class="sidebar__icon" v-html="item.icon"></span>
        <span class="sidebar__label">{{ item.label }}</span>
        <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
      </RouterLink>
    </nav>

    <div class="sidebar__bottom">
      <RouterLink to="/app/settings" class="sidebar__link" :class="{ 'sidebar__link--active': isActive('/app/settings') }">
        <span class="sidebar__icon" v-html="iconSettings"></span>
        <span class="sidebar__label">Équipe et paramètres</span>
      </RouterLink>
      <button class="sidebar__link sidebar__link--logout" @click="authStore.logout()">
        <span class="sidebar__icon" v-html="iconLogout"></span>
        <span class="sidebar__label">Se déconnecter</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSchoolStore } from '@/stores/school'
import { useGradesStore } from '@/stores/grades'
import { useAuthStore } from '@/stores/auth'
import SchoolSwitcher from './SchoolSwitcher.vue'

const authStore = useAuthStore()

const route = useRoute()
const schoolStore = useSchoolStore()
const gradesStore = useGradesStore()
const school = computed(() => schoolStore.school)

function isActive(path: string) {
  if (path === '/app/dashboard') return route.path === '/app/dashboard'
  return route.path.startsWith(path)
}

const hasIncompleteSetup = computed(() => schoolStore.onboardingSteps.some(s => !s.done))

const navItems = computed(() => {
  if (!schoolStore.isOnboardingComplete) {
    return [{ to: '/app/onboarding', label: 'Démarrage', icon: iconSetup }]
  }
  const items = [
    { to: '/app/dashboard', label: 'Tableau de bord', icon: iconHome },
    { to: '/app/students', label: 'Élèves', icon: iconStudents },
    { to: '/app/classes', label: 'Classes et cours', icon: iconClasses },
    { to: '/app/attendance', label: 'Présences', icon: iconCalendar },
    { to: '/app/grades', label: 'Notes et bulletins', icon: iconNotes, badge: gradesStore.pendingCorrections > 0 ? gradesStore.pendingCorrections : undefined },
    { to: '/app/messages', label: 'Messages', icon: iconMessages },
    { to: '/app/reports', label: 'Rapports', icon: iconReports },
  ]
  if (hasIncompleteSetup.value) {
    items.splice(1, 0, { to: '/app/onboarding', label: 'Démarrage', icon: iconSetup, badge: schoolStore.onboardingSteps.filter(s => !s.done).length })
  }
  return items
})

const iconHome = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
const iconSetup = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`
const iconStudents = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
const iconClasses = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
const iconCalendar = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
const iconNotes = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
const iconMessages = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
const iconReports = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
const iconSettings = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`
const iconLogout = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
</script>

<style scoped>
.sidebar {
  width: 200px;
  min-width: 200px;
  background: #fff;
  border-right: 1px solid var(--k-border);
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar__logo {
  padding: 0 16px 16px;
}

.sidebar__logo img {
  display: block;
}

.sidebar__school {
  margin: 0 10px 16px;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.sidebar__school-name {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: var(--k-navy);
  margin: 0 0 2px;
}

.sidebar__school-meta {
  font-size: 11px;
  color: var(--k-text-muted);
  margin: 0;
}

.sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  color: #374151;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  position: relative;
}

.sidebar__link:hover {
  background: #f5f7fa;
  text-decoration: none;
}

.sidebar__link--active {
  background: var(--k-sky);
  color: var(--k-navy);
  font-weight: 600;
}

.sidebar__link--logout {
  color: var(--k-text-muted);
}

.sidebar__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: inherit;
}

.sidebar__label {
  flex: 1;
  min-width: 0;
}

.sidebar__badge {
  background: var(--k-yellow);
  color: #1a1a2e;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.sidebar__bottom {
  padding: 8px;
  border-top: 1px solid var(--k-border);
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>

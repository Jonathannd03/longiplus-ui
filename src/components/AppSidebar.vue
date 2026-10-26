<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar__logo">
      <RouterLink to="/app/dashboard">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="30" />
      </RouterLink>
    </div>

    <!-- School block -->
    <div class="sidebar__school">
      <SchoolSwitcher />
      <p class="sidebar__school-meta">{{ school.year }} · {{ school.commune }}</p>
    </div>

    <!-- Nav groups -->
    <nav class="sidebar__nav">
      <template v-for="group in navGroups" :key="group.label ?? '__main'">
        <p v-if="group.label" class="sidebar__group-label">{{ group.label }}</p>
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="sidebar__link"
          :class="{ 'sidebar__link--active': isActive(item.to) }"
        >
          <!-- v-html: icons are hardcoded SVG strings defined in this file — safe -->
          <span class="sidebar__icon" v-html="item.icon"></span>
          <span class="sidebar__label">{{ item.label }}</span>
          <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
        </RouterLink>
      </template>
    </nav>

    <!-- User card -->
    <div class="sidebar__user-card">
      <div class="sidebar__user-avatar">{{ userInitials }}</div>
      <div class="sidebar__user-info">
        <p class="sidebar__user-name">{{ userDisplayName }}</p>
        <p class="sidebar__user-role">{{ userRole }}</p>
      </div>
      <button class="sidebar__logout-btn" title="Se déconnecter" @click="authStore.logout()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
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

const navGroups = computed(() => {
  if (!schoolStore.isOnboardingComplete) {
    return [{ label: null, items: [{ to: '/app/onboarding', label: 'Démarrage', icon: iconSetup }] }]
  }

  const groups: { label: string | null; items: { to: string; label: string; icon: string; badge?: number }[] }[] = [
    {
      label: null,
      items: [{ to: '/app/dashboard', label: 'Tableau de bord', icon: iconHome }],
    },
    {
      label: 'GESTION',
      items: [
        { to: '/app/students', label: 'Élèves', icon: iconStudents },
        { to: '/app/classes', label: 'Classes et cours', icon: iconClasses },
        { to: '/app/attendance', label: 'Présences', icon: iconCalendar },
      ],
    },
    {
      label: 'ACADÉMIQUE',
      items: [
        ...(gradesStore.pendingCorrections > 0
          ? [{ to: '/app/grades', label: 'Notes et bulletins', icon: iconNotes, badge: gradesStore.pendingCorrections }]
          : [{ to: '/app/grades', label: 'Notes et bulletins', icon: iconNotes }]),
        { to: '/app/messages', label: 'Messages', icon: iconMessages },
      ],
    },
    {
      label: 'OUTILS',
      items: [
        { to: '/app/reports', label: 'Rapports', icon: iconReports },
        { to: '/app/settings', label: 'Équipe et paramètres', icon: iconSettings },
      ],
    },
  ]

  if (hasIncompleteSetup.value) {
    groups[0]!.items.push({
      to: '/app/onboarding',
      label: 'Démarrage',
      icon: iconSetup,
      badge: schoolStore.onboardingSteps.filter(s => !s.done).length,
    })
  }

  return groups
})

const roleMap: Record<string, string> = {
  director: 'Préfet', owner: 'Promoteur', bursar: 'Économe',
  secretary: 'Secrétaire', teacher: 'Professeur', class_teacher: 'Titulaire',
}
const user = computed(() => authStore.user)
const userDisplayName = computed(() => user.value?.email.split('@')[0] ?? '')
const userInitials = computed(() => userDisplayName.value.slice(0, 2).toUpperCase())
const userRole = computed(() => user.value ? (roleMap[user.value.role] ?? user.value.role) : '')

const iconHome = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
const iconSetup = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`
const iconStudents = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
const iconClasses = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
const iconCalendar = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
const iconNotes = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
const iconMessages = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
const iconReports = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
const iconSettings = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`
</script>

<style scoped>
.sidebar {
  width: 248px;
  min-width: 248px;
  background: #fff;
  border-right: 1px solid var(--k-border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

/* Logo */
.sidebar__logo {
  padding: 20px 20px 16px;
}
.sidebar__logo img {
  display: block;
}

/* School block */
.sidebar__school {
  margin: 0 12px 8px;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 10px;
}
.sidebar__school-meta {
  font-size: 11px;
  color: var(--k-text-muted);
  margin: 4px 0 0;
}

/* Nav */
.sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

.sidebar__group-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9ca3af;
  padding: 14px 20px 6px;
  margin: 0;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 20px;
  margin: 0 8px;
  border-radius: 8px;
  color: #4b5563;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
  border-left: 3px solid transparent;
  position: relative;
}

.sidebar__link:hover {
  background: #f5f7fa;
  color: var(--k-navy);
  text-decoration: none;
}

.sidebar__link--active {
  background: var(--k-sky);
  color: var(--k-navy);
  font-weight: 600;
  border-left-color: var(--k-navy);
}

.sidebar__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: inherit;
  opacity: 0.75;
}

.sidebar__link--active .sidebar__icon,
.sidebar__link:hover .sidebar__icon {
  opacity: 1;
}

.sidebar__label {
  flex: 1;
  min-width: 0;
}

.sidebar__badge {
  background: var(--k-orange);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  min-width: 20px;
  text-align: center;
  line-height: 1.4;
}

/* User card */
.sidebar__user-card {
  margin: 8px 12px 16px;
  padding: 14px;
  background: var(--k-navy);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar__user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(253, 196, 9, 0.25);
  color: var(--k-yellow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.sidebar__user-info {
  flex: 1;
  min-width: 0;
}

.sidebar__user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__user-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}

.sidebar__logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.sidebar__logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
</style>

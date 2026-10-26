<template>
  <div class="dashboard">
    <div class="dash-topbar">
      <div class="dash-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Rechercher un élève, une classe, un enseignant" class="dash-search__input" />
      </div>
      <div class="dash-topbar__right">
        <div class="user-chip">
          <span class="user-chip__initials">{{ userInitials }}</span>
          <span class="user-chip__name">{{ userDisplayName }}</span>
          <span class="user-chip__role">{{ roleLabel }}</span>
        </div>
        <RouterLink to="/app/messages" class="btn-navy">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Envoyer une annonce
        </RouterLink>
      </div>
    </div>

    <div class="page-content">
      <div>
        <p class="eyebrow eyebrow--orange">{{ todayLabel }}<template v-if="activePeriod"> · {{ activePeriod.label.toUpperCase() }}</template></p>
        <h1 class="page-title">Bonjour, {{ roleLabel }} {{ userDisplayName }}</h1>
      </div>

      <!-- Setup progress banner -->
      <div v-if="incompleteSteps.length" class="setup-banner">
        <div class="setup-banner__left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <p class="setup-banner__title">Configuration non terminée · {{ incompleteSteps.length }} étape{{ incompleteSteps.length > 1 ? 's' : '' }} restante{{ incompleteSteps.length > 1 ? 's' : '' }}</p>
            <p class="setup-banner__steps">{{ incompleteSteps.map(s => s.label).join(' · ') }}</p>
          </div>
        </div>
        <RouterLink to="/app/onboarding" class="setup-banner__btn">Reprendre la configuration →</RouterLink>
      </div>

      <div v-if="loading" class="loading-hint">Chargement du tableau de bord…</div>

      <div v-else class="stats-row">
        <StatCard
          label="ÉLÈVES INSCRITS"
          :value="dashData ? String(dashData.studentCount) : '—'"
          :sub="dashData ? `${dashData.missingRollCount} classe(s) sans appel aujourd'hui` : ''"
        />
        <StatCard
          label="PRÉSENCE AUJOURD'HUI"
          :value="dashData ? presentPct + ' %' : '—'"
          :sub="dashData ? `${dashData.studentCount - dashData.presentToday} absents` : ''"
          :bar-value="presentPct"
        />
        <StatCard
          :label="`NOTES SAISIES${activePeriod ? ' · ' + activePeriod.label : ''}`"
          :value="dashData ? dashData.marksPercent + ' %' : '—'"
          :sub="dashData ? `${dashData.marksFilled} / ${dashData.marksTotal} notes` : ''"
          :bar-value="dashData?.marksPercent ?? 0"
          bar-color="#FDC409"
        />
        <StatCard
          :label="`BULLETINS${activePeriod ? ' · ' + activePeriod.label : ''} PUBLIÉS`"
          :value="`${publishedSectionCount} / ${bulletinSections.length} classes`"
          :sub="readySectionCount > 0 ? `${readySectionCount} classe(s) attendent votre validation` : 'Aucune validation requise'"
        />
      </div>

      <div v-if="!loading" class="dash-two-col">
        <div class="dash-card">
          <div class="dash-card__header">
            <h3 class="dash-card__title">Présence cette semaine</h3>
            <RouterLink to="/app/attendance" class="dash-card__link">Voir les absences</RouterLink>
          </div>
          <div class="attendance-chart">
            <div
              v-for="day in attendanceStore.weeklyData"
              :key="day.day"
              class="chart-bar-wrap"
            >
              <span class="chart-bar-pct">{{ day.percent }} %</span>
              <div class="chart-bar-track">
                <div
                  class="chart-bar"
                  :style="{ height: (day.percent - 80) / 20 * 100 + '%' }"
                  :class="{ 'chart-bar--current': day.isCurrent }"
                ></div>
              </div>
              <span class="chart-bar-label">{{ day.day }} {{ day.date }}</span>
            </div>
          </div>
          <p class="chart-note">Axe de 80 à 100 %. Chaque barre = élèves présents à l'appel du matin.</p>
        </div>

        <div class="dash-card">
          <h3 class="dash-card__title">À faire</h3>
          <div class="todo-list">
            <RouterLink v-if="readySectionCount > 0" to="/app/bulletins" class="todo-item todo-item--blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <div>
                <p class="todo-item__title">{{ readySectionCount }} classe{{ readySectionCount > 1 ? 's' : '' }} à valider</p>
                <p class="todo-item__desc">{{ activePeriod ? 'Bulletins de la ' + activePeriod.label : 'Bulletins à valider' }}</p>
              </div>
            </RouterLink>
            <RouterLink v-if="(dashData?.pendingCorrections ?? 0) > 0" to="/app/grades/corrections" class="todo-item todo-item--cream">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <div>
                <p class="todo-item__title">{{ dashData!.pendingCorrections }} correction{{ dashData!.pendingCorrections > 1 ? 's' : '' }} de notes</p>
                <p class="todo-item__desc">Demandes en attente de traitement</p>
              </div>
            </RouterLink>
            <RouterLink v-if="(dashData?.missingRollCount ?? 0) > 0" to="/app/attendance" class="todo-item todo-item--red">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <p class="todo-item__title">{{ dashData!.missingRollCount }} classe{{ dashData!.missingRollCount > 1 ? 's' : '' }} sans appel</p>
                <p class="todo-item__desc">L'appel du matin n'a pas été effectué</p>
              </div>
            </RouterLink>
            <RouterLink v-if="(dashData?.pendingInvites ?? 0) > 0" to="/app/settings" class="todo-item todo-item--white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              <div>
                <p class="todo-item__title">{{ dashData!.pendingInvites }} invitation{{ dashData!.pendingInvites > 1 ? 's' : '' }} en attente</p>
                <p class="todo-item__desc">Enseignants invités non encore actifs</p>
              </div>
            </RouterLink>
            <p v-if="dashData && readySectionCount === 0 && !dashData.pendingCorrections && !dashData.missingRollCount && !dashData.pendingInvites" class="todo-empty">
              Aucune action requise pour le moment.
            </p>
          </div>
        </div>
      </div>

      <div v-if="!loading" class="dash-card">
        <div class="dash-card__header">
          <h3 class="dash-card__title">Classes</h3>
          <RouterLink to="/app/classes" class="dash-card__link">Toutes les classes</RouterLink>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Classe</th>
              <th>Notes</th>
              <th>Bulletins publiés</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="dashClasses.length === 0">
              <td colspan="4" style="text-align:center; color:#9ca3af; padding: 24px">Aucune classe cette année</td>
            </tr>
            <tr v-for="cls in dashClasses" :key="cls.id">
              <td class="td-bold">{{ cls.name }}</td>
              <td>
                <div class="mini-bar-wrap">
                  <div class="mini-bar"><div class="mini-bar__fill" :style="{ width: cls.notesPercent + '%' }"></div></div>
                  <span>{{ cls.notesPercent }} %</span>
                </div>
              </td>
              <td>{{ cls.bulletinCount }}</td>
              <td>
                <span class="bulletin-badge" :class="`bulletin-badge--${cls.bulletinStatus}`">
                  {{ cls.bulletinLabel }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StatCard from '@/components/StatCard.vue'
import { useSchoolStore } from '@/stores/school'
import { useAttendanceStore } from '@/stores/attendance'
import { useAuthStore } from '@/stores/auth'
import { useSetupApi } from '@/api/setup'
import type { DashboardData, BulletinSectionStatus, AcademicYear, Period } from '@/api/setup'

const schoolStore = useSchoolStore()
const attendanceStore = useAttendanceStore()
const authStore = useAuthStore()
const api = useSetupApi()

const incompleteSteps = computed(() => schoolStore.onboardingSteps.filter(s => !s.done))

const loading = ref(true)
const activeYear = ref<AcademicYear | null>(null)
const activePeriod = ref<Period | null>(null)
const dashData = ref<DashboardData | null>(null)
const bulletinSections = ref<BulletinSectionStatus[]>([])

const roleMap: Record<string, string> = {
  director: 'Préfet', owner: 'Promoteur', bursar: 'Économe',
  secretary: 'Secrétaire', teacher: 'Prof.', class_teacher: 'Titulaire',
}

const user = computed(() => authStore.user)
const roleLabel = computed(() => user.value ? (roleMap[user.value.role] ?? user.value.role) : '')
const userDisplayName = computed(() => user.value?.email.split('@')[0] ?? '')
const userInitials = computed(() => userDisplayName.value.slice(0, 2).toUpperCase())

const todayLabel = computed(() =>
  new Intl.DateTimeFormat('fr-CD', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Africa/Kinshasa',
  }).format(new Date()).toUpperCase()
)

const presentPct = computed(() => {
  if (!dashData.value?.studentCount) return 0
  return Math.round((dashData.value.presentToday / dashData.value.studentCount) * 100)
})

const publishedSectionCount = computed(() => bulletinSections.value.filter(s => s.status === 'published').length)
const readySectionCount = computed(() => bulletinSections.value.filter(s => s.status === 'ready').length)

const dashClasses = computed(() =>
  bulletinSections.value.map(s => ({
    id: s.id,
    name: s.name,
    notesPercent: s.notesPercent,
    bulletinStatus: s.status === 'published' ? 'published' : s.status === 'ready' ? 'validate' : 'progress',
    bulletinLabel: s.status === 'published' ? '✓ Publié' : s.status === 'ready' ? '✈ À valider' : s.status === 'in_progress' ? '⏱ En saisie' : '— Sans notes',
    bulletinCount: s.bulletinCount,
  }))
)

onMounted(async () => {
  try {
    const years = await api.academicYears.list()
    const active = years.find(y => y.status === 'active') ?? years[0] ?? null
    activeYear.value = active
    if (!active) return

    const detail = await api.academicYears.get(active.id)
    activePeriod.value = detail.periods.find(p => p.status === 'open') ?? detail.periods[detail.periods.length - 1] ?? null

    const [dash, sections] = await Promise.all([
      api.dashboard.get(active.id),
      api.bulletins.status(active.id),
    ])
    dashData.value = dash
    bulletinSections.value = sections
  } catch (err) {
    console.error('Dashboard load error', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; min-height: 100%; }

.dash-topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 32px;
  background: #fff;
  border-bottom: 1px solid var(--k-border);
}

.dash-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f5f7fa;
  border: 1px solid var(--k-border);
  border-radius: 8px;
  padding: 8px 14px;
}

.dash-search__input {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #374151;
  outline: none;
  flex: 1;
}

.dash-topbar__right { display: flex; align-items: center; gap: 12px; }

.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.user-chip__initials {
  width: 32px;
  height: 32px;
  background: var(--k-navy);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.user-chip__name { font-weight: 600; color: #1a1a2e; }
.user-chip__role { color: #6b7280; }

.page-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 6px;
}

.eyebrow--orange { color: #F7A21B; }

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0 0 4px;
}

.loading-hint { color: #6b7280; font-size: 14px; padding: 8px 0; }

.stats-row {
  display: flex;
  gap: 16px;
}

.dash-two-col {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
}

.dash-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 24px;
}

.dash-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.dash-card__title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0;
}

.dash-card__link {
  color: var(--k-blue);
  font-size: 13px;
  text-decoration: none;
}

.attendance-chart {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  height: 160px;
  margin-bottom: 12px;
}

.chart-bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.chart-bar-pct {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.chart-bar-track {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.chart-bar {
  width: 100%;
  background: var(--k-navy);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
}

.chart-bar--current {
  background: linear-gradient(to top, var(--k-navy) 70%, var(--k-yellow));
}

.chart-bar-label {
  font-size: 11px;
  color: #6b7280;
  margin-top: 6px;
  text-align: center;
}

.chart-note {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.todo-list { display: flex; flex-direction: column; gap: 8px; }
.todo-empty { font-size: 13px; color: #9ca3af; text-align: center; padding: 16px 0; margin: 0; }

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
}

.todo-item--blue  { background: #E8F1FC; }
.todo-item--cream { background: #FFF7E3; }
.todo-item--red   { background: #fee2e2; }
.todo-item--white { background: #f9fafb; border: 1px solid var(--k-border); }

.todo-item__title { font-weight: 600; font-size: 13px; margin: 0 0 2px; color: #1a1a2e; }
.todo-item__desc  { font-size: 12px; color: #6b7280; margin: 0; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; margin-top: 8px; }
.data-table th { text-align: left; padding: 8px 12px; font-size: 12px; font-weight: 600; color: #6b7280; border-bottom: 1px solid var(--k-border); }
.data-table td { padding: 12px 12px; border-bottom: 1px solid #f3f4f6; }
.td-bold { font-weight: 600; color: var(--k-navy); }

.mini-bar-wrap { display: flex; align-items: center; gap: 8px; }
.mini-bar { flex: 1; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; }
.mini-bar__fill { height: 100%; background: var(--k-navy); border-radius: 2px; }

.bulletin-badge { font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
.bulletin-badge--validate { background: #E8F1FC; color: var(--k-navy); }
.bulletin-badge--published { background: #dcfce7; color: #166534; }
.bulletin-badge--progress  { background: #fff7ed; color: #9a3412; }

.setup-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #fff8e6;
  border: 1px solid #fdc409;
  border-radius: 10px;
  padding: 14px 20px;
  flex-wrap: wrap;
}
.setup-banner__left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #92400e;
  flex: 1;
}
.setup-banner__title {
  font-size: 14px;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 3px;
}
.setup-banner__steps {
  font-size: 12.5px;
  color: #b45309;
  margin: 0;
}
.setup-banner__btn {
  background: var(--k-navy);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
}
.setup-banner__btn:hover { opacity: 0.88; text-decoration: none; }

.btn-navy {
  padding: 10px 18px;
  background: var(--k-navy);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}
</style>

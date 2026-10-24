<template>
  <div class="dashboard">
    <!-- FULL DASHBOARD MODE -->
      <div class="dash-topbar">
        <div class="dash-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Rechercher un élève, une classe, un enseignant" class="dash-search__input" />
        </div>
        <div class="dash-topbar__right">
          <div class="user-chip">
            <span class="user-chip__initials">JM</span>
            <span class="user-chip__name">J. Mukendi</span>
            <span class="user-chip__role">Préfet</span>
          </div>
          <button class="btn-navy">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Envoyer une annonce
          </button>
        </div>
      </div>

      <div class="page-content">
        <div>
          <p class="eyebrow eyebrow--orange">VENDREDI 15 JANVIER 2027 · PÉRIODE 2</p>
          <h1 class="page-title">Bonjour, Préfet Mukendi</h1>
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

        <div class="stats-row">
          <StatCard label="ÉLÈVES INSCRITS" value="412" sub="12 classes · 14 arrivés depuis septembre" />
          <StatCard label="PRÉSENCE AUJOURD'HUI" value="94 %" sub="25 absents · 2 classes sans appel" :bar-value="94" />
          <StatCard label="NOTES SAISIES · P2" value="86 %" sub="Clôture le 22 janvier" :bar-value="86" bar-color="#FDC409" />
          <StatCard label="BULLETINS P2 PUBLIÉS" value="3 / 12 classes" sub="2 classes attendent votre validation" />
        </div>

        <div class="dash-two-col">
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
              <RouterLink to="/app/bulletins" class="todo-item todo-item--blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                <div>
                  <p class="todo-item__title">2 classes à valider</p>
                  <p class="todo-item__desc">Bulletins de la période 2</p>
                </div>
              </RouterLink>
              <RouterLink to="/app/grades/corrections" class="todo-item todo-item--cream">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <div>
                  <p class="todo-item__title">2 corrections de notes</p>
                  <p class="todo-item__desc">Demandées après verrouillage de P1</p>
                </div>
              </RouterLink>
              <RouterLink to="/app/attendance" class="todo-item todo-item--red">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <div>
                  <p class="todo-item__title">4 élèves absents 3 jours de suite</p>
                  <p class="todo-item__desc">Les titulaires sont prévenus</p>
                </div>
              </RouterLink>
              <RouterLink to="/app/settings" class="todo-item todo-item--white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                <div>
                  <p class="todo-item__title">2 invitations en attente</p>
                  <p class="todo-item__desc">Enseignants de chimie et d'anglais</p>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="dash-card">
          <div class="dash-card__header">
            <h3 class="dash-card__title">Classes</h3>
            <RouterLink to="/app/classes" class="dash-card__link">Toutes les classes</RouterLink>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Classe</th>
                <th>Titulaire</th>
                <th>Effectif</th>
                <th>Présence semaine</th>
                <th>Notes P2</th>
                <th>Bulletin P2</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cls in dashClasses" :key="cls.id">
                <td class="td-bold">{{ cls.name }}</td>
                <td>{{ cls.teacher }}</td>
                <td>{{ cls.count }}</td>
                <td>{{ cls.attendance }}</td>
                <td>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar"><div class="mini-bar__fill" :style="{ width: cls.notesPercent + '%' }"></div></div>
                    <span>{{ cls.notesPercent }} %</span>
                  </div>
                </td>
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
import { computed } from 'vue'
import StatCard from '@/components/StatCard.vue'
import { useSchoolStore } from '@/stores/school'
import { useAttendanceStore } from '@/stores/attendance'

const schoolStore = useSchoolStore()
const attendanceStore = useAttendanceStore()
const school = computed(() => schoolStore.school)
const incompleteSteps = computed(() => schoolStore.onboardingSteps.filter(s => !s.done))

const dashClasses = [
  { id: 'c7', name: '4e Scientifique A', teacher: 'M. Ngoy', count: 38, attendance: '95 %', notesPercent: 92, bulletinStatus: 'validate', bulletinLabel: '✈ À valider' },
  { id: 'c11', name: '3e Commerciale', teacher: 'M. Kasongo', count: 35, attendance: '93 %', notesPercent: 100, bulletinStatus: 'validate', bulletinLabel: '✈ À valider' },
  { id: 'c10', name: '2e Pédagogie', teacher: 'Mme Banza', count: 31, attendance: '97 %', notesPercent: 100, bulletinStatus: 'published', bulletinLabel: '✓ Publié' },
  { id: 'c6', name: '6e Primaire', teacher: 'Mme Kalala', count: 42, attendance: '89 %', notesPercent: 74, bulletinStatus: 'progress', bulletinLabel: '⏱ En saisie' },
]
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

.page-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

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

/* ONBOARDING */
.onboarding-main { flex: 1; }

.page-content { display: flex; gap: 32px; }

.progress-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0 24px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: var(--k-navy);
  border-radius: 4px;
}

.progress-label { font-size: 13px; color: #6b7280; white-space: nowrap; }

.steps-list { display: flex; flex-direction: column; gap: 12px; }

.step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
}

.step--active { border: 2px solid var(--k-navy); }
.step--pending { opacity: 0.6; }

.step__num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.step--done .step__num { background: #dcfce7; }
.step--active .step__num { background: var(--k-navy); color: #fff; }

.step__content { flex: 1; }
.step__label { font-weight: 600; font-size: 14px; color: #1a1a2e; margin: 0 0 3px; }
.step__desc { font-size: 13px; color: #6b7280; margin: 0; }
.step__modify { color: var(--k-blue); font-size: 13px; text-decoration: none; white-space: nowrap; }

.step__continue {
  padding: 8px 20px;
  background: var(--k-navy);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.onboarding-aside {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agent-card {
  background: var(--k-navy);
  border-radius: var(--k-radius);
  padding: 20px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.agent-card::after {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: var(--k-yellow);
  border-radius: 50%;
  opacity: 0.8;
}

.agent-card__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.65);
  margin: 0 0 8px;
  position: relative;
  z-index: 1;
}

.agent-card__name {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px;
  position: relative;
  z-index: 1;
}

.agent-card__desc {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  margin: 0 0 16px;
  position: relative;
  z-index: 1;
}

.btn-yellow {
  padding: 10px 16px;
  background: var(--k-yellow);
  color: #1a1a2e;
  border: none;
  border-radius: 7px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  width: 100%;
}

.info-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 16px;
}

.info-card__title {
  font-weight: 600;
  font-size: 13px;
  color: var(--k-navy);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-card__desc {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

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
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--k-border);
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 13px;
  color: var(--k-blue);
  cursor: pointer;
}

.mt-16 { margin-top: 16px; }

.setup-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #fff8e6;
  border: 1px solid #fdc409;
  border-radius: 10px;
  padding: 14px 20px;
  margin-bottom: 20px;
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
</style>

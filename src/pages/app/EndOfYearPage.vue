<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Fin d'année — 2026-2027</h1>
        <p class="page-sub">Délibération · Décisions · Préparation de la rentrée 2027-2028</p>
      </div>
      <div class="header-actions">
        <button class="btn btn--ghost">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exporter le PV
        </button>
        <button class="btn btn--navy">Clôturer l'année</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-bar">
      <button v-for="tab in tabs" :key="tab.id" :class="['tab-btn', activeTab === tab.id ? 'tab-btn--active' : '']" @click="activeTab = tab.id">{{ tab.label }}</button>
    </div>

    <!-- Tab: Délibération -->
    <div v-if="activeTab === 'deliberation'" class="tab-content">
      <div class="stats-row">
        <div class="eoy-stat"><div class="eoy-num eoy-num--green">{{ admisCount }}</div><div class="eoy-label">Admis</div></div>
        <div class="eoy-stat"><div class="eoy-num eoy-num--orange">{{ secondeCount }}</div><div class="eoy-label">Seconde session</div></div>
        <div class="eoy-stat"><div class="eoy-num eoy-num--red">{{ doublantCount }}</div><div class="eoy-label">Doublent</div></div>
        <div class="eoy-stat"><div class="eoy-num">{{ totalRows }}</div><div class="eoy-label">Élèves traités</div></div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Élève</th><th>Moy. annuelle</th><th>Échecs</th><th>Proposition</th><th>Décision</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.studentName">
              <td class="student-name">{{ row.studentName }}</td>
              <td><strong>{{ row.annualAvg.toFixed(1) }} %</strong></td>
              <td>{{ row.failures }}</td>
              <td class="proposal">{{ row.proposal }}</td>
              <td>
                <input type="text" :value="row.decision" @change="updateDecision(row.studentName, ($event.target as HTMLInputElement).value)" class="decision-input" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab: Rentrée suivante -->
    <div v-if="activeTab === 'nextyear'" class="tab-content">
      <div class="nextyear-grid">
        <div class="nextyear-card">
          <div class="nextyear-icon">📅</div>
          <h3 class="nextyear-title">Créer l'année 2027-2028</h3>
          <p class="nextyear-desc">Les classes, le barème et les périodes seront copiés depuis 2026-2027. Vous pourrez les modifier.</p>
          <button class="btn btn--navy">Créer l'année scolaire</button>
        </div>
        <div class="nextyear-card">
          <div class="nextyear-icon">👥</div>
          <h3 class="nextyear-title">Promouvoir les élèves admis</h3>
          <p class="nextyear-desc">Les élèves admis sont automatiquement promus dans la classe suivante. Confirmez avant de continuer.</p>
          <button class="btn btn--ghost" disabled>Disponible après clôture</button>
        </div>
        <div class="nextyear-card">
          <div class="nextyear-icon">📤</div>
          <h3 class="nextyear-title">Exporter les listes de classes</h3>
          <p class="nextyear-desc">Exportez les listes d'élèves pour la rentrée : admis par classe, redoublants, exclus.</p>
          <button class="btn btn--ghost">Exporter (.xlsx)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGradesStore } from '@/stores'

const gradesStore = useGradesStore()
const activeTab = ref('deliberation')
const tabs = [
  { id: 'deliberation', label: 'Délibération' },
  { id: 'nextyear', label: 'Rentrée 2027-2028' },
]

const rows = ref(gradesStore.endOfYearRows.map(r => ({ ...r })))

const totalRows = computed(() => rows.value.length)
const admisCount = computed(() => rows.value.filter(r => r.decision.startsWith('Admis')).length)
const secondeCount = computed(() => rows.value.filter(r => r.decision.startsWith('Seconde')).length)
const doublantCount = computed(() => rows.value.filter(r => r.decision.startsWith('Double')).length)

function updateDecision(studentName: string, decision: string) {
  const row = rows.value.find(r => r.studentName === studentName)
  if (row) row.decision = decision
}
</script>

<style scoped>
.page { padding: 32px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700; color: var(--k-navy); margin: 0 0 4px; }
.page-sub { font-size: 13px; color: var(--k-text-muted); margin: 0; }
.header-actions { display: flex; gap: 10px; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; }
.btn--navy { background: var(--k-navy); color: #fff; }
.btn--ghost { background: transparent; border: 1px solid #d1d5db; color: var(--k-text); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.tabs-bar { display: flex; gap: 4px; border-bottom: 1px solid var(--k-border); margin-bottom: 24px; }
.tab-btn { padding: 10px 16px; font-size: 14px; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; color: var(--k-text-muted); margin-bottom: -1px; }
.tab-btn--active { color: var(--k-navy); border-bottom-color: var(--k-navy); font-weight: 600; }
.stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
.eoy-stat { flex: 1; background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; }
.eoy-num { font-family: 'Poppins', sans-serif; font-size: 32px; font-weight: 700; color: var(--k-navy); }
.eoy-num--green { color: #16a34a; }
.eoy-num--orange { color: #d97706; }
.eoy-num--red { color: #dc2626; }
.eoy-label { font-size: 13px; color: var(--k-text-muted); margin-top: 4px; }
.table-wrapper { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { background: #f9fafb; padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--k-text-muted); border-bottom: 1px solid var(--k-border); white-space: nowrap; }
.data-table td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.student-name { font-weight: 600; color: var(--k-text); }
.proposal { color: var(--k-text-muted); font-style: italic; }
.decision-input { border: 1px solid #d1d5db; border-radius: 6px; padding: 5px 10px; font-size: 12px; font-family: inherit; outline: none; width: 100%; min-width: 200px; }
.decision-input:focus { border-color: var(--k-blue); box-shadow: 0 0 0 2px rgba(1,96,211,0.1); }
.nextyear-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.nextyear-card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 24px; display: flex; flex-direction: column; gap: 12px; }
.nextyear-icon { font-size: 28px; }
.nextyear-title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 700; color: var(--k-navy); margin: 0; }
.nextyear-desc { font-size: 13px; color: var(--k-text-muted); margin: 0; flex: 1; }
</style>

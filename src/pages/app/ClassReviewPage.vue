<template>
  <div class="page">
    <div class="page-header">
      <div>
        <RouterLink to="/app/teacher/day" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Mes cours
        </RouterLink>
        <p class="eyebrow">REVUE DE CLASSE · {{ currentClass }} · {{ currentPeriod }}</p>
        <h2>{{ currentClass }} — Revue du titulaire</h2>
      </div>
      <div class="header-actions">
        <button class="btn btn--ghost" @click="showSubmitModal = true" :disabled="!allConductFilled">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Soumettre au préfet
          <span v-if="!allConductFilled" class="btn-hint">({{ missingConductCount }} conduite{{ missingConductCount > 1 ? 's' : '' }} manquante{{ missingConductCount > 1 ? 's' : '' }})</span>
        </button>
      </div>
    </div>

    <!-- Summary bar -->
    <div class="summary-bar">
      <div class="summary-stat">
        <span class="summary-stat__value">{{ rows.length }}</span>
        <span class="summary-stat__label">élèves</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-stat">
        <span class="summary-stat__value">{{ avgPct }}%</span>
        <span class="summary-stat__label">moyenne de la classe</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-stat">
        <span class="summary-stat__value" :class="{ 'text-green': conductFilledCount === rows.length }">
          {{ conductFilledCount }}/{{ rows.length }}
        </span>
        <span class="summary-stat__label">conduites remplies</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-stat">
        <span class="summary-stat__value text-orange">{{ failCount }}</span>
        <span class="summary-stat__label">en dessous de 50%</span>
      </div>
    </div>

    <!-- Review table -->
    <div class="table-wrap">
      <table class="review-table">
        <thead>
          <tr>
            <th class="col-student">Élève</th>
            <th class="col-total">Total P{{ periodN }}<br><small>/ {{ totalMax }}</small></th>
            <th class="col-pct">%</th>
            <th class="col-rank">Rang</th>
            <th class="col-conduct">Conduite</th>
            <th class="col-appreciation">Appréciation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" class="review-row" :class="{ 'review-row--fail': row.pct < 50 }">
            <td class="col-student">
              <div class="student-cell">
                <span class="avatar-xs">{{ initials(row.name) }}</span>
                <div>
                  <p class="student-name">{{ row.name }}</p>
                  <p class="student-code">{{ row.code }}</p>
                </div>
              </div>
            </td>
            <td class="col-total">
              <span class="total-val" :class="{ 'text-red': row.pct < 50 }">{{ row.total }}</span>
            </td>
            <td class="col-pct">
              <span :class="{ 'text-red': row.pct < 50, 'text-green': row.pct >= 70 }">{{ row.pct }}%</span>
            </td>
            <td class="col-rank">{{ row.rank }}</td>
            <td class="col-conduct">
              <select v-model="row.conduct" class="conduct-select" :class="{ 'conduct-select--empty': !row.conduct }">
                <option value="">—</option>
                <option v-for="c in conductOptions" :key="c.id" :value="c.id">{{ c.label }}</option>
              </select>
            </td>
            <td class="col-appreciation">
              <input
                v-model="row.appreciation"
                type="text"
                class="appreciation-input"
                placeholder="Commentaire court…"
                maxlength="80"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Legend -->
    <div class="conduct-legend">
      <span class="legend-label">Conduites :</span>
      <span v-for="c in conductOptions" :key="c.id" class="legend-chip" :style="{ background: c.bg, color: c.color }">
        {{ c.id }} · {{ c.full }}
      </span>
    </div>

    <!-- Submit modal -->
    <div v-if="showSubmitModal" class="modal-overlay" @click.self="showSubmitModal = false">
      <div class="modal">
        <h3 class="modal-title">Soumettre au préfet</h3>
        <p class="modal-text">
          Vous envoyez la revue de <strong>{{ currentClass }}</strong> pour la {{ currentPeriod }} au préfet.<br>
          Après soumission, vous ne pouvez plus modifier les conduites.
        </p>
        <div class="modal-checks">
          <div class="modal-check">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {{ rows.length }} élèves · conduites remplies
          </div>
          <div class="modal-check modal-check--warn" v-if="failCount > 0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {{ failCount }} élève{{ failCount > 1 ? 's' : '' }} en dessous de 50%
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn--ghost" @click="showSubmitModal = false">Annuler</button>
          <button class="btn btn--navy" @click="submitToPreft">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Soumettre
          </button>
        </div>
      </div>
    </div>

    <!-- Submitted state -->
    <div v-if="submitted" class="submitted-banner">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      Revue soumise au préfet. En attente de validation.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const currentClass = 'Terminale Scientifique A'
const currentPeriod = 'Période 2'
const periodN = 2
const totalMax = 200

const conductOptions = [
  { id: 'E',  label: 'E · Excellent',   full: 'Excellent',   bg: '#dcfce7', color: '#15803d' },
  { id: 'TB', label: 'TB · Très bien',  full: 'Très bien',   bg: '#dbeafe', color: '#1d4ed8' },
  { id: 'B',  label: 'B · Bien',        full: 'Bien',        bg: '#e0f2fe', color: '#0369a1' },
  { id: 'AB', label: 'AB · Assez bien', full: 'Assez bien',  bg: '#fef9c3', color: '#92400e' },
  { id: 'M',  label: 'M · Médiocre',    full: 'Médiocre',    bg: '#fed7aa', color: '#9a3412' },
  { id: 'MA', label: 'MA · Mauvais',    full: 'Mauvais',     bg: '#fee2e2', color: '#991b1b' },
]

const rawStudents = [
  { id: 1, name: 'KABONGO Mujinga Grace',   code: '2041 3378 5', total: 145, rank: 1,  conduct: 'E',  appreciation: 'Travail sérieux, bonne participation.' },
  { id: 2, name: 'BAHATI Neema Esther',     code: '2041 3247 8', total: 138, rank: 2,  conduct: 'TB', appreciation: '' },
  { id: 3, name: 'MBUYI Ngalula Ruth',      code: '2041 3355 0', total: 134, rank: 3,  conduct: 'B',  appreciation: '' },
  { id: 4, name: 'AMISI Bahati Joseph',     code: '2041 3241 1', total: 131, rank: 4,  conduct: '',   appreciation: '' },
  { id: 5, name: 'NGALULA Mbombo Sophie',   code: '2041 3360 3', total: 128, rank: 5,  conduct: 'B',  appreciation: 'Arrivée en P2, bonne intégration.' },
  { id: 6, name: 'TSHIMANGA Patrick Luc',   code: '2041 3389 2', total: 122, rank: 6,  conduct: '',   appreciation: '' },
  { id: 7, name: 'MUKENDI Willy Jean',      code: '2041 3312 4', total: 118, rank: 7,  conduct: 'AB', appreciation: '' },
  { id: 8, name: 'KASONGO Bintou Marie',    code: '2041 3298 7', total: 114, rank: 8,  conduct: '',   appreciation: '' },
  { id: 9, name: 'LUKUSA Mbaya Patrick',    code: '2041 3402 9', total: 103, rank: 9,  conduct: 'AB', appreciation: 'Présences irrégulières.' },
  { id: 10, name: 'WEMBI Okito Christelle', code: '2041 3418 2', total: 95,  rank: 10, conduct: 'M',  appreciation: 'Difficultés en maths et sciences.' },
  { id: 11, name: 'LOFOMBO Alain Bernard',  code: '2041 3425 6', total: 88,  rank: 11, conduct: '',   appreciation: '' },
  { id: 12, name: 'MWAMBA Kalala Denis',    code: '2041 3431 0', total: 80,  rank: 12, conduct: 'MA', appreciation: 'Absences répétées. À convoquer.' },
]

const rows = reactive(rawStudents.map(s => ({
  ...s,
  pct: Math.round(s.total / totalMax * 100 * 10) / 10,
})))

function initials(name: string): string {
  const parts = name.split(' ')
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

const conductFilledCount = computed(() => rows.filter(r => r.conduct).length)
const missingConductCount = computed(() => rows.filter(r => !r.conduct).length)
const allConductFilled = computed(() => missingConductCount.value === 0)
const failCount = computed(() => rows.filter(r => r.pct < 50).length)
const avgPct = computed(() => {
  const sum = rows.reduce((a, r) => a + r.pct, 0)
  return Math.round(sum / rows.length * 10) / 10
})

const showSubmitModal = ref(false)
const submitted = ref(false)

function submitToPreft() {
  showSubmitModal.value = false
  submitted.value = true
}
</script>

<style scoped>
.page { padding: 24px 32px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--k-blue);
  font-size: 13px;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 6px;
}

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--k-orange);
  margin: 0 0 4px;
}

h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0;
}

.header-actions { display: flex; gap: 8px; align-items: center; padding-top: 28px; }

.btn-hint {
  font-size: 11px;
  font-weight: 400;
  opacity: 0.75;
}

/* Summary bar */
.summary-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 10px;
  padding: 14px 20px;
  margin-bottom: 16px;
}

.summary-stat { display: flex; flex-direction: column; gap: 2px; }
.summary-stat__value { font-size: 18px; font-weight: 700; color: var(--k-navy); }
.summary-stat__label { font-size: 11px; color: #9ca3af; }

.summary-divider { width: 1px; height: 32px; background: rgba(0,0,0,0.08); }

.text-green  { color: #15803d; }
.text-orange { color: var(--k-orange); }
.text-red    { color: #dc2626; }

/* Table */
.table-wrap {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.review-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.review-table thead th {
  padding: 10px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.04em;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  white-space: nowrap;
}

.review-table thead th small { font-weight: 400; font-size: 10px; }

.review-row td { padding: 10px 14px; border-bottom: 1px solid rgba(0,0,0,0.05); vertical-align: middle; }
.review-row:last-child td { border-bottom: none; }
.review-row--fail { background: #fff5f5; }

.col-student    { min-width: 200px; }
.col-total      { width: 80px; text-align: right; }
.col-pct        { width: 60px; text-align: right; }
.col-rank       { width: 50px; text-align: center; color: #6b7280; }
.col-conduct    { width: 160px; }
.col-appreciation { min-width: 200px; }

.student-cell { display: flex; align-items: center; gap: 10px; }

.avatar-xs {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--k-sky);
  color: var(--k-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.student-name { font-weight: 600; color: #1a1a2e; margin: 0 0 1px; font-size: 13px; }
.student-code { font-size: 11px; color: #9ca3af; margin: 0; font-family: 'IBM Plex Mono', monospace; }

.total-val { font-weight: 700; font-size: 14px; color: var(--k-navy); }

.conduct-select {
  padding: 6px 10px;
  border: 1.5px solid #d1d5db;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a2e;
  background: #fff;
  outline: none;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
}

.conduct-select:focus { border-color: var(--k-blue); }
.conduct-select--empty { border-color: #f59e0b; background: #fffbeb; }

.appreciation-input {
  width: 100%;
  padding: 7px 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  font-size: 12px;
  color: #374151;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.appreciation-input:focus { border-color: var(--k-blue); }
.appreciation-input::placeholder { color: #d1d5db; }

/* Legend */
.conduct-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.legend-label { font-size: 12px; color: #6b7280; font-weight: 600; }

.legend-chip {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 14px;
  padding: 28px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.modal-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0 0 10px;
}

.modal-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  margin: 0 0 18px;
}

.modal-checks { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }

.modal-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #15803d;
  font-weight: 500;
}

.modal-check--warn { color: #d97706; }

.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

/* Submitted banner */
.submitted-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #dcfce7;
  color: #15803d;
  font-size: 13px;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 10px;
}
</style>

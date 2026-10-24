<template>
  <div class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">NOTES · P2 2026-2027 · CLÔTURE 22 JANV.</p>
        <h2>Carnet de notes</h2>
      </div>
      <div class="header-actions">
        <RouterLink to="/app/grades/corrections" class="btn btn-outline">
          Corrections
          <span v-if="gradesStore.pendingCorrections > 0" class="badge-count">{{ gradesStore.pendingCorrections }}</span>
        </RouterLink>
        <RouterLink to="/app/bulletins" class="btn btn-outline">Bulletins</RouterLink>
        <button class="btn btn-navy">⬇ Exporter Excel</button>
      </div>
    </div>

    <!-- Class selector row -->
    <div class="toolbar">
      <div class="selector-group">
        <select class="input-select">
          <option>P2 · nov. – janv. 2027</option>
        </select>
        <select class="input-select">
          <option>{{ gradesStore.currentClass.name }}</option>
        </select>
      </div>
      <div class="search-wrap">
        <input class="input-search" placeholder="Rechercher un élève…" v-model="searchQ" />
      </div>
    </div>

    <!-- Grade sheet table -->
    <div class="table-scroll">
      <table class="grade-table">
        <thead>
          <tr class="header-courses">
            <th class="col-student">Élève</th>
            <th v-for="col in columns" :key="col.key" class="col-course">{{ col.name }}</th>
            <th class="col-other">Autres</th>
            <th class="col-total">Total<br><small>/ {{ totalMax }}</small></th>
            <th class="col-pct">%</th>
            <th class="col-rank">Rang</th>
          </tr>
          <tr class="header-max">
            <td class="col-student max-label">Max.</td>
            <td v-for="col in columns" :key="col.key" class="max-cell">{{ col.maxP }}</td>
            <td class="max-cell">{{ othersMax }}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredRows" :key="row.studentId" class="grade-row">
            <td class="col-student">
              <div class="student-cell">
                <span class="avatar-xs">{{ initials(row.studentName) }}</span>
                <span>{{ row.studentName }}</span>
                <span v-if="row.isProvisional" class="badge-new">P</span>
              </div>
            </td>
            <td v-for="col in columns" :key="col.key" class="grade-cell" :class="gradeClass((row as any)[col.key], col.maxP)">
              {{ (row as any)[col.key] ?? '—' }}
            </td>
            <td class="grade-cell">{{ row.autres }}</td>
            <td class="col-total"><strong>{{ row.total ?? '—' }}</strong></td>
            <td class="col-pct" :class="row.percent !== undefined ? pctClass(row.percent) : ''">{{ row.percent !== undefined ? row.percent + '%' : '—' }}</td>
            <td class="col-rank">{{ row.rank ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="info-box">
      <span class="info-icon">ℹ</span>
      <span>Les notes en <span class="text-red">rouge</span> sont inférieures à 50 % du maximum. Cliquez sur une note pour proposer une correction.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGradesStore } from '@/stores'

const gradesStore = useGradesStore()
const searchQ = ref('')

const columns = [
  { key: 'math', name: 'Math', maxP: 40 },
  { key: 'phys', name: 'Phys', maxP: 30 },
  { key: 'chim', name: 'Chim', maxP: 20 },
  { key: 'bio', name: 'Bio', maxP: 20 },
  { key: 'fr', name: 'Fr', maxP: 20 },
  { key: 'angl', name: 'Angl', maxP: 20 },
]
const othersMax = 50
const totalMax = columns.reduce((s, c) => s + c.maxP, 0) + othersMax

const filteredRows = computed(() => {
  const q = searchQ.value.toLowerCase()
  if (!q) return gradesStore.gradeSheet
  return gradesStore.gradeSheet.filter(r => r.studentName.toLowerCase().includes(q))
})

function initials(name: string) {
  const parts = name.split(' ')
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

function gradeClass(val: number | undefined, max: number) {
  if (val === undefined) return 'grade-empty'
  if (val < max * 0.5) return 'grade-fail'
  if (val < max * 0.7) return 'grade-ok'
  return 'grade-good'
}

function pctClass(pct: number) {
  if (pct < 50) return 'pct-fail'
  if (pct < 70) return 'pct-ok'
  return 'pct-good'
}
</script>

<style scoped>
.page { padding: 32px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
h2 { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; color: var(--k-navy); margin: 0; }
.header-actions { display: flex; gap: 8px; }

.toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.selector-group { display: flex; gap: 10px; }
.input-select { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 32px 8px 12px; font-size: 13.5px; font-family: inherit; color: var(--k-text); background: #fff; }
.input-search { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; font-size: 13px; font-family: inherit; width: 220px; }
.input-search:focus, .input-select:focus { outline: none; border-color: var(--k-blue); }

.table-scroll { overflow-x: auto; }
.grade-table { width: 100%; border-collapse: collapse; font-size: 12.5px; background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); }

.header-courses th { padding: 10px 6px; text-align: center; background: var(--k-navy); color: #fff; font-size: 11px; font-weight: 600; white-space: nowrap; }
.col-student { text-align: left !important; padding-left: 14px !important; min-width: 180px; }
.col-course { border-left: 1px solid rgba(255,255,255,.15); min-width: 60px; }
.col-other { border-left: 1px solid rgba(255,255,255,.15); min-width: 60px; }
.col-total { min-width: 70px; }
.col-pct { min-width: 50px; }
.col-rank { min-width: 50px; }

.header-max td { background: #f8fafc; font-size: 11px; color: var(--k-text-muted); padding: 4px 8px; text-align: center; border-bottom: 2px solid var(--k-border); }
.max-label { font-weight: 600; color: var(--k-text-muted); text-align: left; padding-left: 14px; }
.max-cell { font-weight: 500; }

.grade-row td { border-bottom: 1px solid var(--k-border); }
.grade-row:hover { background: #f9fafb; }
.student-cell { display: flex; align-items: center; gap: 8px; padding: 8px 0; }
.avatar-xs { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: var(--k-sky); color: var(--k-navy); font-size: 10px; font-weight: 700; flex-shrink: 0; }
.badge-new { background: var(--k-yellow); color: #1a1a2e; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 4px; }

.grade-cell { text-align: center; padding: 8px 4px; font-size: 13px; font-weight: 500; }
.grade-empty { color: #9ca3af; }
.grade-fail { background: #fee2e2; color: #991b1b; font-weight: 600; }
.grade-ok { background: #fef9c3; color: #713f12; }
.grade-good { background: #dcfce7; color: #166534; }

.col-total { text-align: center; padding: 8px; background: #f8fafc; }
.col-pct { text-align: center; padding: 8px; font-weight: 600; }
.col-rank { text-align: center; padding: 8px; color: var(--k-text-muted); font-size: 12px; }
.pct-fail { color: #dc2626; }
.pct-ok { color: #d97706; }
.pct-good { color: #16a34a; }

.info-box { display: flex; gap: 12px; border-radius: 8px; padding: 14px 16px; margin-top: 16px; font-size: 13px; background: var(--k-sky); color: var(--k-navy); }
.info-icon { font-size: 16px; flex-shrink: 0; }
.text-red { color: #dc2626; font-weight: 600; }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent; font-family: inherit; text-decoration: none; }
.btn-navy { background: var(--k-navy); color: #fff; border-color: var(--k-navy); }
.btn-outline { background: #fff; color: var(--k-navy); border-color: #d1d5db; }
.badge-count { background: var(--k-yellow); color: #1a1a2e; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
</style>

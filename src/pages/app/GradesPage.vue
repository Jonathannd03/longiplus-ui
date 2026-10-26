<template>
  <div class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">NOTES · {{ activeYear?.label }}</p>
        <h2>Carnet de notes</h2>
      </div>
      <div class="header-actions">
        <RouterLink to="/app/grades/corrections" class="btn btn-outline">
          Corrections
          <span v-if="pendingCount > 0" class="badge-count">{{ pendingCount }}</span>
        </RouterLink>
      </div>
    </div>

    <div v-if="loading" class="state-msg">Chargement…</div>
    <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>

    <template v-else>
      <!-- No periods configured -->
      <div v-if="!periods.length" class="empty-state">
        <div class="empty-state__icon">📅</div>
        <p class="empty-state__title">Aucune période configurée</p>
        <p class="empty-state__sub">Créez d'abord l'année scolaire avec ses périodes.</p>
        <RouterLink to="/app/settings/year" class="btn btn-outline">Configurer l'année</RouterLink>
      </div>

      <!-- No sections configured -->
      <div v-else-if="!sections.length" class="empty-state">
        <div class="empty-state__icon">🏫</div>
        <p class="empty-state__title">Aucune classe configurée</p>
        <p class="empty-state__sub">Ajoutez des classes dans la section Classes et cours.</p>
        <RouterLink to="/app/classes" class="btn btn-outline">Gérer les classes</RouterLink>
      </div>

      <template v-else>
        <div class="toolbar">
          <div class="selector-group">
            <select class="input-select" v-model="selectedPeriodId" @change="loadResults">
              <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.label }}</option>
            </select>
            <select class="input-select" v-model="selectedSectionId" @change="loadResults">
              <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="search-wrap">
            <input class="input-search" placeholder="Rechercher un élève…" v-model="searchQ" />
          </div>
        </div>

        <div v-if="resultsLoading" class="state-msg">Calcul des rangs…</div>
        <div v-else-if="resultsError" class="state-msg state-msg--error">{{ resultsError }}</div>

        <div v-else-if="results && results.rows.length === 0" class="empty-state">
          <div class="empty-state__icon">📋</div>
          <p class="empty-state__title">Aucune note enregistrée</p>
          <p class="empty-state__sub">Les notes pour cette période et cette classe n'ont pas encore été saisies.</p>
        </div>

      <div class="table-scroll" v-else-if="results">
        <table class="grade-table">
          <thead>
            <tr class="header-courses">
              <th class="col-student">Élève</th>
              <th v-for="sub in results.subjects" :key="sub.id" class="col-course">{{ sub.name }}</th>
              <th class="col-total">Total<br><small>/ {{ results.totalMax }}</small></th>
              <th class="col-pct">%</th>
              <th class="col-rank">Rang</th>
            </tr>
            <tr class="header-max">
              <td class="col-student max-label">Max.</td>
              <td v-for="sub in results.subjects" :key="sub.id" class="max-cell">
                {{ results.period.kind === 'exam' ? (sub.maxExam ?? sub.maxPeriod) : sub.maxPeriod }}
              </td>
              <td></td><td></td><td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredRows" :key="row.student.id" class="grade-row">
              <td class="col-student">
                <div class="student-cell">
                  <span class="avatar-xs">{{ initials(row.student) }}</span>
                  <span>{{ row.student.lastName }} {{ row.student.firstName }}</span>
                </div>
              </td>
              <td
                v-for="sc in row.subjectScores"
                :key="sc.subjectId"
                class="grade-cell"
                :class="sc.score === null ? 'grade-empty' : gradeClass(sc.score, sc.max)"
              >{{ sc.score ?? '—' }}</td>
              <td class="col-total"><strong>{{ row.total }}</strong></td>
              <td class="col-pct" :class="pctClass(row.pct)">{{ row.pct }}%</td>
              <td class="col-rank">{{ row.rank ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="info-box" v-if="results">
        <span class="info-icon">ℹ</span>
        <span>Les notes en <span class="text-red">rouge</span> sont inférieures à 50 % du maximum.</span>
      </div>
      </template><!-- end v-else (periods && sections exist) -->
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSetupApi } from '@/api/setup'
import type { AcademicYear, Period, ClassSection, PeriodResults } from '@/api/setup'

const api = useSetupApi()

const loading = ref(true)
const resultsLoading = ref(false)
const error = ref('')
const resultsError = ref('')
const searchQ = ref('')

const activeYear = ref<AcademicYear | null>(null)
const periods = ref<Period[]>([])
const sections = ref<ClassSection[]>([])
const selectedPeriodId = ref('')
const selectedSectionId = ref('')
const results = ref<PeriodResults | null>(null)
const pendingCount = ref(0)

onMounted(async () => {
  try {
    const years = await api.academicYears.list()
    const year = years.find(y => y.status === 'active') ?? years[0]
    if (!year) { loading.value = false; return }
    activeYear.value = year

    const [ps, ss, corrections] = await Promise.all([
      api.academicYears.periods(year.id),
      api.classSections.list(year.id),
      api.corrections.list({ status: 'pending' }).catch(() => []),
    ])

    periods.value = ps
    sections.value = ss
    pendingCount.value = corrections.length

    const openPeriod = ps.find(p => p.status === 'open') ?? ps[0]
    if (openPeriod) selectedPeriodId.value = openPeriod.id
    if (ss[0]) selectedSectionId.value = ss[0].id

    if (selectedPeriodId.value && selectedSectionId.value) await loadResults()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur'
  } finally {
    loading.value = false
  }
})

async function loadResults() {
  if (!selectedPeriodId.value || !selectedSectionId.value) return
  resultsLoading.value = true
  resultsError.value = ''
  try {
    results.value = await api.marks.results(selectedSectionId.value, selectedPeriodId.value)
  } catch (e) {
    results.value = null
    resultsError.value = e instanceof Error ? e.message : 'Impossible de charger les notes.'
  } finally {
    resultsLoading.value = false
  }
}

const filteredRows = computed(() => {
  if (!results.value) return []
  const q = searchQ.value.toLowerCase()
  if (!q) return results.value.rows
  return results.value.rows.filter(r =>
    `${r.student.lastName} ${r.student.firstName}`.toLowerCase().includes(q)
  )
})

function initials(student: { lastName: string; firstName: string }) {
  return ((student.lastName[0] ?? '') + (student.firstName[0] ?? '')).toUpperCase()
}

function gradeClass(val: number, max: number) {
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

.state-msg { padding: 60px; text-align: center; color: #6b7280; font-size: 14px; }
.state-msg--error { color: #ef4444; }

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

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 24px; gap: 10px; }
.empty-state__icon { font-size: 36px; line-height: 1; }
.empty-state__title { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: var(--k-navy); margin: 0; }
.empty-state__sub { font-size: 13px; color: #6b7280; margin: 0; text-align: center; max-width: 320px; }

.info-box { display: flex; gap: 12px; border-radius: 8px; padding: 14px 16px; margin-top: 16px; font-size: 13px; background: var(--k-sky); color: var(--k-navy); }
.info-icon { font-size: 16px; flex-shrink: 0; }
.text-red { color: #dc2626; font-weight: 600; }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent; font-family: inherit; text-decoration: none; }
.btn-navy { background: var(--k-navy); color: #fff; border-color: var(--k-navy); }
.btn-outline { background: #fff; color: var(--k-navy); border-color: #d1d5db; }
.badge-count { background: var(--k-yellow); color: #1a1a2e; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
</style>

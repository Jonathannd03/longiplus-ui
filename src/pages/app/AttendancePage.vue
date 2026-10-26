<template>
  <div class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">PRÉSENCES · {{ todayLabel }}</p>
        <h2>Présences quotidiennes</h2>
      </div>
    </div>

    <div v-if="loading" class="state-msg">Chargement…</div>
    <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>

    <template v-else>
      <div class="stats-row">
        <div class="stat-card">
          <p class="stat-label">Présents</p>
          <p class="stat-value">{{ totals.present }}</p>
          <p class="stat-sub">/ {{ totals.total }} élèves inscrits</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Absents</p>
          <p class="stat-value stat-value--red">{{ totals.absent }}</p>
          <p class="stat-sub">dont {{ totals.late }} en retard</p>
        </div>
        <div class="stat-card stat-card--alert" :class="{ 'stat-card--ok': classesWithoutRoll === 0 }">
          <p class="stat-label">Classes sans appel</p>
          <p class="stat-value" :class="classesWithoutRoll > 0 ? 'stat-value--red' : 'stat-value--green'">
            {{ classesWithoutRoll }}
          </p>
          <p class="stat-sub">{{ classesWithoutRoll === 0 ? 'Tous les appels sont faits' : `sur ${rows.length} classes` }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Taux de présence</p>
          <p class="stat-value">{{ presenceRate }}%</p>
          <p class="stat-sub">classes avec appel</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>État de l'appel par classe · {{ todayLabel }}</h3>
          <div class="search-wrap">
            <input class="input-search" placeholder="Filtrer une classe…" v-model="searchQ" />
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Classe</th>
              <th class="col-center">Appel</th>
              <th class="col-center">Présents</th>
              <th class="col-center">Absents</th>
              <th class="col-center">Retards</th>
              <th class="col-center">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filteredRows" :key="r.classSectionId">
              <td>
                <div class="class-cell">
                  <span class="class-level">{{ r.level }}</span>
                  <span class="class-name">{{ r.name }}</span>
                </div>
              </td>
              <td class="col-center">
                <span :class="['roll-badge', r.rollDone ? 'roll-badge--done' : 'roll-badge--missing']">
                  {{ r.rollDone ? 'Fait' : 'Manquant' }}
                </span>
              </td>
              <td class="col-center num">{{ r.rollDone ? r.present : '—' }}</td>
              <td class="col-center num" :class="r.rollDone && r.absent > 0 ? 'num--red' : ''">{{ r.rollDone ? r.absent : '—' }}</td>
              <td class="col-center num">{{ r.rollDone ? r.late : '—' }}</td>
              <td class="col-center num">{{ r.total }}</td>
            </tr>
          </tbody>
        </table>

        <p v-if="filteredRows.length === 0" class="empty-msg">Aucune classe trouvée</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSetupApi } from '@/api/setup'
import type { DailyStatusRow } from '@/api/setup'

const api = useSetupApi()

const loading = ref(true)
const error = ref('')
const searchQ = ref('')
const rows = ref<DailyStatusRow[]>([])

const todayLabel = new Date().toLocaleDateString('fr-CD', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()

onMounted(async () => {
  try {
    const years = await api.academicYears.list()
    const year = years.find(y => y.status === 'active') ?? years[0]
    if (!year) { loading.value = false; return }
    rows.value = await api.attendance.dailyStatus(year.id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur de chargement'
  } finally {
    loading.value = false
  }
})

const doneRows = computed(() => rows.value.filter(r => r.rollDone))

const totals = computed(() => ({
  present: doneRows.value.reduce((s, r) => s + r.present, 0),
  absent: doneRows.value.reduce((s, r) => s + r.absent, 0),
  late: doneRows.value.reduce((s, r) => s + r.late, 0),
  total: rows.value.reduce((s, r) => s + r.total, 0),
}))

const classesWithoutRoll = computed(() => rows.value.filter(r => !r.rollDone).length)

const presenceRate = computed(() => {
  const t = doneRows.value.reduce((s, r) => s + r.total, 0)
  if (!t) return '—'
  const p = doneRows.value.reduce((s, r) => s + r.present, 0)
  return Math.round((p / t) * 100)
})

const filteredRows = computed(() => {
  const q = searchQ.value.toLowerCase()
  if (!q) return rows.value
  return rows.value.filter(r => r.name.toLowerCase().includes(q) || r.level.toLowerCase().includes(q))
})
</script>

<style scoped>
.page { padding: 32px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
h2 { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; color: var(--k-navy); margin: 0; }

.state-msg { padding: 60px; text-align: center; color: #6b7280; font-size: 14px; }
.state-msg--error { color: #ef4444; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; }
.stat-card--alert { border-color: #fca5a5; background: #fff5f5; }
.stat-card--ok { border-color: #86efac; background: #f0fdf4; }
.stat-label { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--k-text-muted); margin: 0 0 8px; }
.stat-value { font-family: 'Poppins', sans-serif; font-size: 32px; font-weight: 700; color: var(--k-navy); margin: 0 0 4px; line-height: 1.1; }
.stat-value--red { color: #dc2626; }
.stat-value--green { color: #16a34a; }
.stat-sub { font-size: 12px; color: var(--k-text-muted); margin: 0; }

.card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
h3 { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0; }

.input-search { border: 1px solid #d1d5db; border-radius: 8px; padding: 7px 12px; font-size: 13px; font-family: inherit; width: 220px; }
.input-search:focus { outline: none; border-color: var(--k-blue); }

.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.data-table th { text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 600; color: var(--k-text-muted); border-bottom: 1px solid var(--k-border); text-transform: uppercase; letter-spacing: .04em; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid var(--k-border); color: var(--k-text); }
.data-table tr:last-child td { border-bottom: none; }
.col-center { text-align: center !important; }

.class-cell { display: flex; flex-direction: column; gap: 2px; }
.class-level { font-size: 11px; color: var(--k-text-muted); }
.class-name { font-weight: 600; font-size: 13.5px; }

.roll-badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.roll-badge--done { background: #dcfce7; color: #166534; }
.roll-badge--missing { background: #fee2e2; color: #991b1b; }

.num { font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
.num--red { color: #dc2626; font-weight: 600; }

.empty-msg { text-align: center; padding: 24px; color: #9ca3af; font-size: 14px; }
</style>

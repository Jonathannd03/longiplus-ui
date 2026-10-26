<template>
  <div class="page">
    <div class="page-content">
      <p class="eyebrow">{{ yearLabel }}<template v-if="activePeriod"> · {{ activePeriod.label.toUpperCase() }} EN COURS</template></p>
      <h2 class="page-title">Rapports et exports</h2>

      <div v-if="loading" class="loading-hint">Chargement…</div>

      <div v-else class="report-grid">
        <div v-for="report in reports" :key="report.id" class="report-card">
          <div class="report-card__icon" :style="{ background: report.iconBg }">
            <span v-html="report.icon"></span>
          </div>
          <div class="report-card__body">
            <p class="report-card__title">{{ report.title }}</p>
            <p class="report-card__desc">{{ report.desc }}</p>
          </div>
          <div class="report-card__actions">
            <span v-if="!report.available" class="coming-soon">Bientôt disponible</span>
            <button
              v-else
              class="btn btn--outline"
              :disabled="downloading === report.id"
              @click="download(report)"
            >
              {{ downloading === report.id ? '…' : '↓ Exporter CSV' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="downloadError" class="error-banner">{{ downloadError }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSetupApi } from '@/api/setup'
import type { AcademicYear, Period } from '@/api/setup'

const authStore = useAuthStore()
const api = useSetupApi()

const loading = ref(true)
const downloading = ref<string | null>(null)
const downloadError = ref('')
const activeYear = ref<AcademicYear | null>(null)
const activePeriod = ref<Period | null>(null)

const API_BASE = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/v1'

const yearLabel = computed(() =>
  activeYear.value ? `ANNÉE ${activeYear.value.label}` : 'RAPPORTS'
)

const iconList = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`
const iconCalendar = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
const iconFile = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
const iconTrophy = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M7 4H4a2 2 0 0 0-2 2v1a6 6 0 0 0 6 6h8a6 6 0 0 0 6-6V6a2 2 0 0 0-2-2h-3"/><rect x="7" y="2" width="10" height="5" rx="1"/></svg>`
const iconBook = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`

type Report = {
  id: string
  title: string
  desc: string
  icon: string
  iconBg: string
  available: boolean
  getPath: () => string | null
  filename: string
}

const reports = computed<Report[]>(() => [
  {
    id: 'students',
    title: 'Liste des élèves inscrits',
    desc: 'Tous les élèves actifs : nom, classe, date de naissance, tuteur',
    icon: iconList,
    iconBg: '#e8f1fc',
    available: !!activeYear.value,
    getPath: () => activeYear.value ? api.reports.studentsCSV(activeYear.value.id) : null,
    filename: 'eleves.csv',
  },
  {
    id: 'attendance',
    title: 'Rapport de présence',
    desc: 'Registre journalier des présences par classe',
    icon: iconCalendar,
    iconBg: '#fff7ed',
    available: !!activeYear.value,
    getPath: () => activeYear.value ? api.reports.attendanceCSV(activeYear.value.id) : null,
    filename: 'presences.csv',
  },
  {
    id: 'marks',
    title: 'Export des notes',
    desc: `Notes de la ${activePeriod.value?.label ?? 'période en cours'} par élève et par matière`,
    icon: iconFile,
    iconBg: '#fef3c7',
    available: !!activePeriod.value,
    getPath: () => activePeriod.value ? api.reports.marksCSV(activePeriod.value.id) : null,
    filename: 'notes.csv',
  },
  {
    id: 'palmares',
    title: 'Palmarès',
    desc: 'Classement par classe, distinctions de fin d\'année',
    icon: iconTrophy,
    iconBg: '#ede9fe',
    available: false,
    getPath: () => null,
    filename: 'palmares.csv',
  },
  {
    id: 'journal',
    title: 'Journal de l\'école',
    desc: 'Historique des actions : inscriptions, notes, SMS',
    icon: iconBook,
    iconBg: '#fce7f3',
    available: false,
    getPath: () => null,
    filename: 'journal.csv',
  },
])

async function download(report: Report) {
  const path = report.getPath()
  if (!path) return
  downloading.value = report.id
  downloadError.value = ''
  try {
    const headers: Record<string, string> = {}
    if (authStore.token) headers['Authorization'] = `Bearer ${authStore.token}`
    if (authStore.schoolId) headers['X-School-Id'] = authStore.schoolId
    const res = await fetch(`${API_BASE}${path}`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = report.filename
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    downloadError.value = 'Erreur lors du téléchargement. Veuillez réessayer.'
    console.error(err)
  } finally {
    downloading.value = null
  }
}

onMounted(async () => {
  try {
    const years = await api.academicYears.list()
    const active = years.find(y => y.status === 'active') ?? years[0] ?? null
    activeYear.value = active
    if (active) {
      const detail = await api.academicYears.get(active.id)
      activePeriod.value = detail.periods.find(p => p.status === 'open') ?? detail.periods[detail.periods.length - 1] ?? null
    }
  } catch (err) {
    console.error('ReportsPage load error', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page { padding: 32px 36px; }
.page-content { max-width: 1200px; }
.eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 700; color: var(--k-navy); margin: 0 0 28px; }
.loading-hint { color: #9ca3af; font-size: 14px; padding: 8px 0 24px; }
.error-banner { background: #fee2e2; color: #991b1b; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-top: 16px; }

.report-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

.report-card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.report-card__icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--k-navy); flex-shrink: 0; }
.report-card__body { flex: 1; }
.report-card__title { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; color: var(--k-navy); margin: 0 0 4px; }
.report-card__desc { font-size: 12px; color: var(--k-text-muted); margin: 0; line-height: 1.4; }
.report-card__actions { display: flex; align-items: center; gap: 8px; }

.coming-soon { font-size: 11px; font-weight: 600; color: #9ca3af; background: #f3f4f6; padding: 4px 10px; border-radius: 20px; }

.btn { padding: 7px 14px; border-radius: 7px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: none; white-space: nowrap; }
.btn--outline { background: #fff; border: 1.5px solid var(--k-border); color: var(--k-navy); }
.btn--outline:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

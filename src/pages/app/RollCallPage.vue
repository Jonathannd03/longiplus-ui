<template>
  <div class="roll-call">
    <div class="page-header">
      <RouterLink to="/app/teacher/day" class="breadcrumb-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Mes cours
      </RouterLink>
    </div>

    <div v-if="loading" class="state-msg">Chargement…</div>
    <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>
    <template v-else>

      <div class="page-meta">
        <div>
          <p class="eyebrow">APPEL · {{ timeLabel }}</p>
          <h1 class="page-title">{{ sectionName }}</h1>
        </div>
        <button class="btn btn--ghost btn--sm" @click="markAllPresent">Tout P</button>
      </div>

      <div class="stats-bar">
        <span class="stat-chip stat-chip--green">{{ presentCount }} présents</span>
        <span class="stat-chip stat-chip--red">{{ absentCount }} absents</span>
        <span class="stat-chip stat-chip--yellow">{{ lateCount }} retards</span>
      </div>

      <p class="hint">Tous présents par défaut. Touchez A ou R.</p>

      <div class="students-list">
        <div v-for="s in students" :key="s.id" class="student-row">
          <div class="student-initials">{{ s.lastName[0] }}{{ s.firstName[0] }}</div>
          <div class="student-info">
            <p class="student-name">{{ s.lastName }} {{ s.postName }} {{ s.firstName }}</p>
          </div>
          <div class="toggle-group">
            <button
              v-for="opt in (['P', 'A', 'R'] as const)"
              :key="opt"
              class="toggle-btn"
              :class="`toggle-btn--${opt.toLowerCase()} ${status[s.id] === opt ? 'toggle-btn--active' : ''}`"
              @click="status[s.id] = opt"
            >{{ opt }}</button>
          </div>
        </div>
      </div>

      <div v-if="submitted" class="success-msg">
        Appel validé et enregistré.
      </div>

      <div class="submit-section">
        <p class="submit-hint">Sauvegardé en ligne.</p>
        <button class="btn btn--navy submit-btn" :disabled="submitting || submitted" @click="validate">
          {{ submitting ? 'Envoi…' : submitted ? 'Appel validé' : `Valider l'appel · ${students.length} élèves` }}
        </button>
        <p class="submit-sub">Les parents des {{ absentCount }} absents reçoivent un SMS.</p>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSetupApi } from '@/api/setup'
import type { StudentListItem } from '@/api/setup'

const route = useRoute()
const api = useSetupApi()

const loading = ref(true)
const error = ref('')
const students = ref<StudentListItem[]>([])
const sectionName = ref('Appel')
const classSectionId = route.params['id'] as string

const status = ref<Record<string, 'P' | 'A' | 'R'>>({})
const submitting = ref(false)
const submitted = ref(false)

const today = new Date().toISOString().slice(0, 10)
const timeLabel = new Date().toLocaleTimeString('fr-CD', { hour: '2-digit', minute: '2-digit' })

onMounted(async () => {
  try {
    const years = await api.academicYears.list()
    const year = years.find(y => y.status === 'active') ?? years[0]
    if (!year) { error.value = 'Aucune année scolaire active'; return }

    const [studs, sections, sheet] = await Promise.all([
      api.students.list({ classSectionId, yearId: year.id }),
      api.classSections.list(year.id),
      api.attendance.sheet(classSectionId, today).catch(() => [] as Awaited<ReturnType<typeof api.attendance.sheet>>),
    ])

    students.value = studs
    const sec = sections.find(s => s.id === classSectionId)
    if (sec) sectionName.value = sec.name

    // Initialize all present, then apply any existing sheet
    const init: Record<string, 'P' | 'A' | 'R'> = {}
    for (const s of studs) init[s.id] = 'P'
    for (const row of sheet) {
      if (row.status === 'present') init[row.studentId] = 'P'
      else if (row.status === 'absent') init[row.studentId] = 'A'
      else if (row.status === 'late') init[row.studentId] = 'R'
    }
    status.value = init
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur de chargement'
  } finally {
    loading.value = false
  }
})

const presentCount = computed(() => Object.values(status.value).filter(v => v === 'P').length)
const absentCount  = computed(() => Object.values(status.value).filter(v => v === 'A').length)
const lateCount    = computed(() => Object.values(status.value).filter(v => v === 'R').length)

function markAllPresent() {
  for (const id of students.value.map(s => s.id)) status.value[id] = 'P'
}

async function validate() {
  if (submitting.value || submitted.value) return
  submitting.value = true
  try {
    const statusMap: Record<string, 'present' | 'absent' | 'late'> = { P: 'present', A: 'absent', R: 'late' }
    const records = students.value.map(s => ({
      studentId: s.id,
      status: statusMap[status.value[s.id] ?? 'P']!,
    }))
    await api.attendance.record({ classSectionId, date: today, records })
    submitted.value = true
  } catch {
    // Retry on next tap — don't clear form
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.roll-call {
  padding: 24px 32px;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--k-blue);
  font-size: 13px;
  text-decoration: none;
  font-weight: 500;
}

.state-msg { padding: 60px; text-align: center; color: #6b7280; font-size: 14px; }
.state-msg--error { color: #ef4444; }

.page-meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--k-orange);
  margin: 0 0 6px;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0;
}

.stats-bar { display: flex; gap: 8px; flex-wrap: wrap; }

.stat-chip {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.stat-chip--green  { background: #dcfce7; color: #166534; }
.stat-chip--red    { background: #fee2e2; color: #991b1b; }
.stat-chip--yellow { background: #fef9c3; color: #854d0e; }

.hint { font-size: 13px; color: #6b7280; margin: 0; }

.students-list {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  overflow: hidden;
}

.student-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.student-row:last-child { border-bottom: none; }

.student-initials {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--k-sky);
  color: var(--k-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.student-info { flex: 1; }
.student-name { font-weight: 600; font-size: 13px; color: #1a1a2e; margin: 0; }

.toggle-group { display: flex; gap: 4px; flex-shrink: 0; }

.toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1.5px solid var(--k-border);
  background: #f9fafb;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.1s;
}

.toggle-btn--p.toggle-btn--active { background: #dcfce7; border-color: #86efac; color: #166534; }
.toggle-btn--a.toggle-btn--active { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
.toggle-btn--r.toggle-btn--active { background: #fef9c3; border-color: #fde047; color: #854d0e; }

.success-msg { background: #dcfce7; color: #166534; font-size: 14px; font-weight: 600; padding: 12px 16px; border-radius: 8px; text-align: center; }

.submit-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
}

.submit-hint { font-size: 12px; color: #9ca3af; margin: 0; }
.submit-sub  { font-size: 12px; color: #6b7280; margin: 0; }

.submit-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; }
.btn--navy { background: var(--k-navy); color: #fff; }
.btn--ghost { background: transparent; color: var(--k-text); border: 1px solid #d1d5db; }
.btn--sm { padding: 7px 14px; font-size: 13px; }
</style>

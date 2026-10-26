<template>
  <div class="teacher-day">
    <div class="page-header">
      <p class="eyebrow">{{ dayLabel }} · {{ periodLabel }}</p>
      <h1 class="page-title">Bonjour</h1>
    </div>

    <div v-if="loading" class="state-msg">Chargement…</div>
    <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>
    <template v-else>
      <div v-if="subjects.length === 0" class="state-msg">Aucun cours assigné pour cette période.</div>

      <div class="courses-section" v-if="subjects.length > 0">
        <h2 class="section-title">Mes cours · {{ activePeriod?.label }}</h2>

        <div class="courses-list">
          <div v-for="sub in subjects" :key="sub.id" class="course-card">
            <div class="course-card__body">
              <p class="course-card__name">{{ sub.name }} · {{ sub.sectionName }}</p>
              <p class="course-card__sub">Max {{ sub.maxPeriod }} pts</p>
            </div>
            <div class="course-card__action">
              <RouterLink
                :to="`/app/teacher/subjects/${sub.id}/marks?periodId=${activePeriod?.id}&sectionId=${sub.classSectionId}`"
                class="btn btn--navy btn--sm"
              >
                Saisir les notes
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div class="courses-section" v-if="mySections.length > 0">
        <h2 class="section-title">Appel</h2>
        <div class="courses-list">
          <div v-for="sec in mySections" :key="sec.id" class="course-card">
            <div class="course-card__body">
              <p class="course-card__name">{{ sec.name }}</p>
            </div>
            <div class="course-card__action">
              <RouterLink :to="`/app/teacher/roll-call/${sec.id}`" class="btn btn--ghost btn--sm">
                Faire l'appel
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSetupApi } from '@/api/setup'
import type { Period } from '@/api/setup'

const api = useSetupApi()

const loading = ref(true)
const error = ref('')
const activePeriod = ref<Period | null>(null)
const periodLabel = ref('—')
const dayLabel = new Date().toLocaleDateString('fr-CD', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()

interface SubjectItem { id: string; name: string; maxPeriod: number; classSectionId: string; sectionName: string }
const subjects = ref<SubjectItem[]>([])
interface SectionItem { id: string; name: string }
const mySections = ref<SectionItem[]>([])

onMounted(async () => {
  try {
    const years = await api.academicYears.list()
    const year = years.find(y => y.status === 'active') ?? years[0]
    if (!year) { loading.value = false; return }

    const [sections, periods] = await Promise.all([
      api.classSections.list(year.id),
      api.academicYears.periods(year.id),
    ])

    const openPeriod = periods.find(p => p.status === 'open' && p.kind === 'period')
      ?? periods.find(p => p.status === 'open')
    activePeriod.value = openPeriod ?? null
    periodLabel.value = openPeriod?.label ?? '—'

    // Collect all subjects where I'm the teacher
    const allSubjects: SubjectItem[] = []
    const myClassSections: SectionItem[] = []
    for (const sec of sections) {
      for (const sub of sec.subjects ?? []) {
        allSubjects.push({ id: sub.id, name: sub.name, maxPeriod: sub.maxPeriod, classSectionId: sec.id, sectionName: sec.name })
      }
      myClassSections.push({ id: sec.id, name: sec.name })
    }
    subjects.value = allSubjects
    mySections.value = myClassSections
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.teacher-day {
  padding: 32px;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  font-size: 24px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0 0 4px;
}

.state-msg { padding: 60px; text-align: center; color: #6b7280; font-size: 14px; }
.state-msg--error { color: #ef4444; }

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0 0 14px;
}

.courses-list { display: flex; flex-direction: column; gap: 10px; }

.course-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border: 1.5px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 16px 20px;
}

.course-card__body { flex: 1; }
.course-card__name { font-weight: 600; font-size: 14px; color: #1a1a2e; margin: 0 0 3px; }
.course-card__sub  { font-size: 13px; color: #6b7280; margin: 0; }

.course-card__action { flex-shrink: 0; }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; }
.btn--navy { background: var(--k-navy); color: #fff; }
.btn--ghost { background: transparent; color: var(--k-text); border: 1px solid #d1d5db; }
.btn--sm { padding: 7px 14px; font-size: 13px; }
</style>

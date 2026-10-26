<template>
  <div class="tg-wrap">
    <div class="tg-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="tg-header__text">
        <p class="eyebrow">{{ eyebrow }}</p>
        <div class="tg-title-row">
          <h1 class="tg-title">{{ subjectName }}</h1>
          <span class="max-badge">sur {{ maxScore }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="state-msg">Chargement…</div>
    <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>
    <div v-else-if="periodLocked" class="state-msg state-msg--warn">
      Cette période est verrouillée. Les corrections passent par la direction.
    </div>

    <template v-else>
      <div class="stats-row">
        <div class="stat-box">
          <p class="stat-value">{{ filledCount }}</p>
          <p class="stat-label">saisies</p>
        </div>
        <div class="stat-box stat-box--warn">
          <p class="stat-value stat-value--warn">{{ missingCount }}</p>
          <p class="stat-label">manquantes</p>
        </div>
        <div class="stat-box">
          <p class="stat-value">{{ average }}</p>
          <p class="stat-label">moyenne</p>
        </div>
      </div>

      <div class="student-list">
        <div
          v-for="(s, i) in students"
          :key="s.studentId"
          class="student-row"
          :class="{ 'student-row--error': isOverMax(s.score) }"
        >
          <span class="student-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="student-info">
            <p class="student-name"><strong>{{ s.lastName }}</strong> {{ s.firstName }}</p>
            <p v-if="isOverMax(s.score)" class="over-max-msg">Maximum : {{ maxScore }}</p>
          </div>
          <input
            v-model="s.score"
            type="text"
            inputmode="decimal"
            class="score-input"
            :class="{
              'score-input--error': isOverMax(s.score),
              'score-input--filled': s.score !== ''
            }"
            placeholder="–"
          />
        </div>
      </div>

      <div class="tg-footer">
        <p v-if="savedAt" class="saved-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Enregistré à {{ savedAt }}
        </p>
        <button class="submit-btn" @click="handleSubmit" :disabled="hasErrors || submitting">
          {{ submitting ? 'Envoi…' : `Enregistrer les notes · ${students.length} élèves` }}
          <span v-if="missingCount > 0" class="submit-badge">· {{ missingCount }} manquantes</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSetupApi } from '@/api/setup'

const route = useRoute()
const api = useSetupApi()

const subjectId = route.params['id'] as string
const periodId = route.query['periodId'] as string
const sectionId = route.query['sectionId'] as string

const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const savedAt = ref('')
const periodLocked = ref(false)

const subjectName = ref('Notes')
const eyebrow = ref('—')
const maxScore = ref(10)

interface StudentEntry { studentId: string; lastName: string; firstName: string; score: string }
const students = ref<StudentEntry[]>([])

onMounted(async () => {
  try {
    const [data, enrolled] = await Promise.all([
      api.marks.listBySubject(subjectId, periodId),
      api.students.list({ classSectionId: sectionId }),
    ])

    subjectName.value = data.subject.name
    maxScore.value = data.maxScore
    eyebrow.value = `${data.period.label}`.toUpperCase()
    periodLocked.value = data.period.status === 'locked'

    const markMap = new Map(data.marks.map(m => [m.studentId, m.score]))

    students.value = enrolled.map(s => ({
      studentId: s.id,
      lastName: s.lastName,
      firstName: s.firstName,
      score: markMap.has(s.id) ? (markMap.get(s.id) ?? null)?.toString() ?? '' : '',
    }))
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur de chargement'
  } finally {
    loading.value = false
  }
})

function isOverMax(score: string): boolean {
  if (score === '' || score === null) return false
  const n = parseFloat(score.replace(',', '.'))
  return !isNaN(n) && n > maxScore.value
}

const filledCount = computed(() => students.value.filter(s => s.score !== '').length)
const missingCount = computed(() => students.value.filter(s => s.score === '').length)
const hasErrors = computed(() => students.value.some(s => isOverMax(s.score)))

const average = computed(() => {
  const valid = students.value.filter(s => s.score !== '' && !isOverMax(s.score))
  if (!valid.length) return '–'
  const sum = valid.reduce((acc, s) => acc + parseFloat(s.score.replace(',', '.')), 0)
  return (sum / valid.length).toFixed(1).replace('.', ',')
})

async function handleSubmit() {
  if (hasErrors.value || submitting.value) return
  submitting.value = true
  try {
    const records = students.value.map(s => ({
      studentId: s.studentId,
      score: s.score !== '' ? Math.round(parseFloat(s.score.replace(',', '.')) * 10) / 10 : null,
    }))
    await api.marks.batchSave(subjectId, { periodId, records })
    savedAt.value = new Date().toLocaleTimeString('fr-CD', { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur d\'enregistrement'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.tg-wrap {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 20px 120px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tg-header { display: flex; align-items: flex-start; gap: 12px; }
.back-btn {
  flex-shrink: 0; width: 36px; height: 36px; background: none; border: none;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #1a1a2e; margin-top: 2px; border-radius: 6px;
}
.back-btn:hover { background: #f3f4f6; }
.tg-header__text { flex: 1; }

.eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #F7A21B; margin: 0 0 4px; }
.tg-title-row { display: flex; align-items: baseline; gap: 12px; }
.tg-title { font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; color: #1a1a2e; margin: 0; }
.max-badge { font-size: 13px; font-weight: 600; color: #6b7280; white-space: nowrap; }

.state-msg { padding: 60px; text-align: center; color: #6b7280; font-size: 14px; }
.state-msg--error { color: #ef4444; }
.state-msg--warn { color: #d97706; background: #fffbeb; border-radius: 8px; padding: 16px; }

.stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.stat-box { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 14px 12px; text-align: center; }
.stat-box--warn { background: #fffbeb; border-color: #fde68a; }
.stat-value { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0 0 2px; }
.stat-value--warn { color: #d97706; }
.stat-label { font-size: 11px; color: #6b7280; margin: 0; }

.student-list { display: flex; flex-direction: column; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
.student-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f3f4f6; }
.student-row:last-child { border-bottom: none; }
.student-row--error { background: #fff5f5; }
.student-num { font-size: 12px; color: #9ca3af; font-variant-numeric: tabular-nums; min-width: 20px; }
.student-info { flex: 1; min-width: 0; }
.student-name { font-size: 14px; color: #1a1a2e; margin: 0; }
.over-max-msg { font-size: 11px; color: #dc2626; margin: 2px 0 0; }

.score-input {
  width: 64px; height: 44px; border: 2px solid #e5e7eb; border-radius: 8px;
  font-size: 18px; font-weight: 600; text-align: center; color: #1a1a2e;
  background: #f9fafb; outline: none; flex-shrink: 0; transition: border-color 0.15s;
}
.score-input:focus { border-color: #0160D3; box-shadow: 0 0 0 3px rgba(1,96,211,0.12); background: #fff; }
.score-input--filled { background: #fff; border-color: #d1d5db; }
.score-input--error { border-color: #dc2626; color: #dc2626; background: #fff5f5; }
.score-input::placeholder { color: #9ca3af; font-weight: 400; }

.tg-footer {
  position: fixed; bottom: 0; left: 0; right: 0; background: #fff;
  border-top: 1px solid #e5e7eb; padding: 12px 20px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  max-width: 480px; margin: 0 auto;
}
.saved-note { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #16a34a; margin: 0; }
.submit-btn {
  width: 100%; padding: 14px; background: #083A8C; color: #fff; border: none;
  border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.15s;
}
.submit-btn:hover:not(:disabled) { background: #052a6a; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.submit-badge { opacity: 0.8; }
</style>

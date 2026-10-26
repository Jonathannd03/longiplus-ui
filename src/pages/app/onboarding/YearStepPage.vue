<template>
  <div class="step-page">
    <div class="step-breadcrumb">
      <RouterLink :to="fromOnboarding ? '/app/onboarding' : '/app/settings'" class="breadcrumb-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        {{ fromOnboarding ? 'Démarrage' : 'Paramètres' }}
      </RouterLink>
    </div>

    <p class="eyebrow">{{ fromOnboarding ? 'ÉTAPE 2 SUR 6 · ' : '' }}ANNÉE SCOLAIRE</p>
    <h1 class="page-title">Année scolaire</h1>

    <!-- Loading -->
    <div v-if="loading" class="section-card">
      <p style="color:#9ca3af;font-size:14px">Chargement…</p>
    </div>

    <!-- Create form (no year yet) -->
    <div v-else-if="showCreateForm" class="section-card">
      <h3 class="section-title">Créer l'année scolaire</h3>
      <div class="form-row-3" style="margin-bottom:16px">
        <div class="bareme-item">
          <label class="bareme-item__label" style="display:block;margin-bottom:6px">Libellé</label>
          <input v-model="newYear.label" class="form-input" placeholder="2025-2026" style="width:100%;box-sizing:border-box" />
        </div>
        <div class="bareme-item">
          <label class="bareme-item__label" style="display:block;margin-bottom:6px">Début</label>
          <input v-model="newYear.startsOn" type="date" class="form-input" style="width:100%;box-sizing:border-box" />
        </div>
        <div class="bareme-item">
          <label class="bareme-item__label" style="display:block;margin-bottom:6px">Fin</label>
          <input v-model="newYear.endsOn" type="date" class="form-input" style="width:100%;box-sizing:border-box" />
        </div>
      </div>
      <div style="margin-bottom:16px">
        <label class="bareme-item__label" style="display:block;margin-bottom:8px">Type de barème</label>
        <div style="display:flex;gap:12px">
          <label class="level-chip" :class="{ 'level-chip--active': newYear.gradingType === 'primary' }">
            <input type="radio" value="primary" v-model="newYear.gradingType" style="display:none" />
            Primaire (3 trimestres)
          </label>
          <label class="level-chip" :class="{ 'level-chip--active': newYear.gradingType === 'secondary' }">
            <input type="radio" value="secondary" v-model="newYear.gradingType" style="display:none" />
            Secondaire (2 semestres)
          </label>
        </div>
      </div>
      <p v-if="error" style="color:#dc2626;font-size:13px;margin-bottom:12px">{{ error }}</p>
      <button class="btn btn--navy" :disabled="saving || !newYear.label || !newYear.startsOn || !newYear.endsOn" @click="createYear">
        {{ saving ? 'Création…' : 'Créer et générer le calendrier' }}
      </button>
    </div>

    <!-- Periods calendar -->
    <div v-else class="section-card">
      <div class="section-header">
        <h3 class="section-title">Calendrier des périodes</h3>
        <span class="school-year-tag">Du 1er septembre 2026 au 2 juillet 2027</span>
      </div>

      <div class="semester-block">
        <p class="semester-label">{{ yearDetail?.gradingType === 'primary' ? 'Premier trimestre' : 'Premier semestre' }}</p>
        <div class="periods-row">
          <div
            v-for="period in semester1"
            :key="period.id"
            class="period-card period-card--open"
          >
            <div class="period-card__header">
              <span class="period-card__name">{{ period.label }}</span>
              <span class="period-card__badge badge--open">{{ statusLabel(period.status) }}</span>
            </div>
            <span class="period-kind-badge">{{ period.kind === 'exam' ? 'Examen' : 'Période' }}</span>
          </div>
        </div>
      </div>

      <div v-if="semester2.length > 0" class="semester-block">
        <p class="semester-label">{{ yearDetail?.gradingType === 'primary' ? 'Deuxième / Troisième trimestre' : 'Second semestre' }}</p>
        <div class="periods-row">
          <div
            v-for="period in semester2"
            :key="period.id"
            class="period-card period-card--upcoming"
          >
            <div class="period-card__header">
              <span class="period-card__name">{{ period.label }}</span>
              <span class="period-card__badge badge--upcoming">À venir</span>
            </div>
            <span class="period-kind-badge">{{ period.kind === 'exam' ? 'Examen' : 'Période' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Barème -->
    <div class="section-card">
      <h3 class="section-title">Barème et calcul</h3>
      <div class="bareme-grid">
        <div class="bareme-item">
          <p class="bareme-item__label">Système de notation</p>
          <p class="bareme-item__value">Barème RDC (points)</p>
        </div>
        <div class="bareme-item">
          <p class="bareme-item__label">Examens</p>
          <p class="bareme-item__value">× 2 (coefficient examen = double période)</p>
        </div>
        <div class="bareme-item">
          <p class="bareme-item__label">Seuil de réussite</p>
          <p class="bareme-item__value">50 % des points</p>
        </div>
        <div class="bareme-item">
          <p class="bareme-item__label">Arrondi</p>
          <p class="bareme-item__value">{{ scale.rounding }}</p>
        </div>
        <div class="bareme-item">
          <p class="bareme-item__label">Égalité</p>
          <p class="bareme-item__value">{{ scale.tieBreak }}</p>
        </div>
      </div>
    </div>

    <!-- Conduite -->
    <div class="section-card">
      <h3 class="section-title">Mentions de conduite</h3>
      <div class="conduct-row">
        <span v-for="label in conductLabels" :key="label" class="conduct-chip">{{ label }}</span>
      </div>
    </div>

    <!-- Jours fériés -->
    <div class="section-card">
      <h3 class="section-title">Congés et jours fériés</h3>
      <div class="holidays-list">
        <div v-for="h in holidays" :key="h.name" class="holiday-item">
          <p class="holiday-item__name">{{ h.name }}</p>
          <p class="holiday-item__dates">{{ h.dates }}</p>
        </div>
      </div>
    </div>

    <div class="step-actions" v-if="fromOnboarding">
      <RouterLink to="/app/onboarding" class="btn btn--ghost">Annuler</RouterLink>
      <button class="btn btn--navy" @click="save">Continuer · étape 3</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSchoolStore } from '@/stores/school'
import { useSetupApi } from '@/api/setup'
import type { AcademicYearDetail } from '@/api/setup'

const schoolStore = useSchoolStore()
const router = useRouter()
const route = useRoute()
const api = useSetupApi()

const fromOnboarding = computed(() => route.path.startsWith('/app/onboarding'))
const scale = computed(() => schoolStore.gradeScale)
const conductLabels = computed(() => schoolStore.conductLabels)
const holidays = computed(() => schoolStore.holidays)

const yearDetail = ref<AcademicYearDetail | null>(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const showCreateForm = ref(false)

const newYear = reactive({
  label: '',
  startsOn: '',
  endsOn: '',
  gradingType: 'secondary' as 'primary' | 'secondary',
})

onMounted(async () => {
  loading.value = true
  try {
    const years = await api.academicYears.list()
    if (years.length > 0) {
      yearDetail.value = await api.academicYears.get(years[0]!.id)
    } else {
      showCreateForm.value = true
    }
  } catch { /* ignore, show create form */ showCreateForm.value = true }
  finally { loading.value = false }
})

const semester1 = computed(() =>
  (yearDetail.value?.periods ?? []).filter(p => p.semesterOrTrimester === 1)
)
const semester2 = computed(() =>
  (yearDetail.value?.periods ?? []).filter(p => p.semesterOrTrimester === 2)
)

function statusLabel(status: string) {
  if (status === 'locked') return 'Verrouillée'
  if (status === 'open') return 'Ouverte'
  return 'À venir'
}

async function createYear() {
  saving.value = true
  error.value = ''
  try {
    const created = await api.academicYears.create(newYear)
    yearDetail.value = await api.academicYears.get(created.id)
    showCreateForm.value = false
  } catch {
    error.value = 'Erreur lors de la création. Réessayez.'
  } finally {
    saving.value = false
  }
}

function save() {
  const step = schoolStore.onboardingSteps.find(s => s.id === 2)
  if (step) step.done = true
  schoolStore.onboardingStep = 3
  router.push('/app/onboarding')
}
</script>

<style scoped>
.step-page { padding: 32px; max-width: 1200px; }

.step-breadcrumb { margin-bottom: 24px; }

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--k-blue);
  font-size: 13px;
  text-decoration: none;
  font-weight: 500;
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
  margin: 0 0 24px;
}

.section-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 20px;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0 0 16px;
}

.section-header .section-title { margin: 0; }

.school-year-tag {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
}

.semester-block { margin-bottom: 20px; }
.semester-block:last-child { margin-bottom: 0; }

.semester-label {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 10px;
}

.periods-row { display: flex; gap: 12px; flex-wrap: wrap; }

.period-card {
  flex: 1;
  min-width: 160px;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1.5px solid var(--k-border);
  background: #fafafa;
}

.period-card--locked  { background: #f3f4f6; }
.period-card--open    { background: #E8F1FC; border-color: var(--k-blue); }
.period-card--upcoming { background: #fafafa; opacity: 0.75; }

.period-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.period-card__name { font-weight: 600; font-size: 13px; color: #1a1a2e; }

.period-card__badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.badge--locked   { background: #e5e7eb; color: #6b7280; }
.badge--open     { background: #dbeafe; color: var(--k-blue); }
.badge--upcoming { background: #f3f4f6; color: #9ca3af; }

.period-card__dates   { font-size: 12px; color: #6b7280; margin: 0 0 2px; }
.period-card__closing { font-size: 11px; color: var(--k-blue); margin: 0; font-weight: 500; }
.period-kind-badge { font-size: 11px; color: #9ca3af; margin-top: 4px; display: block; }
.form-input { padding: 9px 12px; border: 1px solid var(--k-border, #e5e7eb); border-radius: 7px; font-size: 14px; outline: none; }
.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.level-chip { padding: 7px 14px; border: 1.5px solid var(--k-border, #e5e7eb); border-radius: 20px; font-size: 13px; cursor: pointer; transition: all 0.15s; user-select: none; }
.level-chip--active { border-color: var(--k-navy); background: var(--k-sky); color: var(--k-navy); font-weight: 600; }

.bareme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.bareme-item {
  padding: 12px 14px;
  background: #f9fafb;
  border-radius: 7px;
  border: 1px solid #e5e7eb;
}

.bareme-item__label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px; }
.bareme-item__value { font-size: 13px; color: #1a1a2e; font-weight: 500; margin: 0; }

.conduct-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 0; }

.conduct-chip {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  background: var(--k-sky);
  color: var(--k-navy);
  border-radius: 20px;
}

.holidays-list { display: flex; flex-direction: column; gap: 10px; margin-top: 0; }

.holiday-item { display: flex; align-items: baseline; justify-content: space-between; }
.holiday-item__name  { font-size: 13px; font-weight: 500; color: #1a1a2e; }
.holiday-item__dates { font-size: 13px; color: #6b7280; }

.step-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
</style>

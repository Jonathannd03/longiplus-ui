<template>
  <div class="step-page">
    <div class="step-breadcrumb">
      <RouterLink to="/app/onboarding" class="breadcrumb-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Démarrage
      </RouterLink>
    </div>

    <div class="step-topbar">
      <div>
        <p class="eyebrow">ÉTAPE 5 SUR 6 · INVITER LES ENSEIGNANTS</p>
        <h1 class="page-title">Enseignants et affectations</h1>
      </div>
      <div class="step-meta">
        <span class="meta-chip">{{ teachers.length }} enseignants</span>
        <span class="meta-chip">{{ headCount }} titulaires</span>
        <span class="meta-chip meta-chip--orange">{{ pendingCount }} invitations en attente</span>
      </div>
    </div>

    <!-- Add teacher form -->
    <div class="add-card">
      <h3 class="add-card__title">Inviter un enseignant</h3>
      <div class="add-form">
        <div class="form-group">
          <label class="form-label">Numéro de téléphone</label>
          <input v-model="invite.phone" type="tel" class="form-input" placeholder="+243 8X ••• XX XX" />
        </div>
        <div class="form-group">
          <label class="form-label">Cours enseignés</label>
          <input v-model="invite.courses" type="text" class="form-input" placeholder="Mathématiques, Physique" />
        </div>
        <div class="form-group">
          <label class="form-label">Classes</label>
          <input v-model="invite.classes" type="text" class="form-input" placeholder="4e Sc. A, 3e Sc." />
        </div>
        <button class="btn btn--navy btn--sm" @click="sendInvite">Envoyer l'invitation SMS</button>
      </div>
    </div>

    <!-- Teachers table -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Enseignant</th>
            <th>Cours</th>
            <th>Classes</th>
            <th>H/sem</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td>
              <div class="teacher-cell">
                <span class="teacher-initials">{{ teacher.initials }}</span>
                <div>
                  <p class="teacher-name">{{ teacher.shortName }}</p>
                  <p v-if="headClass(teacher)" class="teacher-sub">Titulaire {{ headClass(teacher) }}</p>
                </div>
              </div>
            </td>
            <td class="td-wrap">{{ teacher.courses.join(', ') }}</td>
            <td>{{ teacher.classIds.length }} classe{{ teacher.classIds.length > 1 ? 's' : '' }}</td>
            <td>{{ teacher.hoursPerWeek }}</td>
            <td>
              <StatusBadge :variant="teacher.status === 'active' ? 'success' : 'warning'">
                {{ teacher.status === 'active' ? 'Actif' : 'En attente' }}
              </StatusBadge>
            </td>
            <td>
              <button v-if="teacher.status === 'pending'" class="btn-link">Renvoyer</button>
              <button v-else class="btn-link btn-link--gray">Modifier</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="step-actions">
      <RouterLink to="/app/onboarding" class="btn btn--ghost">Retour</RouterLink>
      <button class="btn btn--navy" @click="save">Continuer · étape 6</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSchoolStore } from '@/stores/school'
import { useClassesStore } from '@/stores/classes'
import StatusBadge from '@/components/StatusBadge.vue'

const schoolStore = useSchoolStore()
const classesStore = useClassesStore()
const router = useRouter()

const teachers = computed(() => classesStore.teachers)
const pendingCount = computed(() => teachers.value.filter(t => t.status === 'pending').length)
const headCount = computed(() => teachers.value.filter(t => t.headOfClassId).length)

const invite = reactive({ phone: '', courses: '', classes: '' })

function headClass(teacher: typeof teachers.value[number]) {
  if (!teacher.headOfClassId) return ''
  return classesStore.getClassById(teacher.headOfClassId)?.name ?? ''
}

function sendInvite() {
  invite.phone = ''
  invite.courses = ''
  invite.classes = ''
}

function save() {
  const step = schoolStore.onboardingSteps.find(s => s.id === 5)
  if (step) step.done = true
  schoolStore.onboardingStep = 6
  router.push('/app/onboarding')
}
</script>

<style scoped>
.step-page { padding: 32px; }

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

.step-topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
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

.step-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding-top: 6px; }

.meta-chip {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  background: #f3f4f6;
  border-radius: 20px;
  color: #374151;
}

.meta-chip--orange { background: #fff7ed; color: #9a3412; }

.add-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 20px;
  margin-bottom: 16px;
}

.add-card__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0 0 16px;
}

.add-form {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.add-form .form-group { flex: 1; min-width: 160px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-label { font-size: 12px; font-weight: 600; color: #374151; }

.form-input {
  padding: 9px 12px;
  border: 1px solid var(--k-border);
  border-radius: 7px;
  font-size: 14px;
  color: #1a1a2e;
  outline: none;
}

.form-input:focus { border-color: var(--k-blue); }

.table-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  overflow: hidden;
  margin-bottom: 16px;
}

.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.data-table th {
  text-align: left;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid var(--k-border);
  background: #fafafa;
}

.data-table td { padding: 14px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.data-table tbody tr:last-child td { border-bottom: none; }

.teacher-cell { display: flex; align-items: center; gap: 10px; }

.teacher-initials {
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

.teacher-name { font-weight: 600; font-size: 13px; color: #1a1a2e; margin: 0 0 1px; }
.teacher-sub  { font-size: 11px; color: #6b7280; margin: 0; }

.td-wrap { max-width: 200px; color: #374151; }

.btn-link { background: none; border: none; color: var(--k-blue); font-size: 13px; cursor: pointer; padding: 0; }
.btn-link--gray { color: #9ca3af; }

.btn--sm { padding: 9px 16px; font-size: 13px; white-space: nowrap; }

.step-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
</style>

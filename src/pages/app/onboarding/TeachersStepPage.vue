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
        <span class="meta-chip">{{ members.length }} membres</span>
        <span class="meta-chip meta-chip--orange">{{ pendingCount }} invitations en attente</span>
      </div>
    </div>

    <!-- Add member form -->
    <div class="add-card">
      <h3 class="add-card__title">Inviter un membre de l'équipe</h3>
      <div class="add-form">
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input v-model="invite.email" type="email" class="form-input" placeholder="prenom.nom@ecole.cd" />
        </div>
        <div class="form-group">
          <label class="form-label">Rôle</label>
          <select v-model="invite.role" class="form-input">
            <option value="director">Préfet</option>
            <option value="bursar">Économe</option>
            <option value="secretary">Secrétaire</option>
            <option value="teacher">Professeur</option>
            <option value="class_teacher">Titulaire</option>
          </select>
        </div>
        <button class="btn btn--navy btn--sm" :disabled="inviting || !invite.email" @click="sendInvite">
          {{ inviting ? 'Envoi…' : 'Envoyer l\'invitation' }}
        </button>
      </div>
      <p v-if="inviteError" style="color:#dc2626;font-size:13px;margin-top:8px">{{ inviteError }}</p>
    </div>

    <!-- Members table -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>E-mail</th>
            <th>Rôle</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in members" :key="m.id">
            <td>{{ m.email }}</td>
            <td>{{ m.role }}</td>
            <td>
              <StatusBadge :variant="m.status === 'active' ? 'success' : 'warning'">
                {{ m.status === 'active' ? 'Actif' : 'En attente' }}
              </StatusBadge>
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
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSchoolStore } from '@/stores/school'
import { useSetupApi } from '@/api/setup'
import type { Member } from '@/api/setup'
import StatusBadge from '@/components/StatusBadge.vue'

const schoolStore = useSchoolStore()
const router = useRouter()
const api = useSetupApi()

const members = ref<Member[]>([])
const inviting = ref(false)
const inviteError = ref('')
const invite = reactive({ email: '', role: 'teacher' })

const pendingCount = computed(() => members.value.filter(m => m.status === 'invited').length)

onMounted(async () => {
  try { members.value = await api.members.list() } catch { /* ignore */ }
})

async function sendInvite() {
  if (!invite.email) return
  inviting.value = true
  inviteError.value = ''
  try {
    const m = await api.members.invite({ email: invite.email, role: invite.role })
    members.value.push(m)
    invite.email = ''
  } catch (e) {
    inviteError.value = 'Erreur lors de l\'envoi. Réessayez.'
  } finally {
    inviting.value = false
  }
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

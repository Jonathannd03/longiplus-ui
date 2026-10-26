<template>
  <div class="page">
    <div class="page-content">
      <p class="breadcrumb"><RouterLink to="/app/students">Élèves et familles</RouterLink> › <span v-if="student">{{ student.firstName }} {{ student.lastName }}</span></p>

      <div v-if="loading" class="state-msg">Chargement…</div>
      <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>
      <template v-else-if="student">

        <!-- Header -->
        <div class="profile-header">
          <div class="avatar" :style="{ background: avatarColor(student.id) }">{{ initials(student) }}</div>
          <div class="profile-info">
            <h1 class="profile-name">{{ student.lastName }} {{ student.postName }} {{ student.firstName }}</h1>
            <div class="profile-meta">
              <span class="code">{{ student.studentCode }}</span>
              <span>{{ student.sex === 'M' ? 'Garçon' : 'Fille' }}</span>
              <span>Né{{ student.sex === 'F' ? 'e' : '' }} le {{ formatDate(student.birthDate) }} à {{ student.birthPlace }}</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn btn--ghost btn--sm" @click="startEdit">Modifier</button>
            <button class="btn btn--danger btn--sm" @click="withdrawModalOpen = true">Retirer</button>
          </div>
        </div>

        <!-- Withdrawal modal -->
        <div v-if="withdrawModalOpen" class="modal-overlay" @click.self="withdrawModalOpen = false">
          <div class="modal">
            <h3 class="modal-title">Retirer l'élève</h3>
            <p class="modal-desc">Vous allez marquer l'inscription de <strong>{{ student?.firstName }} {{ student?.lastName }}</strong> comme retirée. Cette action est irréversible.</p>
            <div class="field" style="margin-top: 12px">
              <label class="field-label-sm">Motif du retrait <span class="required">*</span></label>
              <textarea v-model="withdrawReason" class="input" rows="3" placeholder="Changement d'école, déménagement, raisons familiales…"></textarea>
            </div>
            <p v-if="withdrawError" class="form-error">{{ withdrawError }}</p>
            <div class="modal-actions">
              <button class="btn btn--ghost btn--sm" @click="withdrawModalOpen = false">Annuler</button>
              <button
                class="btn btn--danger btn--sm"
                :disabled="withdrawing || !withdrawReason.trim()"
                @click="confirmWithdraw"
              >
                {{ withdrawing ? 'Traitement…' : 'Confirmer le retrait' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Edit form -->
        <div v-if="editing" class="edit-panel">
          <h2 class="edit-title">Modifier le dossier</h2>
          <div class="fields-row fields-row--3">
            <div class="field"><label>Nom</label><input v-model="editForm.lastName" class="input" /></div>
            <div class="field"><label>Post-nom</label><input v-model="editForm.postName" class="input" /></div>
            <div class="field"><label>Prénom</label><input v-model="editForm.firstName" class="input" /></div>
          </div>
          <div class="fields-row fields-row--3">
            <div class="field">
              <label>Sexe</label>
              <div class="toggle-group">
                <button type="button" :class="['toggle-btn', editForm.sex === 'M' ? 'toggle-btn--active' : '']" @click="editForm.sex = 'M'">Garçon</button>
                <button type="button" :class="['toggle-btn', editForm.sex === 'F' ? 'toggle-btn--active' : '']" @click="editForm.sex = 'F'">Fille</button>
              </div>
            </div>
            <div class="field"><label>Date de naissance</label><input type="date" v-model="editForm.birthDate" class="input" /></div>
            <div class="field"><label>Lieu de naissance</label><input v-model="editForm.birthPlace" class="input" /></div>
          </div>
          <p v-if="editError" class="form-error">{{ editError }}</p>
          <div class="edit-actions">
            <button class="btn btn--ghost btn--sm" @click="editing = false">Annuler</button>
            <button class="btn btn--navy btn--sm" :disabled="saving" @click="saveEdit">
              {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs-bar">
          <button v-for="tab in tabs" :key="tab.id" :class="['tab-btn', activeTab === tab.id ? 'tab-btn--active' : '']" @click="switchTab(tab.id)">
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab: Famille -->
        <div v-if="activeTab === 'family'" class="tab-content">
          <!-- Guardians -->
          <h3 class="section-sub">Parents responsables</h3>
          <div v-if="guardians.length === 0" class="placeholder-msg">Aucun parent enregistré.</div>
          <div v-for="g in guardians" :key="g.id" class="family-card">
            <div class="family-header">
              <div class="family-avatar">{{ g.fullName.slice(0, 2).toUpperCase() }}</div>
              <div>
                <p class="family-name">{{ g.fullName }}</p>
                <p class="family-role">{{ g.relationship }}</p>
              </div>
            </div>
            <div class="family-fields">
              <div class="family-field">
                <span class="field-label">Téléphone</span>
                <span class="field-value">{{ g.phoneE164 }}</span>
              </div>
            </div>
          </div>

          <!-- Add guardian -->
          <div v-if="!addingGuardian" class="add-guardian-btn-wrap">
            <button class="btn btn--ghost btn--sm" @click="addingGuardian = true">+ Ajouter un parent</button>
          </div>
          <div v-else class="add-guardian-form">
            <h3 class="section-sub">Nouveau parent</h3>
            <div class="fields-row fields-row--2">
              <div class="field"><label>Téléphone (E.164)</label><input v-model="guardianForm.phoneE164" class="input" placeholder="+243812345678" /></div>
              <div class="field"><label>Nom complet</label><input v-model="guardianForm.fullName" class="input" placeholder="KABONGO Jean" /></div>
            </div>
            <div class="field" style="max-width: 240px">
              <label>Relation</label>
              <select v-model="guardianForm.relationship" class="input">
                <option value="parent">Parent</option>
                <option value="guardian">Tuteur</option>
                <option value="sibling">Frère / Sœur</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <p v-if="guardianError" class="form-error">{{ guardianError }}</p>
            <div class="edit-actions">
              <button class="btn btn--ghost btn--sm" @click="addingGuardian = false; guardianError = ''">Annuler</button>
              <button class="btn btn--navy btn--sm" :disabled="savingGuardian" @click="saveGuardian">
                {{ savingGuardian ? 'Enregistrement…' : 'Enregistrer' }}
              </button>
            </div>
          </div>

          <!-- Siblings -->
          <template v-if="siblings.length > 0">
            <h3 class="section-sub" style="margin-top: 24px">Frères et sœurs</h3>
            <div class="siblings-list">
              <RouterLink v-for="s in siblings" :key="s.id" :to="`/app/students/${s.id}`" class="sibling-row">
                <div class="sibling-avatar">{{ s.lastName[0] }}{{ s.firstName[0] }}</div>
                <div class="sibling-info">
                  <p class="sibling-name">{{ s.lastName }} {{ s.postName }} {{ s.firstName }}</p>
                  <p class="sibling-class">{{ s.className ?? '—' }}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </RouterLink>
            </div>
          </template>
        </div>

        <!-- Tab: Résultats -->
        <div v-if="activeTab === 'results'" class="tab-content placeholder-panel">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          <p class="placeholder-title">Notes disponibles dans une prochaine version</p>
          <p class="placeholder-desc">La saisie des notes et le calcul des moyennes seront disponibles avec le module Notes (M7).</p>
        </div>

        <!-- Tab: Présences -->
        <div v-if="activeTab === 'attendance'" class="tab-content">
          <div v-if="loadingAttendance" class="state-msg">Chargement…</div>
          <template v-else>
            <!-- Stats -->
            <div v-if="attendanceStats" class="att-stats">
              <div class="att-stat att-stat--green">
                <span class="att-stat__num">{{ attendanceStats.present }}</span>
                <span class="att-stat__label">Présences</span>
              </div>
              <div class="att-stat att-stat--red">
                <span class="att-stat__num">{{ attendanceStats.absent }}</span>
                <span class="att-stat__label">Absences</span>
              </div>
              <div class="att-stat att-stat--yellow">
                <span class="att-stat__num">{{ attendanceStats.late }}</span>
                <span class="att-stat__label">Retards</span>
              </div>
              <div class="att-stat">
                <span class="att-stat__num">{{ attendanceStats.total }}</span>
                <span class="att-stat__label">Total jours</span>
              </div>
              <div v-if="attendanceStats.presenceRate !== null" class="att-stat att-stat--rate">
                <span class="att-stat__num">{{ Math.round(attendanceStats.presenceRate * 100) }}%</span>
                <span class="att-stat__label">Taux présence</span>
              </div>
            </div>

            <!-- History -->
            <div v-if="attendanceHistory.length === 0" class="placeholder-msg">Aucun enregistrement d'appel.</div>
            <div v-else class="att-list">
              <div v-for="rec in attendanceHistory" :key="rec.id" class="att-row">
                <span class="att-date">{{ formatDate(rec.date) }}</span>
                <span :class="['att-badge', `att-badge--${rec.status}`]">{{ statusLabel(rec.status) }}</span>
              </div>
            </div>
          </template>
        </div>

        <!-- Tab: Parcours -->
        <div v-if="activeTab === 'parcours'" class="tab-content">
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-label">Inscrit{{ student.sex === 'F' ? 'e' : '' }} le</span>
                <span class="timeline-value">{{ formatDate(student.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Messages -->
        <div v-if="activeTab === 'messages'" class="tab-content placeholder-panel">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p class="placeholder-title">Messages disponibles dans une prochaine version</p>
          <p class="placeholder-desc">L'historique SMS sera disponible avec le module Notifications.</p>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSetupApi } from '@/api/setup'
import type { StudentDetail, GuardianItem, SiblingItem, AttendanceEntry, AttendanceStats } from '@/api/setup'

const route = useRoute()
const api = useSetupApi()

const loading = ref(true)
const error = ref('')
const student = ref<StudentDetail | null>(null)
const guardians = ref<GuardianItem[]>([])
const siblings = ref<SiblingItem[]>([])

// edit state
const editing = ref(false)
const saving = ref(false)
const editError = ref('')
const editForm = ref({ lastName: '', postName: '', firstName: '', sex: 'M' as 'M' | 'F', birthDate: '', birthPlace: '' })

// guardian add state
const addingGuardian = ref(false)
const savingGuardian = ref(false)
const guardianError = ref('')
const guardianForm = ref({ phoneE164: '', fullName: '', relationship: 'parent' })

// withdrawal state
const withdrawModalOpen = ref(false)
const withdrawReason = ref('')
const withdrawing = ref(false)
const withdrawError = ref('')

// attendance state
const loadingAttendance = ref(false)
const attendanceStats = ref<AttendanceStats | null>(null)
const attendanceHistory = ref<AttendanceEntry[]>([])

const activeTab = ref('family')
const tabs = [
  { id: 'family', label: 'Famille' },
  { id: 'results', label: 'Résultats' },
  { id: 'attendance', label: 'Présences' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'messages', label: 'Messages' },
]

onMounted(async () => {
  const id = route.params['id'] as string
  try {
    const [s, g, sib] = await Promise.all([
      api.students.get(id),
      api.students.guardians(id),
      api.students.siblings(id),
    ])
    student.value = s
    guardians.value = g
    siblings.value = sib
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Élève introuvable'
  } finally {
    loading.value = false
  }
})

async function switchTab(id: string) {
  activeTab.value = id
  if (id === 'attendance' && attendanceStats.value === null && !loadingAttendance.value && student.value) {
    loadingAttendance.value = true
    try {
      const [stats, history] = await Promise.all([
        api.students.attendance.stats(student.value.id),
        api.students.attendance.list(student.value.id),
      ])
      attendanceStats.value = stats
      attendanceHistory.value = history
    } finally {
      loadingAttendance.value = false
    }
  }
}

function startEdit() {
  if (!student.value) return
  editForm.value = {
    lastName: student.value.lastName,
    postName: student.value.postName,
    firstName: student.value.firstName,
    sex: student.value.sex,
    birthDate: student.value.birthDate,
    birthPlace: student.value.birthPlace,
  }
  editError.value = ''
  editing.value = true
}

async function saveEdit() {
  if (!student.value || saving.value) return
  saving.value = true
  editError.value = ''
  try {
    const updated = await api.students.update(student.value.id, { ...editForm.value })
    if (updated) student.value = updated
    editing.value = false
  } catch (e) {
    editError.value = e instanceof Error ? e.message : 'Erreur lors de la mise à jour'
  } finally {
    saving.value = false
  }
}

async function saveGuardian() {
  if (!student.value || savingGuardian.value) return
  if (!guardianForm.value.phoneE164.trim()) { guardianError.value = 'Téléphone requis'; return }
  savingGuardian.value = true
  guardianError.value = ''
  try {
    const fullName = guardianForm.value.fullName.trim()
    const dto: { phoneE164: string; fullName?: string; relationship?: string } = {
      phoneE164: guardianForm.value.phoneE164.trim(),
      relationship: guardianForm.value.relationship,
    }
    if (fullName) dto.fullName = fullName
    const g = await api.students.addGuardian(student.value.id, dto)
    guardians.value.push(g)
    addingGuardian.value = false
    guardianForm.value = { phoneE164: '', fullName: '', relationship: 'parent' }
  } catch (e) {
    guardianError.value = e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement'
  } finally {
    savingGuardian.value = false
  }
}

async function confirmWithdraw() {
  if (!student.value || !withdrawReason.value.trim()) return
  withdrawing.value = true
  withdrawError.value = ''
  try {
    await api.enrollments.withdraw(student.value.id, withdrawReason.value.trim())
    withdrawModalOpen.value = false
    withdrawReason.value = ''
  } catch (e) {
    withdrawError.value = e instanceof Error ? e.message : 'Erreur lors du retrait'
  } finally {
    withdrawing.value = false
  }
}

const avatarColors = ['#083A8C', '#0160D3', '#1d4ed8', '#2563eb', '#4f46e5', '#7c3aed', '#db2777']
function avatarColor(id: string): string {
  let hash = 0
  for (const c of id) hash = ((hash * 31) + c.charCodeAt(0)) & 0x7fffffff
  return avatarColors[hash % avatarColors.length]!
}

function initials(s: StudentDetail): string {
  return `${s.lastName[0] ?? ''}${s.firstName[0] ?? ''}`.toUpperCase()
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fr-CD', { day: '2-digit', month: 'long', year: 'numeric' })
}

function statusLabel(s: string): string {
  return s === 'present' ? 'Présent' : s === 'absent' ? 'Absent' : s === 'late' ? 'Retard' : 'Excusé'
}
</script>

<style scoped>
.page { padding: 32px; }
.page-content { max-width: 1300px; }
.breadcrumb { font-size: 13px; color: var(--k-text-muted); margin: 0 0 20px; }
.breadcrumb a { color: var(--k-blue); text-decoration: none; }

.state-msg { padding: 60px; text-align: center; color: #6b7280; font-size: 14px; }
.state-msg--error { color: #ef4444; }

.profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.avatar { width: 56px; height: 56px; border-radius: 50%; color: #fff; font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.profile-info { flex: 1; }
.profile-name { font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; color: var(--k-navy); margin: 0 0 6px; }
.profile-meta { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--k-text-muted); flex-wrap: wrap; }
.code { font-family: 'IBM Plex Mono', monospace; background: #f3f4f6; padding: 2px 8px; border-radius: 4px; color: var(--k-text); }
.header-actions { display: flex; gap: 8px; }
.btn--danger { background: #fee2e2; color: #991b1b; border: none; }
.btn--danger:disabled { opacity: 0.5; cursor: not-allowed; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 100; display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; border-radius: 12px; padding: 28px; width: 440px; max-width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
.modal-title { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700; color: var(--k-navy); margin: 0 0 8px; }
.modal-desc { font-size: 13px; color: #6b7280; margin: 0; line-height: 1.5; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.field-label-sm { font-size: 13px; font-weight: 600; color: var(--k-navy); display: block; margin-bottom: 4px; }
.required { color: #ef4444; }

.edit-panel { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 24px; margin-bottom: 20px; }
.edit-title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0 0 16px; }
.fields-row { display: grid; gap: 12px; margin-bottom: 12px; }
.fields-row--3 { grid-template-columns: repeat(3, 1fr); }
.fields-row--2 { grid-template-columns: repeat(2, 1fr); }
.field { display: flex; flex-direction: column; gap: 4px; }
.field label { font-size: 12px; font-weight: 600; color: var(--k-text-muted); }
.input { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; font-size: 14px; font-family: inherit; outline: none; }
.input:focus { border-color: var(--k-blue); box-shadow: 0 0 0 3px rgba(1,96,211,0.1); }
.toggle-group { display: flex; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden; }
.toggle-btn { flex: 1; padding: 8px; font-size: 14px; border: none; background: #fff; cursor: pointer; }
.toggle-btn--active { background: var(--k-sky); color: var(--k-navy); font-weight: 600; }
.edit-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
.form-error { color: #ef4444; font-size: 13px; margin: 8px 0 0; }

.tabs-bar { display: flex; gap: 4px; border-bottom: 1px solid var(--k-border); margin-bottom: 24px; }
.tab-btn { padding: 10px 16px; font-size: 14px; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; color: var(--k-text-muted); margin-bottom: -1px; }
.tab-btn--active { color: var(--k-navy); border-bottom-color: var(--k-navy); font-weight: 600; }

.tab-content { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 24px; }

.placeholder-panel { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; text-align: center; gap: 12px; }
.placeholder-title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0; }
.placeholder-desc { font-size: 13px; color: var(--k-text-muted); margin: 0; max-width: 380px; }
.placeholder-msg { text-align: center; color: #9ca3af; font-size: 14px; padding: 24px 0; }

.section-sub { font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600; color: var(--k-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px; }

.family-card { background: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 12px; }
.family-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.family-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--k-sky); color: var(--k-navy); font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.family-name { font-weight: 600; font-size: 14px; margin: 0 0 2px; color: var(--k-text); }
.family-role { font-size: 12px; color: var(--k-text-muted); margin: 0; }
.family-fields { display: flex; gap: 24px; }
.family-field { display: flex; flex-direction: column; gap: 4px; }
.field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--k-text-muted); }
.field-value { font-size: 13px; }

.add-guardian-btn-wrap { margin-top: 12px; }
.add-guardian-form { margin-top: 20px; padding: 20px; background: #f9fafb; border-radius: 10px; }

.siblings-list { display: flex; flex-direction: column; gap: 4px; }
.sibling-row { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; text-decoration: none; }
.sibling-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--k-sky); color: var(--k-navy); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sibling-info { flex: 1; }
.sibling-name { font-weight: 600; font-size: 13px; color: var(--k-navy); margin: 0 0 2px; }
.sibling-class { font-size: 12px; color: var(--k-text-muted); margin: 0; }

.att-stats { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
.att-stat { display: flex; flex-direction: column; align-items: center; padding: 16px 24px; border-radius: 10px; background: #f9fafb; border: 1px solid var(--k-border); min-width: 80px; }
.att-stat--green { background: #dcfce7; border-color: #86efac; }
.att-stat--red { background: #fee2e2; border-color: #fca5a5; }
.att-stat--yellow { background: #fef9c3; border-color: #fde047; }
.att-stat--rate { background: var(--k-sky); border-color: var(--k-blue); }
.att-stat__num { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; color: var(--k-navy); }
.att-stat__label { font-size: 11px; color: var(--k-text-muted); font-weight: 500; margin-top: 2px; }

.att-list { display: flex; flex-direction: column; gap: 4px; }
.att-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #f9fafb; font-size: 13px; }
.att-date { color: var(--k-text-muted); }
.att-badge { padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
.att-badge--present { background: #dcfce7; color: #166534; }
.att-badge--absent { background: #fee2e2; color: #991b1b; }
.att-badge--late { background: #fef9c3; color: #854d0e; }
.att-badge--excused { background: #e0e7ff; color: #3730a3; }

.timeline { display: flex; flex-direction: column; gap: 12px; }
.timeline-item { display: flex; align-items: center; gap: 16px; }
.timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--k-navy); flex-shrink: 0; }
.timeline-content { display: flex; align-items: center; gap: 12px; font-size: 13px; }
.timeline-label { color: var(--k-text-muted); min-width: 100px; }
.timeline-value { color: var(--k-text); font-weight: 500; }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; }
.btn--navy { background: var(--k-navy); color: #fff; }
.btn--navy:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--ghost { background: transparent; color: var(--k-text); border: 1px solid #d1d5db; }
.btn--sm { padding: 7px 14px; font-size: 13px; }
</style>

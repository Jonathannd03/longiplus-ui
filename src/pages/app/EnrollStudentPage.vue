<template>
  <div class="page">
    <div class="page-content">
      <p class="breadcrumb"><RouterLink to="/app/students">Élèves et familles</RouterLink> › Nouvelle inscription</p>
      <h1 class="page-title">Inscrire un élève</h1>

      <!-- Success state -->
      <div v-if="successResult" class="success-panel">
        <div class="success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <h2 class="success-title">Inscription réussie</h2>
          <p class="success-desc">Code élève : <strong class="code">{{ successResult.studentCode }}</strong></p>
          <div v-if="successResult.duplicate" class="info-box info-box--warn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            <div>
              <strong>Doublon détecté</strong><br>
              Un élève avec le même nom et la même date de naissance existe déjà (code : {{ successResult.duplicate.studentCode }}).
            </div>
          </div>
          <div class="success-actions">
            <RouterLink :to="`/app/students/${successResult.id}`" class="btn btn--navy">Voir le profil</RouterLink>
            <button class="btn btn--ghost" @click="resetForm">Inscrire un autre élève</button>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div v-else class="form-layout">
        <div class="form-main">
          <div v-if="loadingSections" class="state-msg">Chargement des classes…</div>
          <template v-else>
            <!-- Section 1 -->
            <div class="form-section">
              <div class="section-num">1</div>
              <div class="section-body">
                <h2 class="section-title">L'élève</h2>
                <div class="fields-row fields-row--3">
                  <div class="field">
                    <label>Nom</label>
                    <input type="text" v-model="form.lastName" class="input" placeholder="KABONGO" />
                  </div>
                  <div class="field">
                    <label>Post-nom</label>
                    <input type="text" v-model="form.postName" class="input" placeholder="Ilunga" />
                  </div>
                  <div class="field">
                    <label>Prénom</label>
                    <input type="text" v-model="form.firstName" class="input" placeholder="José" />
                  </div>
                </div>
                <div class="fields-row fields-row--3">
                  <div class="field">
                    <label>Sexe</label>
                    <div class="toggle-group">
                      <button type="button" :class="['toggle-btn', form.sex === 'M' ? 'toggle-btn--active' : '']" @click="form.sex = 'M'">Garçon</button>
                      <button type="button" :class="['toggle-btn', form.sex === 'F' ? 'toggle-btn--active' : '']" @click="form.sex = 'F'">Fille</button>
                    </div>
                  </div>
                  <div class="field">
                    <label>Date de naissance</label>
                    <input type="date" v-model="form.birthDate" class="input" />
                  </div>
                  <div class="field">
                    <label>Lieu de naissance</label>
                    <input type="text" v-model="form.birthPlace" class="input" placeholder="Kinshasa" />
                  </div>
                </div>
                <div class="field">
                  <label>Classe {{ yearLabel }}</label>
                  <select v-model="form.classSectionId" class="input">
                    <option value="">— Choisir une classe —</option>
                    <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Section 2 -->
            <div class="form-section">
              <div class="section-num">2</div>
              <div class="section-body">
                <h2 class="section-title">Le parent responsable</h2>
                <div class="field">
                  <label>Téléphone du parent</label>
                  <input type="tel" v-model="form.guardianPhone" class="input" placeholder="+243 81 234 5678" />
                  <p class="field-helper">Les alertes d'absence et les bulletins arrivent sur ce numéro.</p>
                </div>
                <div class="field" v-if="form.guardianPhone">
                  <label>Nom du parent</label>
                  <input type="text" v-model="form.guardianName" class="input" placeholder="KABONGO Jean" />
                </div>
              </div>
            </div>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <div class="form-footer">
              <RouterLink to="/app/students" class="link-cancel">Annuler</RouterLink>
              <button class="btn btn--navy" :disabled="submitting || !canSubmit" @click="submit">
                <svg v-if="!submitting" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {{ submitting ? 'Inscription en cours…' : 'Inscrire l\'élève' }}
              </button>
            </div>
          </template>
        </div>

        <!-- Right sidebar -->
        <aside class="form-sidebar">
          <div class="sidebar-card">
            <p class="sidebar-label">APRÈS L'ENREGISTREMENT</p>
            <ol class="sidebar-list">
              <li>LongiPlus crée le code élève permanent (9 chiffres).</li>
              <li>L'élève apparaît dans la liste d'appel de sa classe.</li>
              <li v-if="form.guardianPhone">Le parent reçoit un SMS de confirmation.</li>
            </ol>
          </div>
          <div class="sidebar-card">
            <p class="sidebar-label">CODE ÉLÈVE</p>
            <p class="sidebar-note">Le code est permanent, unique et suit l'enfant d'une année à l'autre. Il est généré automatiquement selon la norme Luhn.</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSetupApi } from '@/api/setup'
import type { ClassSection, EnrollResult } from '@/api/setup'

const api = useSetupApi()

const loadingSections = ref(true)
const sections = ref<ClassSection[]>([])
const activeYearId = ref('')
const yearLabel = ref('')

const submitting = ref(false)
const formError = ref('')
const successResult = ref<EnrollResult | null>(null)

const form = ref({
  lastName: '',
  postName: '',
  firstName: '',
  sex: 'M' as 'M' | 'F',
  birthDate: '',
  birthPlace: '',
  classSectionId: '',
  guardianPhone: '',
  guardianName: '',
})

onMounted(async () => {
  try {
    const years = await api.academicYears.list()
    const year = years.find(y => y.status === 'active') ?? years[0]
    if (year) {
      activeYearId.value = year.id
      yearLabel.value = year.label
      sections.value = await api.classSections.list(year.id)
    }
  } finally {
    loadingSections.value = false
  }
})

const canSubmit = computed(() =>
  form.value.lastName.trim() &&
  form.value.postName.trim() &&
  form.value.firstName.trim() &&
  form.value.birthDate &&
  form.value.birthPlace.trim() &&
  form.value.classSectionId &&
  activeYearId.value
)

async function submit() {
  if (submitting.value || !canSubmit.value) return
  submitting.value = true
  formError.value = ''
  try {
    const phone = form.value.guardianPhone.trim().replace(/[\s\-().]/g, '')
    const dto: Parameters<typeof api.students.enroll>[0] = {
      lastName: form.value.lastName.trim().toUpperCase(),
      postName: form.value.postName.trim(),
      firstName: form.value.firstName.trim(),
      sex: form.value.sex,
      birthDate: form.value.birthDate,
      birthPlace: form.value.birthPlace.trim(),
      classSectionId: form.value.classSectionId,
      yearId: activeYearId.value,
    }
    if (phone) {
      dto.guardianPhone = phone
      if (form.value.guardianName.trim()) dto.guardianName = form.value.guardianName.trim()
    }
    successResult.value = await api.students.enroll(dto)
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Erreur lors de l\'inscription'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  successResult.value = null
  formError.value = ''
  form.value = { lastName: '', postName: '', firstName: '', sex: 'M', birthDate: '', birthPlace: '', classSectionId: '', guardianPhone: '', guardianName: '' }
}
</script>

<style scoped>
.page { padding: 32px; }
.page-content { max-width: 1400px; }
.breadcrumb { font-size: 13px; color: var(--k-text-muted); margin: 0 0 8px; }
.breadcrumb a { color: var(--k-blue); text-decoration: none; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; color: var(--k-navy); margin: 0 0 24px; }

.success-panel { display: flex; gap: 24px; align-items: flex-start; background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 32px; }
.success-icon { width: 56px; height: 56px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.success-title { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: var(--k-navy); margin: 0 0 8px; }
.success-desc { font-size: 14px; color: var(--k-text); margin: 0 0 16px; }
.code { font-family: 'IBM Plex Mono', monospace; background: #f3f4f6; padding: 2px 8px; border-radius: 4px; }
.success-actions { display: flex; gap: 12px; margin-top: 16px; }

.state-msg { padding: 40px; text-align: center; color: #6b7280; font-size: 14px; }

.form-layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
.form-section { display: flex; gap: 16px; background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 24px; margin-bottom: 16px; }
.section-num { width: 28px; height: 28px; border-radius: 50%; background: var(--k-navy); color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.section-body { flex: 1; }
.section-title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0 0 16px; }
.fields-row { display: grid; gap: 12px; margin-bottom: 12px; }
.fields-row--3 { grid-template-columns: repeat(3, 1fr); }
.field { display: flex; flex-direction: column; gap: 4px; }
.field label { font-size: 12px; font-weight: 600; color: var(--k-text-muted); }
.input { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; font-size: 14px; font-family: inherit; outline: none; }
.input:focus { border-color: var(--k-blue); box-shadow: 0 0 0 3px rgba(1,96,211,0.1); }
.field-helper { font-size: 12px; color: var(--k-text-muted); margin: 4px 0 0; }
.toggle-group { display: flex; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden; }
.toggle-btn { flex: 1; padding: 8px; font-size: 14px; border: none; background: #fff; cursor: pointer; }
.toggle-btn--active { background: var(--k-sky); color: var(--k-navy); font-weight: 600; }
.info-box { display: flex; gap: 12px; padding: 14px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
.info-box--warn { background: #fef9c3; border: 1px solid #fef08a; color: #854d0e; }
.form-error { color: #ef4444; font-size: 13px; margin: 0 0 12px; }
.form-footer { display: flex; align-items: center; justify-content: flex-end; gap: 16px; padding-top: 8px; }
.link-cancel { color: var(--k-blue); font-size: 14px; text-decoration: none; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; }
.btn--navy { background: var(--k-navy); color: #fff; }
.btn--navy:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--ghost { background: transparent; color: var(--k-text); border: 1px solid #d1d5db; }
.form-sidebar { display: flex; flex-direction: column; gap: 16px; }
.sidebar-card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; }
.sidebar-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; color: var(--k-text-muted); margin: 0 0 12px; text-transform: uppercase; }
.sidebar-list { padding-left: 18px; margin: 0; font-size: 13px; line-height: 1.7; color: var(--k-text); }
.sidebar-note { font-size: 12px; color: var(--k-text-muted); margin: 0; line-height: 1.5; }
</style>

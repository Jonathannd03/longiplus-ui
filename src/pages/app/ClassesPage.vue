<template>
  <div class="page">
    <div class="page-tabs">
      <button class="tab-btn" :class="{ active: tab === 'classes' }" @click="tab = 'classes'">Classes</button>
      <button class="tab-btn" :class="{ active: tab === 'teachers' }" @click="tab = 'teachers'">Enseignants</button>
    </div>

    <!-- CLASSES TAB -->
    <template v-if="tab === 'classes'">
      <div class="page-header">
        <div>
          <p class="eyebrow">{{ sections.length }} CLASSE{{ sections.length !== 1 ? 'S' : '' }} · {{ yearLabel || '—' }}</p>
          <h2>Classes et cours</h2>
        </div>
        <button class="btn btn-navy" @click="showCreateSection = !showCreateSection">+ Nouvelle classe</button>
      </div>

      <!-- Create section inline form -->
      <div v-if="showCreateSection" class="create-card">
        <h3>Nouvelle classe</h3>
        <div class="form-row">
          <div class="field">
            <label>Niveau</label>
            <input v-model="newSection.level" class="input" placeholder="6ème primaire" />
          </div>
          <div class="field">
            <label>Option (facultatif)</label>
            <input v-model="newSection.option" class="input" placeholder="Sciences" />
          </div>
          <div class="field">
            <label>Nom</label>
            <input v-model="newSection.name" class="input" placeholder="6P A" />
          </div>
        </div>
        <p v-if="createSectionError" class="form-error">{{ createSectionError }}</p>
        <div class="form-actions">
          <button class="btn btn-outline" @click="showCreateSection = false; createSectionError = ''">Annuler</button>
          <button class="btn btn-navy" :disabled="creatingSec || !newSection.name || !newSection.level" @click="createSection">
            {{ creatingSec ? 'Création…' : 'Créer' }}
          </button>
        </div>
      </div>

      <div v-if="loadingSections" class="loading-text">Chargement…</div>

      <div v-else class="classes-layout">
        <div class="class-list">
          <template v-if="primaireClasses.length > 0">
            <p class="list-group-label">PRIMAIRE</p>
            <button
              v-for="c in primaireClasses"
              :key="c.id"
              class="class-item"
              :class="{ selected: selectedId === c.id }"
              @click="selectedId = c.id"
            >
              <span>{{ c.name }}</span>
              <span class="class-count">{{ c.subjects.length }}</span>
            </button>
          </template>
          <template v-if="secondaireClasses.length > 0">
            <p class="list-group-label">SECONDAIRE</p>
            <button
              v-for="c in secondaireClasses"
              :key="c.id"
              class="class-item"
              :class="{ selected: selectedId === c.id }"
              @click="selectedId = c.id"
            >
              <span>{{ c.name }}</span>
              <span class="class-count">{{ c.subjects.length }}</span>
            </button>
          </template>
          <p v-if="sections.length === 0" class="list-empty">Aucune classe.</p>
        </div>

        <div v-if="selectedSection" class="class-detail">
          <div class="detail-form-row">
            <div class="field">
              <label>Niveau</label>
              <input class="input" :value="selectedSection.level" readonly />
            </div>
            <div class="field">
              <label>Option</label>
              <input class="input" :value="selectedSection.option || '—'" readonly />
            </div>
            <div class="field">
              <label>Nom</label>
              <input class="input" :value="selectedSection.name" readonly />
            </div>
          </div>

          <div class="courses-header">
            <h3>Cours de la classe</h3>
            <button class="btn btn-outline" @click="showAddSubject = !showAddSubject">+ Ajouter un cours</button>
          </div>

          <!-- Add subject inline form -->
          <div v-if="showAddSubject" class="create-card" style="margin-bottom:16px">
            <div class="form-row">
              <div class="field">
                <label>Nom du cours</label>
                <input v-model="newSubject.name" class="input" placeholder="Mathématiques" />
              </div>
              <div class="field">
                <label>Max. période</label>
                <input v-model.number="newSubject.maxPeriod" type="number" class="input" min="1" />
              </div>
              <div class="field">
                <label>Max. examen (facultatif)</label>
                <input v-model.number="newSubject.maxExam" type="number" class="input" placeholder="Auto (×2)" />
              </div>
            </div>
            <p v-if="addSubjectError" class="form-error">{{ addSubjectError }}</p>
            <div class="form-actions">
              <button class="btn btn-outline" @click="showAddSubject = false; addSubjectError = ''">Annuler</button>
              <button class="btn btn-navy" :disabled="addingSubject || !newSubject.name" @click="addSubject">
                {{ addingSubject ? 'Ajout…' : 'Ajouter' }}
              </button>
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Max. période</th>
                <th>Max. examen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in selectedSection.subjects" :key="s.id">
                <td>{{ s.name }}</td>
                <td>{{ s.maxPeriod }}</td>
                <td>{{ s.maxExam ?? s.maxPeriod * 2 }}</td>
              </tr>
              <tr v-if="selectedSection.subjects.length === 0">
                <td colspan="3" class="empty-cell">Aucun cours — cliquez « + Ajouter un cours ».</td>
              </tr>
              <tr v-else class="row-total">
                <td><strong>Total</strong></td>
                <td><strong>{{ totalMaxPeriod }}</strong></td>
                <td><strong>{{ totalMaxExam }}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="info-box info-box-blue">
            <span class="info-icon">ℹ</span>
            <span><strong>Maximum examen par défaut</strong> : 2 × le maximum de la période. Saisissez une valeur pour la remplacer.</span>
          </div>
        </div>

        <div v-else-if="sections.length === 0" class="class-detail class-detail--empty">
          <p>Créez votre première classe avec le bouton ci-dessus.</p>
        </div>
      </div>
    </template>

    <!-- TEACHERS TAB -->
    <template v-else>
      <div class="page-header">
        <div>
          <p class="eyebrow">{{ members.length }} MEMBRE{{ members.length !== 1 ? 'S' : '' }}</p>
          <h2>Enseignants et affectations</h2>
        </div>
      </div>
      <div class="card">
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
              <td>{{ roleLabel(m.role) }}</td>
              <td>
                <span class="badge" :class="m.status === 'active' ? 'badge-success' : 'badge-orange'">
                  {{ m.status === 'active' ? 'Actif' : 'En attente' }}
                </span>
              </td>
            </tr>
            <tr v-if="members.length === 0">
              <td colspan="3" class="empty-cell">Aucun membre. Invitez l'équipe depuis la page Démarrage.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSetupApi } from '@/api/setup'
import type { ClassSection, Member } from '@/api/setup'

const api = useSetupApi()
const tab = ref<'classes' | 'teachers'>('classes')

// --- Academic year + sections ---
const yearId = ref('')
const yearLabel = ref('')
const sections = ref<ClassSection[]>([])
const loadingSections = ref(false)
const selectedId = ref('')

const selectedSection = computed(() => sections.value.find(s => s.id === selectedId.value) ?? null)

const primaireClasses = computed(() =>
  sections.value.filter(s => s.level.toLowerCase().includes('primaire'))
)
const secondaireClasses = computed(() =>
  sections.value.filter(s => !s.level.toLowerCase().includes('primaire'))
)

const totalMaxPeriod = computed(() =>
  selectedSection.value?.subjects.reduce((sum, s) => sum + s.maxPeriod, 0) ?? 0
)
const totalMaxExam = computed(() =>
  selectedSection.value?.subjects.reduce((sum, s) => sum + (s.maxExam ?? s.maxPeriod * 2), 0) ?? 0
)

// --- Members (teachers tab) ---
const members = ref<Member[]>([])

onMounted(async () => {
  loadingSections.value = true
  const [years, mems] = await Promise.all([
    api.academicYears.list().catch(() => []),
    api.members.list().catch(() => []),
  ])
  members.value = mems
  if (years.length > 0) {
    yearId.value = years[0]!.id
    yearLabel.value = years[0]!.label
    sections.value = await api.classSections.list(yearId.value).catch(() => [])
    if (sections.value.length > 0) selectedId.value = sections.value[0]!.id
  }
  loadingSections.value = false
})

// --- Create section ---
const showCreateSection = ref(false)
const creatingSec = ref(false)
const createSectionError = ref('')
const newSection = ref({ level: '', option: '', name: '' })

async function createSection() {
  if (!yearId.value || !newSection.value.name || !newSection.value.level) return
  creatingSec.value = true
  createSectionError.value = ''
  try {
    const sectionDto: Parameters<typeof api.classSections.create>[1] = {
      level: newSection.value.level,
      name: newSection.value.name,
    }
    if (newSection.value.option) sectionDto.option = newSection.value.option
    const created = await api.classSections.create(yearId.value, sectionDto)
    sections.value.push({ ...created, subjects: [] })
    selectedId.value = created.id
    showCreateSection.value = false
    newSection.value = { level: '', option: '', name: '' }
  } catch {
    createSectionError.value = 'Erreur lors de la création. Réessayez.'
  } finally {
    creatingSec.value = false
  }
}

// --- Add subject ---
const showAddSubject = ref(false)
const addingSubject = ref(false)
const addSubjectError = ref('')
const newSubject = ref({ name: '', maxPeriod: 10, maxExam: undefined as number | undefined })

async function addSubject() {
  if (!selectedId.value || !newSubject.value.name) return
  addingSubject.value = true
  addSubjectError.value = ''
  try {
    const subjectDto: Parameters<typeof api.subjects.create>[1] = {
      name: newSubject.value.name,
      maxPeriod: newSubject.value.maxPeriod,
    }
    if (newSubject.value.maxExam !== undefined) subjectDto.maxExam = newSubject.value.maxExam
    const created = await api.subjects.create(selectedId.value, subjectDto)
    const sec = sections.value.find(s => s.id === selectedId.value)
    if (sec) sec.subjects.push(created)
    showAddSubject.value = false
    newSubject.value = { name: '', maxPeriod: 10, maxExam: undefined }
  } catch {
    addSubjectError.value = 'Erreur. Réessayez.'
  } finally {
    addingSubject.value = false
  }
}

// --- Role display ---
const roleLabels: Record<string, string> = {
  owner: 'Promoteur',
  director: 'Préfet',
  bursar: 'Économe',
  secretary: 'Secrétaire',
  teacher: 'Professeur',
  class_teacher: 'Titulaire',
}
function roleLabel(role: string) { return roleLabels[role] ?? role }
</script>

<style scoped>
.page { padding: 32px; }

.page-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--k-border); margin-bottom: 24px; }
.tab-btn { padding: 10px 20px; border: none; background: none; font-size: 14px; font-weight: 500; color: var(--k-text-muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; }
.tab-btn.active { color: var(--k-navy); border-bottom-color: var(--k-navy); font-weight: 600; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
h2 { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; color: var(--k-navy); margin: 0; }
h3 { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0 0 14px; }

.create-card { background: #f9fafb; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 16px 20px; margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 12px; }
.field { display: flex; flex-direction: column; gap: 5px; }
label { font-size: 12px; font-weight: 600; color: #374151; }
.input { border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 10px; font-size: 13.5px; font-family: inherit; color: var(--k-text); background: #fff; }
.input:focus { outline: none; border-color: var(--k-blue); }
.input[readonly] { background: #f9fafb; color: #6b7280; }
.form-actions { display: flex; gap: 8px; justify-content: flex-end; }
.form-error { font-size: 13px; color: #dc2626; margin: 0 0 8px; }

.loading-text { color: #9ca3af; font-size: 14px; padding: 32px 0; }

.classes-layout { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }
.class-list { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 8px; }
.list-group-label { font-size: 10px; font-weight: 700; letter-spacing: .08em; color: var(--k-text-muted); padding: 10px 12px 4px; margin: 0; }
.list-empty { font-size: 13px; color: #9ca3af; padding: 16px 12px; margin: 0; }
.class-item { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 6px; border: none; background: none; cursor: pointer; font-size: 13.5px; color: #374151; text-align: left; }
.class-item:hover { background: #f5f7fa; }
.class-item.selected { background: var(--k-navy); color: #fff; font-weight: 600; }
.class-count { font-size: 12px; opacity: .7; }

.class-detail { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 24px; }
.class-detail--empty { display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 14px; }
.detail-form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }

.courses-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.data-table th { text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 600; color: var(--k-text-muted); border-bottom: 1px solid var(--k-border); text-transform: uppercase; letter-spacing: .04em; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid var(--k-border); color: var(--k-text); }
.empty-cell { color: #9ca3af; font-size: 13px; text-align: center; padding: 20px 12px !important; }
.row-total td { border-top: 2px solid var(--k-border); border-bottom: none; }

.info-box { display: flex; gap: 12px; border-radius: 8px; padding: 14px 16px; margin-top: 16px; font-size: 13px; }
.info-box-blue { background: var(--k-sky); color: var(--k-navy); }
.info-icon { font-size: 16px; flex-shrink: 0; }

.card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 0; overflow: hidden; }

.badge { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
.badge-success { background: #dcfce7; color: #166534; }
.badge-orange { background: #fff7ed; color: #9a3412; }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent; font-family: inherit; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn-navy { background: var(--k-navy); color: #fff; border-color: var(--k-navy); }
.btn-outline { background: #fff; color: var(--k-navy); border-color: #d1d5db; }
</style>

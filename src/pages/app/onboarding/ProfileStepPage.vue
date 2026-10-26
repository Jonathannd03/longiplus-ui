<template>
  <div class="step-page">
    <div class="step-breadcrumb">
      <RouterLink to="/app/onboarding" class="breadcrumb-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Démarrage
      </RouterLink>
    </div>

    <div class="step-layout">
      <div class="step-form">
        <p class="eyebrow">ÉTAPE 1 SUR 6 · PROFIL DE L'ÉCOLE</p>
        <h1 class="page-title">Identité</h1>

        <!-- Logo + SMS preview inline -->
        <div class="form-section">
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Logo de l'école</label>
              <div class="logo-upload">
                <div class="logo-preview">
                  <span class="logo-initials">CM</span>
                </div>
                <div class="logo-upload__info">
                  <button class="btn btn--ghost btn--sm">Choisir une image</button>
                  <p class="form-hint">PNG ou JPG, carré. Il apparaît sur les bulletins et les listes.</p>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Nom officiel</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="Complexe Scolaire Mwinda" />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">
                Nom court (SMS)
                <span class="char-count" :class="{ 'char-count--over': form.shortName.length > 11 }">
                  {{ form.shortName.length }}/11
                </span>
              </label>
              <input v-model="form.shortName" type="text" class="form-input" maxlength="11" placeholder="CS MWINDA" />
              <p class="form-hint">11 caractères. Utilisé dans les SMS aux parents.</p>
            </div>

            <div class="form-group">
              <label class="form-label">N° d'agrément EPST</label>
              <input v-model="form.epst" type="text" class="form-input" placeholder="KIN/EPS/…" />
              <p class="form-hint">Modifiable plus tard dans Équipe et paramètres.</p>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Adresse et contact</h3>
          <div class="form-row-3">
            <div class="form-group">
              <label class="form-label">Ville</label>
              <input v-model="form.city" type="text" class="form-input" placeholder="Kinshasa" />
            </div>
            <div class="form-group">
              <label class="form-label">Commune</label>
              <input v-model="form.commune" type="text" class="form-input" placeholder="Lingwala" />
            </div>
            <div class="form-group">
              <label class="form-label">Adresse</label>
              <input v-model="form.address" type="text" class="form-input" placeholder="Av. de l'Équateur, n°4" />
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Téléphone du bureau</label>
              <input v-model="form.phone" type="tel" class="form-input" placeholder="+243 81 ••• 00 12" />
            </div>
            <div class="form-group">
              <label class="form-label">E-mail (facultatif)</label>
              <input v-model="form.email" type="email" class="form-input" placeholder="direction@csmwinda.cd" />
            </div>
          </div>
          <p class="form-hint">Affiché aux parents pour les questions.</p>
        </div>

        <div class="form-section">
          <h3 class="section-title">Niveaux enseignés</h3>
          <div class="levels-grid">
            <label v-for="level in levels" :key="level.id" class="level-chip" :class="{ 'level-chip--active': form.levels.includes(level.id) }">
              <input type="checkbox" :value="level.id" v-model="form.levels" class="sr-only" />
              {{ level.label }}
            </label>
          </div>
          <p class="form-hint mt-8">LongiPlus prépare les classes et les cours de chaque option à l'étape 3.</p>
        </div>

        <p v-if="error" class="form-error">{{ error }}</p>
        <div class="step-actions">
          <RouterLink to="/app/onboarding" class="btn btn--ghost">Annuler</RouterLink>
          <button class="btn btn--navy" :disabled="saving" @click="save">
            {{ saving ? 'Enregistrement…' : 'Enregistrer et continuer' }}
          </button>
        </div>
      </div>

      <!-- Preview panel -->
      <aside class="step-preview">
        <div class="preview-card">
          <p class="preview-label">APERÇU SUR LE BULLETIN</p>
          <div class="bulletin-header">
            <div class="bulletin-logo">
              <span class="logo-initials logo-initials--sm">CM</span>
            </div>
            <div class="bulletin-school-info">
              <p class="bulletin-school-name">{{ form.name || 'Complexe Scolaire Mwinda' }}</p>
              <p class="bulletin-school-sub">{{ form.commune || 'Lingwala' }}, {{ form.city || 'Kinshasa' }} · {{ form.phone || '+243 81 ••• 00 12' }}</p>
            </div>
          </div>
        </div>

        <div class="preview-card">
          <p class="preview-label">APERÇU DANS UN SMS</p>
          <div class="sms-bubble">
            <p class="sms-text">
              LongiPlus : Grace est inscrite à {{ form.shortName || 'CS MWINDA' }}. Code élève : 2041 3378 5.
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSchoolStore } from '@/stores/school'
import { useSetupApi } from '@/api/setup'

const schoolStore = useSchoolStore()
const router = useRouter()
const api = useSetupApi()

const saving = ref(false)
const error = ref('')

const form = reactive({
  name: schoolStore.school.name,
  shortName: 'CS MWINDA',
  epst: '',
  province: 'Kinshasa',
  city: 'Kinshasa',
  commune: schoolStore.school.commune,
  address: '',
  phone: '',
  email: '',
  levels: ['primaire', 'secondaire'] as string[],
})

const levels = [
  { id: 'maternelle', label: 'Maternelle' },
  { id: 'primaire', label: 'Primaire · 1re à 6e' },
  { id: 'secondaire_sciences', label: 'Humanités · 1re à 4e' },
  { id: 'secondaire_7_8', label: 'Secondaire · 7e et 8e' },
]

async function save() {
  saving.value = true
  error.value = ''
  try {
    await api.school.update({
      name: form.name,
      province: form.province,
      city: form.city,
      address: form.address || undefined,
      contactPhone: form.phone || undefined,
    })
    const step = schoolStore.onboardingSteps.find(s => s.id === 1)
    if (step) step.done = true
    schoolStore.onboardingStep = 2
    router.push('/app/onboarding')
  } catch (e) {
    error.value = 'Erreur lors de la sauvegarde. Réessayez.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.step-page { padding: 32px; max-width: 1300px; }

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
  margin: 0 0 28px;
}

.step-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 32px;
  align-items: start;
}

.form-section {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 20px;
  margin-bottom: 16px;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0 0 16px;
}

.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-input {
  padding: 9px 12px;
  border: 1px solid var(--k-border);
  border-radius: 7px;
  font-size: 14px;
  color: #1a1a2e;
  outline: none;
  transition: border-color 0.15s;
}

.form-input:focus { border-color: var(--k-blue); }

.form-hint { font-size: 12px; color: #9ca3af; margin: 0; }
.form-error { font-size: 13px; color: #dc2626; margin: 0 0 12px; }
.mt-8 { margin-top: 8px; }

.char-count { font-weight: 400; color: #9ca3af; margin-left: auto; }
.char-count--over { color: #ef4444; }

.logo-upload { display: flex; align-items: center; gap: 12px; }

.logo-preview {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: var(--k-sky);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-initials {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--k-navy);
}

.logo-initials--sm { font-size: 14px; }

.logo-upload__info { display: flex; flex-direction: column; gap: 6px; }

.levels-grid { display: flex; flex-wrap: wrap; gap: 8px; }

.level-chip {
  padding: 7px 14px;
  border: 1.5px solid var(--k-border);
  border-radius: 20px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.level-chip--active {
  border-color: var(--k-navy);
  background: var(--k-sky);
  color: var(--k-navy);
  font-weight: 600;
}

.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

.step-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

/* Preview */
.step-preview { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; }

.preview-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 16px;
}

.preview-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin: 0 0 12px;
}

.bulletin-header { display: flex; align-items: center; gap: 10px; }

.bulletin-logo {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: var(--k-sky);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bulletin-school-name { font-weight: 700; font-size: 13px; color: #1a1a2e; margin: 0 0 2px; }
.bulletin-school-sub  { font-size: 11px; color: #6b7280; margin: 0; }

.sms-bubble {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 10px 14px;
}

.sms-text { font-size: 13px; color: #374151; margin: 0; line-height: 1.5; }
</style>

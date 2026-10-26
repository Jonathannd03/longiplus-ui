<template>
  <div class="reg-layout">
    <!-- LEFT PANEL -->
    <div class="reg-left">
      <div class="reg-left__header">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="40" style="filter: brightness(0) invert(1)" />
        <RouterLink to="/login" class="reg-mobile-login">Se connecter</RouterLink>
      </div>
      <div class="reg-left__body">
        <p class="reg-eyebrow">INSCRIRE VOTRE ÉCOLE</p>
        <h2 class="reg-left__title">4 étapes, environ 10 minutes.</h2>
        <ul class="reg-steps">
          <li v-for="s in regSteps" :key="s.n" class="reg-step" :class="regStepClass(s.n)">
            <span class="reg-step__dot">
              <svg v-if="currentStep > s.n" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span v-else>{{ s.n }}</span>
            </span>
            <span class="reg-step__label">{{ s.label }}</span>
          </li>
        </ul>
        <p class="reg-left__note">{{ leftNote }}</p>
      </div>
      <div class="reg-circle"></div>
      <div class="reg-arcs">
        <span class="arc arc--1"></span>
        <span class="arc arc--2"></span>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="reg-right">
      <div class="reg-right__wrap">

        <div class="reg-step-header">
          <span class="reg-step-label">Étape {{ currentStep }} sur 4</span>
          <RouterLink to="/login" class="link reg-login-link">Déjà inscrit ? Se connecter</RouterLink>
        </div>

        <!-- ── STEP 1 ── -->
        <template v-if="currentStep === 1">
          <p class="eyebrow">INSCRIPTION</p>
          <h1 class="page-title">Vous et votre école</h1>
          <p class="page-sub">Ces informations servent à créer le compte de l'école. Le promoteur ou le préfet remplit ce formulaire.</p>

          <div class="form-card">
            <h3 class="card-subtitle">Vous</h3>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Nom complet</label>
                <input v-model="form.fullName" type="text" class="form-input" placeholder="Albert Mwinda" />
              </div>
              <div class="form-group">
                <label class="form-label">Votre rôle</label>
                <select v-model="form.role" class="form-input">
                  <option value="">Sélectionner</option>
                  <option>Promoteur</option>
                  <option>Préfet</option>
                  <option>Directeur</option>
                </select>
              </div>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <input v-model="form.phone" type="tel" class="form-input" placeholder="+243 81 234 0012" />
                <p class="form-hint">Un code de vérification part sur ce numéro.</p>
              </div>
              <div class="form-group">
                <label class="form-label">E-mail (facultatif)</label>
                <input v-model="form.email" type="email" class="form-input" placeholder="vous@exemple.cd" />
              </div>
            </div>
          </div>

          <div class="form-card">
            <h3 class="card-subtitle">L'école</h3>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Nom officiel de l'école</label>
                <input v-model="form.schoolName" type="text" class="form-input" placeholder="Complexe Scolaire Mwinda" />
              </div>
              <div class="form-group">
                <label class="form-label">Ville</label>
                <select v-model="form.city" class="form-input">
                  <option value="">Sélectionner</option>
                  <option>Kinshasa</option>
                  <option>Lubumbashi</option>
                  <option>Goma</option>
                  <option>Mbuji-Mayi</option>
                  <option>Kananga</option>
                  <option>Bukavu</option>
                </select>
              </div>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Commune</label>
                <input v-model="form.commune" type="text" class="form-input" placeholder="Lingwala" />
              </div>
              <div class="form-group">
                <label class="form-label">Nombre d'élèves</label>
                <select v-model="form.studentCount" class="form-input">
                  <option>Moins de 150</option>
                  <option>150 à 300</option>
                  <option>300 à 500</option>
                  <option>500 à 1 000</option>
                  <option>Plus de 1 000</option>
                </select>
                <p class="form-hint">Une estimation suffit.</p>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Niveaux enseignés</label>
              <div class="levels-row">
                <label v-for="l in levelOptions" :key="l.id" class="level-chip" :class="{ 'level-chip--on': form.levels.includes(l.id) }">
                  <input type="checkbox" :value="l.id" v-model="form.levels" class="sr-only" />
                  {{ l.label }}
                </label>
              </div>
            </div>
          </div>

          <label class="checkbox-row">
            <input v-model="form.accepted" type="checkbox" class="checkbox-input" />
            <span class="checkbox-text">J'accepte les <a href="#" class="link">conditions d'utilisation</a> et la <a href="#" class="link">politique de confidentialité</a> de LongiPlus.</span>
          </label>

          <div class="form-actions">
            <button class="btn btn--navy form-btn-full" :disabled="!canStep1" @click="go(2)">Continuer</button>
          </div>
        </template>

        <!-- ── STEP 2 ── -->
        <template v-else-if="currentStep === 2">
          <p class="eyebrow">INSCRIPTION</p>
          <h1 class="page-title">Vérifier votre téléphone</h1>
          <p class="page-sub">Nous avons envoyé un code à 6 chiffres au <strong>{{ form.phone || '+243 81 234 0012' }}</strong>.</p>

          <div class="otp-card">
            <p class="otp-title">Code reçu par SMS</p>
            <div class="otp-boxes">
              <input
                v-for="(_, i) in otpDigits"
                :key="i"
                :ref="(el) => { if (el) otpRefs[i] = el as HTMLInputElement }"
                v-model="otpDigits[i]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="otp-box"
                :class="{ 'otp-box--filled': otpDigits[i] }"
                @input="onOtpInput(i)"
                @keydown.backspace="onOtpBack(i)"
              />
            </div>
            <div class="otp-footer">
              <span class="otp-countdown">Renvoyer le code dans {{ otpCountdown }}</span>
              <a href="#" class="link">Changer de numéro</a>
            </div>
          </div>

          <div class="sms-bubble-card">
            <p class="sms-bubble__sender">LONGIPLUS</p>
            <p class="sms-bubble__text">Votre code LongiPlus : {{ otpDigits.slice(0,4).join('') || '370 5' }}••. Il expire dans 10 minutes. Ne le partagez avec personne.</p>
          </div>

          <div class="info-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0160D3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <p class="info-box__title">Pas de SMS ?</p>
              <p class="info-box__text">Vérifiez le réseau, attendez 1 minute, puis demandez un appel vocal avec le code.</p>
            </div>
          </div>

          <div class="form-actions form-actions--between">
            <button class="btn btn--ghost" @click="go(1)">Retour</button>
            <button class="btn btn--navy" :disabled="otpDigits.some(d => !d)" @click="go(3)">Vérifier et continuer</button>
          </div>
        </template>

        <!-- ── STEP 3 ── -->
        <template v-else-if="currentStep === 3">
          <p class="eyebrow">INSCRIPTION</p>
          <h1 class="page-title">Documents de l'école</h1>
          <p class="page-sub">Une photo nette avec le téléphone suffit. PDF, JPG ou PNG, 10 Mo au plus.</p>

          <div class="form-card">
            <h3 class="card-subtitle">Identification</h3>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">N° d'agrément EPST</label>
                <input v-model="form.epst" type="text" class="form-input" placeholder="[N° D'AGRÉMENT]" />
                <p class="form-hint">Sur l'arrêté d'agrément de l'école.</p>
              </div>
              <div class="form-group">
                <label class="form-label">Adresse</label>
                <input v-model="form.address" type="text" class="form-input" :placeholder="`[AVENUE ET NUMÉRO], ${form.commune || 'Lingwala'}`" />
              </div>
            </div>
          </div>

          <div class="form-card">
            <h3 class="card-subtitle">Pièces à joindre</h3>
            <div class="doc-list">
              <div v-for="doc in docs" :key="doc.id" class="doc-row">
                <span class="doc-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </span>
                <div class="doc-info">
                  <p class="doc-name">{{ doc.name }}</p>
                  <p class="doc-desc">{{ doc.desc }}</p>
                </div>
                <div class="doc-action">
                  <span v-if="doc.state === 'done'" class="doc-badge doc-badge--done">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Ajouté
                  </span>
                  <span v-else-if="doc.state === 'uploading'" class="doc-badge doc-badge--uploading">Envoi {{ doc.pct }}%</span>
                  <button v-else class="btn btn--ghost btn--sm" @click="doc.state = 'uploading'; doc.pct = 64">Ajouter</button>
                </div>
              </div>
            </div>
          </div>

          <p v-if="submitError" class="form-error">{{ submitError }}</p>
          <div class="form-actions form-actions--between">
            <button class="btn btn--ghost" @click="go(2)">Retour</button>
            <button class="btn btn--navy" :disabled="submitting" @click="submitRegistration">
              {{ submitting ? 'Envoi en cours…' : 'Envoyer la demande' }}
            </button>
          </div>
        </template>

        <!-- ── STEP 4 (Confirmation) ── -->
        <template v-else>
          <div class="confirm-check">
            <div class="confirm-check__circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
          <p class="eyebrow">DEMANDE DEM-{{ demId }}</p>
          <h1 class="page-title">Votre demande est envoyée</h1>
          <p class="page-sub">Merci, {{ form.fullName || 'M. Mwinda' }}. L'équipe LongiPlus vérifie les informations de {{ form.schoolName || 'C.S. Mwinda' }}.</p>

          <div class="form-card">
            <h3 class="card-subtitle">Suivi</h3>
            <ul class="timeline">
              <li class="tl-item tl-item--done">
                <span class="tl-dot"></span>
                <div>
                  <p class="tl-title">Demande reçue</p>
                  <p class="tl-sub">{{ sentAt }}</p>
                </div>
              </li>
              <li class="tl-item tl-item--active">
                <span class="tl-dot"></span>
                <div>
                  <p class="tl-title">Vérification des documents</p>
                  <p class="tl-sub">Sous 48 heures ouvrées</p>
                </div>
              </li>
              <li class="tl-item">
                <span class="tl-dot"></span>
                <div>
                  <p class="tl-title">Appel de votre agent LongiPlus</p>
                  <p class="tl-sub">Il fixe avec vous une visite à l'école</p>
                </div>
              </li>
              <li class="tl-item">
                <span class="tl-dot"></span>
                <div>
                  <p class="tl-title">Compte activé</p>
                  <p class="tl-sub">SMS avec le lien pour créer votre mot de passe</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="confirm-banners">
            <div class="confirm-banner confirm-banner--warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <div>
                <p class="confirm-banner__title">Document manquant</p>
                <p class="confirm-banner__text">Photo de la façade. Ajoutez-la pour aller plus vite. <a href="#" class="link">Ajouter</a></p>
              </div>
            </div>
            <div class="confirm-banner confirm-banner--info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 15a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 10c1.43 2.9 3.97 5.29 6.91 6.71l.69-.69a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18v2.92z"/></svg>
              <div>
                <p class="confirm-banner__title">Une question ?</p>
                <p class="confirm-banner__text">WhatsApp LongiPlus : [NUMÉRO SUPPORT]</p>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <RouterLink to="/" class="btn btn--ghost">Retour au site</RouterLink>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue'
import { publicApi, type RegisterApplyDto } from '@/api/setup'

const currentStep = ref(1)

const regSteps = [
  { n: 1, label: 'Vous et votre école' },
  { n: 2, label: 'Vérifier votre téléphone' },
  { n: 3, label: 'Documents de l\'école' },
  { n: 4, label: 'Validation par LongiPlus' },
]

const leftNotes = [
  'Un agent LongiPlus vous appelle sous 48 heures pour vérifier les informations et préparer la mise en route.',
  'Le numéro vérifié devient le compte du promoteur. Il reçoit aussi les codes de connexion.',
  'Les documents servent seulement à vérifier que l\'école existe. Ils ne sont jamais montrés aux parents.',
  'Vous recevez un SMS à chaque étape. Vous pouvez fermer cette page.',
]

const leftNote = computed(() => leftNotes[currentStep.value - 1])

function regStepClass(n: number) {
  if (n < currentStep.value) return 'reg-step--done'
  if (n === currentStep.value) return 'reg-step--active'
  return ''
}

const levelOptions = [
  { id: 'maternelle', label: 'Maternelle' },
  { id: 'primaire', label: 'Primaire' },
  { id: 'secondaire', label: 'Secondaire' },
]

const form = reactive({
  fullName: '',
  role: '',
  phone: '',
  email: '',
  schoolName: '',
  city: '',
  commune: '',
  studentCount: 'Moins de 150',
  levels: [] as string[],
  accepted: false,
  epst: '',
  address: '',
})

const canStep1 = computed(() =>
  form.fullName.trim() !== '' &&
  form.phone.trim() !== '' &&
  form.schoolName.trim() !== '' &&
  form.accepted
)

const otpDigits = reactive(['', '', '', '', '', ''])
const otpRefs: HTMLInputElement[] = []

const otpSeconds = ref(60)
const otpCountdown = computed(() => {
  const m = Math.floor(otpSeconds.value / 60)
  const s = otpSeconds.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})
let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  otpSeconds.value = 60
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    if (otpSeconds.value > 0) {
      otpSeconds.value--
    } else {
      clearInterval(countdownTimer!)
      countdownTimer = null
    }
  }, 1000)
}

onUnmounted(() => { if (countdownTimer) clearInterval(countdownTimer) })

function onOtpInput(i: number) {
  const val = (otpDigits[i] ?? '').replace(/\D/g, '')
  otpDigits[i] = val.slice(-1)
  if (val && i < 5) otpRefs[i + 1]?.focus()
}

function onOtpBack(i: number) {
  if (!otpDigits[i] && i > 0) {
    otpDigits[i - 1] = ''
    otpRefs[i - 1]?.focus()
  }
}

const docs = reactive([
  { id: 1, name: 'Arrêté d\'agrément de l\'école', desc: 'Le document officiel EPST', state: 'done', pct: 100 },
  { id: 2, name: 'Pièce d\'identité du promoteur', desc: 'Carte d\'électeur ou passeport', state: 'uploading', pct: 64 },
  { id: 3, name: 'Photo de la façade de l\'école', desc: 'Avec le nom de l\'école visible', state: 'none', pct: 0 },
  { id: 4, name: 'Liste des élèves (facultatif)', desc: 'Excel ou photo. Elle accélère la mise en route.', state: 'none', pct: 0 },
])

const demId = ref('2026-0148')
const submitting = ref(false)
const submitError = ref('')
const sentAt = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' +
    now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
})

const cityToProvince: Record<string, string> = {
  'Kinshasa': 'Kinshasa',
  'Lubumbashi': 'Haut-Katanga',
  'Goma': 'Nord-Kivu',
  'Mbuji-Mayi': 'Kasaï-Oriental',
  'Kananga': 'Kasaï-Central',
  'Bukavu': 'Sud-Kivu',
}

const studentCountMap: Record<string, number> = {
  'Moins de 150': 100,
  '150 à 300': 225,
  '300 à 500': 400,
  '500 à 1 000': 750,
  'Plus de 1 000': 1000,
}

async function submitRegistration() {
  submitting.value = true
  submitError.value = ''
  try {
    const dto: RegisterApplyDto = {
      schoolName: form.schoolName,
      province: cityToProvince[form.city] ?? form.city,
      city: form.city,
      ...(form.commune || form.address ? { address: [form.address, form.commune].filter(Boolean).join(', ') } : {}),
      directorName: form.fullName,
      directorPhone: form.phone,
      ...(form.email ? { email: form.email } : {}),
      estimatedStudents: studentCountMap[form.studentCount] ?? 100,
    }
    const result = await publicApi.register.apply(dto)
    demId.value = result.id.replace(/-/g, '').slice(-8).toUpperCase()
    go(4)
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Erreur lors de l\'envoi. Veuillez réessayer.'
  } finally {
    submitting.value = false
  }
}

function go(n: number) {
  if (n === 2) startCountdown()
  currentStep.value = n
  window.scrollTo(0, 0)
}
</script>

<style scoped>
/* ── LAYOUT ── */
.reg-layout {
  display: flex;
  min-height: 100vh;
}

/* ── LEFT PANEL ── */
.reg-left {
  width: 38%;
  min-width: 280px;
  background: var(--k-navy);
  display: flex;
  flex-direction: column;
  padding: 40px 40px 0;
  position: relative;
  overflow: hidden;
}

.reg-left__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.reg-mobile-login { display: none; }

.reg-left__body {
  margin-top: 48px;
  position: relative;
  z-index: 2;
  flex: 1;
}

.reg-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--k-orange);
  margin: 0 0 10px;
}

.reg-left__title {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 28px;
  line-height: 1.3;
}

.reg-steps {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.reg-step {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reg-step__dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  flex-shrink: 0;
}

.reg-step--active .reg-step__dot {
  background: var(--k-yellow);
  color: #1a1a2e;
}

.reg-step--done .reg-step__dot {
  background: var(--k-yellow);
}

.reg-step__label {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  font-weight: 500;
}

.reg-step--active .reg-step__label {
  color: #fff;
  font-weight: 600;
}

.reg-step--done .reg-step__label {
  color: rgba(255,255,255,0.8);
}

.reg-left__note {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  line-height: 1.6;
  margin: 0;
}

/* decorations */
.reg-circle {
  position: absolute;
  right: -80px;
  top: 38%;
  width: 220px;
  height: 220px;
  background: var(--k-yellow);
  border-radius: 50%;
  z-index: 1;
}

.reg-arcs {
  position: absolute;
  bottom: -60px;
  left: -20px;
  z-index: 1;
}

.arc {
  position: absolute;
  border-radius: 50%;
  border: 3px solid rgba(1, 96, 211, 0.55);
  display: block;
}

.arc--1 { width: 180px; height: 180px; left: 20px; bottom: 30px; }
.arc--2 { width: 260px; height: 260px; left: -20px; bottom: -10px; }

/* ── RIGHT PANEL ── */
.reg-right {
  flex: 1;
  background: #fafafa;
  display: flex;
  justify-content: center;
  padding: 48px 40px;
  overflow-y: auto;
}

.reg-right__wrap {
  width: 100%;
  max-width: 560px;
}

.reg-step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.reg-step-label {
  font-size: 13px;
  color: #6b7280;
}

.reg-login-link { font-size: 13px; }

/* ── SHARED FORM STYLES ── */
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
  font-size: 26px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.page-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px;
  line-height: 1.6;
}

.form-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.card-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0 0 16px;
}

.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 10px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a2e;
  background: #fff;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus { border-color: var(--k-blue); }

.form-hint { font-size: 12px; color: #9ca3af; margin: 0; }

.levels-row { display: flex; flex-wrap: wrap; gap: 8px; }

.level-chip {
  padding: 7px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 20px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.level-chip--on {
  border-color: var(--k-navy);
  background: var(--k-sky);
  color: var(--k-navy);
  font-weight: 600;
}

.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
  cursor: pointer;
}

.checkbox-input {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  accent-color: var(--k-navy);
  flex-shrink: 0;
}

.checkbox-text { font-size: 13px; color: #374151; line-height: 1.5; }

.form-actions { margin-top: 4px; }
.form-actions--between { display: flex; justify-content: space-between; align-items: center; }
.form-btn-full { width: 100%; }

.form-error { font-size: 13px; color: #dc2626; margin: 0 0 8px; padding: 8px 12px; background: #fef2f2; border-radius: 6px; }

/* ── OTP ── */
.otp-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.otp-title {
  font-weight: 600;
  font-size: 15px;
  color: #1a1a2e;
  margin: 0 0 18px;
}

.otp-boxes {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.otp-box {
  width: 50px;
  height: 60px;
  border: 2px solid #d1d5db;
  border-radius: 10px;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #1a1a2e;
  outline: none;
  transition: border-color 0.15s;
  font-family: 'IBM Plex Mono', monospace;
}

.otp-box:focus { border-color: var(--k-blue); }
.otp-box--filled { border-color: var(--k-navy); }

.otp-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.otp-countdown { font-size: 13px; color: #6b7280; }

.sms-bubble-card {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.sms-bubble__sender {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #374151;
  margin: 0 0 4px;
}

.sms-bubble__text {
  font-size: 13px;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

.info-box {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: var(--k-sky);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 24px;
}

.info-box__title { font-weight: 600; font-size: 13px; color: var(--k-navy); margin: 0 0 3px; }
.info-box__text  { font-size: 12px; color: #374151; margin: 0; line-height: 1.5; }

/* ── DOCUMENTS ── */
.doc-list { display: flex; flex-direction: column; }

.doc-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.doc-row:last-child { border-bottom: none; }

.doc-icon-wrap { flex-shrink: 0; }

.doc-info { flex: 1; }
.doc-name { font-size: 13px; font-weight: 600; color: #1a1a2e; margin: 0 0 2px; }
.doc-desc { font-size: 12px; color: #9ca3af; margin: 0; }

.doc-action { flex-shrink: 0; }

.doc-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 20px;
}

.doc-badge--done { background: #dcfce7; color: #15803d; }
.doc-badge--uploading { background: #fff3cd; color: #b45309; }

/* ── CONFIRMATION ── */
.confirm-check {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.confirm-check__circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #dcfce7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tl-item {
  display: flex;
  gap: 16px;
  padding: 14px 0;
  position: relative;
}

.tl-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 34px;
  bottom: -10px;
  width: 2px;
  background: #e5e7eb;
}

.tl-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e5e7eb;
  flex-shrink: 0;
  margin-top: 1px;
}

.tl-item--done .tl-dot { background: #15803d; }
.tl-item--active .tl-dot { background: var(--k-yellow); }

.tl-title { font-size: 13px; font-weight: 600; color: #1a1a2e; margin: 0 0 2px; }
.tl-sub   { font-size: 12px; color: #6b7280; margin: 0; }

.confirm-banners {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.confirm-banner {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px;
  border-radius: 10px;
}

.confirm-banner--warning { background: var(--k-cream); }
.confirm-banner--info    { background: var(--k-cream); }

.confirm-banner__title { font-size: 13px; font-weight: 600; color: #1a1a2e; margin: 0 0 3px; }
.confirm-banner__text  { font-size: 12px; color: #374151; margin: 0; line-height: 1.5; }

/* ── RESPONSIVE (mobile) ── */
@media (max-width: 768px) {
  .reg-layout { flex-direction: column; }

  .reg-left {
    width: 100%;
    min-width: unset;
    padding: 20px 20px 32px;
  }

  .reg-left__body { margin-top: 20px; }
  .reg-circle { display: none; }
  .reg-arcs  { display: none; }

  .reg-mobile-login {
    display: block;
    color: rgba(255,255,255,0.8);
    font-size: 13px;
    text-decoration: none;
  }

  .reg-login-link { display: none; }

  .reg-right { padding: 24px 20px; }

  .form-row-2 { grid-template-columns: 1fr; }

  .otp-box { width: 42px; height: 52px; font-size: 20px; }

  .confirm-banners { grid-template-columns: 1fr; }
}
</style>

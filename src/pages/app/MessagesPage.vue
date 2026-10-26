<template>
  <div class="page">
    <div class="page-content">
      <p class="eyebrow">SMS AUX PARENTS · {{ totalSentThisMonth.toLocaleString('fr') }} ENVOYÉS CE MOIS</p>
      <h2 class="page-title">Messages et rappels</h2>

      <div class="layout">
        <div class="layout__main">
          <!-- New announcement -->
          <div class="card">
            <h3 class="card__title">Nouvelle annonce</h3>

            <div class="field">
              <label class="field__label">Destinataires</label>
              <div class="pill-tabs">
                <button
                  v-for="tab in audienceTabs"
                  :key="tab.value"
                  class="pill-tab"
                  :class="{ 'pill-tab--active': selectedAudience === tab.value }"
                  @click="selectedAudience = tab.value"
                >{{ tab.label }}</button>
              </div>
              <div v-if="selectedAudience === 'section'" class="sub-select">
                <select v-model="selectedClassId" class="field__select">
                  <option value="">— Choisir une classe —</option>
                  <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <p class="field__help">{{ audienceStats }}</p>
            </div>

            <div class="field">
              <label class="field__label">Message</label>
              <textarea
                v-model="messageText"
                class="field__textarea"
                rows="4"
                maxlength="160"
                placeholder="Votre message SMS aux parents…"
              ></textarea>
              <div class="field__footer">
                <span class="field__help">Français · 1 SMS par famille</span>
                <span class="field__count" :class="{ 'field__count--warn': messageText.length > 140 }">
                  {{ messageText.length }}/160
                </span>
              </div>
            </div>

            <div v-if="sendError" class="error-banner">{{ sendError }}</div>
            <div v-if="sendSuccess" class="success-banner">Annonce envoyée avec succès.</div>

            <div class="actions">
              <button
                class="btn btn--navy"
                :disabled="sending || !messageText.trim() || (selectedAudience === 'section' && !selectedClassId)"
                @click="send"
              >
                {{ sending ? 'Envoi…' : '↗ Envoyer maintenant' }}
              </button>
            </div>
          </div>

          <!-- Log -->
          <div class="card">
            <h3 class="card__title">Derniers envois</h3>
            <div v-if="loadingLog" class="loading-hint">Chargement…</div>
            <table v-else class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Message</th>
                  <th>Audience</th>
                  <th>Destinataires</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="announcements.length === 0">
                  <td colspan="4" style="text-align:center;color:#9ca3af;padding:20px">Aucune annonce envoyée</td>
                </tr>
                <tr v-for="a in announcements" :key="a.id">
                  <td class="td--muted">{{ formatDate(a.createdAt) }}</td>
                  <td>{{ a.message }}</td>
                  <td>{{ a.audience === 'all' ? 'Toute l\'école' : 'Classe' }}</td>
                  <td>
                    <span class="badge badge--success">{{ a.recipientCount }} parent{{ a.recipientCount > 1 ? 's' : '' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="layout__sidebar">
          <!-- SMS preview -->
          <div class="card">
            <p class="eyebrow eyebrow--sm">APERÇU CHEZ LE PARENT</p>
            <div class="sms-bubble">
              <p class="sms-bubble__sender">LONGIPLUS</p>
              <p class="sms-bubble__text">{{ messageText || '…' }}</p>
            </div>
          </div>

          <!-- Auto alerts -->
          <div class="card">
            <h3 class="card__title">Alertes automatiques</h3>
            <div class="alert-list">
              <label v-for="alert in alertItems" :key="alert.key" class="alert-item">
                <input type="checkbox" v-model="alertSettings[alert.key]" class="alert-item__check" />
                <div>
                  <p class="alert-item__title">{{ alert.title }}</p>
                  <p class="alert-item__sub">{{ alert.sub }}</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSetupApi } from '@/api/setup'
import type { Announcement, ClassSection, AcademicYear } from '@/api/setup'

const api = useSetupApi()

const selectedAudience = ref<'all' | 'section'>('all')
const selectedClassId = ref('')
const messageText = ref('')
const sending = ref(false)
const sendError = ref('')
const sendSuccess = ref(false)

const announcements = ref<Announcement[]>([])
const classes = ref<ClassSection[]>([])
const activeYear = ref<AcademicYear | null>(null)
const loadingLog = ref(true)

const audienceTabs = [
  { value: 'all' as const, label: 'Toute l\'école' },
  { value: 'section' as const, label: 'Une classe' },
]

const totalSentThisMonth = computed(() => {
  const now = new Date()
  return announcements.value
    .filter(a => {
      const d = new Date(a.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, a) => sum + a.recipientCount, 0)
})

const audienceStats = computed(() => {
  if (selectedAudience.value === 'all') return 'Tous les parents inscrits dans l\'école'
  if (selectedAudience.value === 'section') {
    if (!selectedClassId.value) return 'Sélectionnez une classe pour voir les destinataires'
    const c = classes.value.find(x => x.id === selectedClassId.value)
    return c ? `Parents de la classe ${c.name}` : ''
  }
  return ''
})

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-CD', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Africa/Kinshasa',
  }).format(new Date(iso))
}

async function send() {
  if (!messageText.value.trim() || !activeYear.value) return
  if (selectedAudience.value === 'section' && !selectedClassId.value) return
  sending.value = true
  sendError.value = ''
  sendSuccess.value = false
  try {
    const dto: Parameters<typeof api.announcements.send>[0] = {
      message: messageText.value.trim(),
      audience: selectedAudience.value,
      yearId: activeYear.value.id,
    }
    if (selectedAudience.value === 'section') dto.classSectionId = selectedClassId.value
    const result = await api.announcements.send(dto)
    announcements.value.unshift(result)
    messageText.value = ''
    sendSuccess.value = true
    setTimeout(() => { sendSuccess.value = false }, 3000)
  } catch (err) {
    sendError.value = 'Erreur lors de l\'envoi. Veuillez réessayer.'
    console.error(err)
  } finally {
    sending.value = false
  }
}

const alertSettings = ref({
  absence3days: true,
  bulletinPublished: true,
  missingNotes: false,
  correctionApproved: true,
  repeatedLate: false,
})

const alertItems = [
  { key: 'absence3days' as const, title: 'Absence 3 jours de suite', sub: 'SMS au parent, copie au titulaire' },
  { key: 'bulletinPublished' as const, title: 'Bulletin publié', sub: 'Lien sécurisé envoyé au parent' },
  { key: 'missingNotes' as const, title: 'Notes manquantes', sub: 'Rappel aux enseignants 3 jours avant la clôture' },
  { key: 'correctionApproved' as const, title: 'Correction approuvée', sub: 'SMS au parent avec la nouvelle version' },
  { key: 'repeatedLate' as const, title: 'Retards répétés', sub: 'Résumé de la semaine au titulaire, pas de SMS' },
]

onMounted(async () => {
  try {
    const [years, log] = await Promise.all([
      api.academicYears.list(),
      api.announcements.list(),
    ])
    const active = years.find(y => y.status === 'active') ?? years[0] ?? null
    activeYear.value = active
    announcements.value = log
    if (active) {
      classes.value = await api.classSections.list(active.id)
    }
  } catch (err) {
    console.error('MessagesPage load error', err)
  } finally {
    loadingLog.value = false
  }
})
</script>

<style scoped>
.page { padding: 32px 36px; }
.page-content { max-width: 1400px; }
.eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
.eyebrow--sm { font-size: 10px; color: var(--k-text-muted); margin-bottom: 10px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 700; color: var(--k-navy); margin: 0 0 24px; }

.layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
.layout__main { display: flex; flex-direction: column; gap: 20px; }
.layout__sidebar { display: flex; flex-direction: column; gap: 16px; }

.card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; }
.card__title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0 0 16px; }

.field { margin-bottom: 16px; }
.field__label { display: block; font-size: 13px; font-weight: 600; color: var(--k-navy); margin-bottom: 6px; }
.field__help { font-size: 12px; color: var(--k-text-muted); margin: 4px 0 0; }
.field__footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.field__count { font-size: 12px; color: var(--k-text-muted); }
.field__count--warn { color: var(--k-orange); font-weight: 600; }

.pill-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
.pill-tab { padding: 5px 12px; border-radius: 20px; border: 1px solid var(--k-border); background: #fff; font-size: 13px; cursor: pointer; color: #374151; transition: all .15s; }
.pill-tab--active { background: var(--k-navy); color: #fff; border-color: var(--k-navy); }

.field__textarea { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 13.5px; resize: vertical; box-sizing: border-box; }
.field__select { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13px; background: #fff; }
.sub-select { margin: 6px 0 4px; }

.loading-hint { color: #9ca3af; font-size: 13px; padding: 12px 0; }
.error-banner { background: #fee2e2; color: #991b1b; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-bottom: 12px; }
.success-banner { background: #dcfce7; color: #166534; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-bottom: 12px; }

.actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
.btn { padding: 9px 18px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; border: none; }
.btn--navy { background: var(--k-navy); color: #fff; }
.btn--navy:disabled { opacity: 0.5; cursor: not-allowed; }

.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th { text-align: left; font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--k-text-muted); padding: 0 12px 8px; border-bottom: 1px solid var(--k-border); }
.table td { padding: 10px 12px; border-bottom: 1px solid var(--k-border); }
.td--muted { color: var(--k-text-muted); white-space: nowrap; }
.badge { display: inline-flex; align-items: center; gap: 3px; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.badge--success { background: #dcfce7; color: #166534; }

.sms-bubble { background: #f3f4f6; border-radius: 10px; padding: 12px 14px; }
.sms-bubble__sender { font-size: 11px; font-weight: 700; color: var(--k-text-muted); text-transform: uppercase; margin: 0 0 4px; }
.sms-bubble__text { font-size: 13px; color: #1f2937; margin: 0; line-height: 1.5; white-space: pre-wrap; }

.alert-list { display: flex; flex-direction: column; gap: 12px; }
.alert-item { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.alert-item__check { margin-top: 2px; flex-shrink: 0; accent-color: var(--k-navy); width: 15px; height: 15px; }
.alert-item__title { font-size: 13px; font-weight: 600; color: var(--k-navy); margin: 0 0 2px; }
.alert-item__sub { font-size: 12px; color: var(--k-text-muted); margin: 0; }
</style>

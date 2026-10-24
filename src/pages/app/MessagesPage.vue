<template>
  <div class="page">
    <div class="page-content">
      <p class="eyebrow">SMS AUX PARENTS · {{ store.totalSentThisMonth.toLocaleString('fr') }} ENVOYÉS CE MOIS</p>
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
              <!-- Sub-selector: Une classe -->
              <div v-if="selectedAudience === 'classe'" class="sub-select">
                <select v-model="selectedClassId" class="field__select">
                  <option value="">— Choisir une classe —</option>
                  <option v-for="c in classesStore.classes" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <!-- Sub-selector: Une famille -->
              <div v-if="selectedAudience === 'famille'" class="sub-select">
                <input type="text" v-model="familySearch" class="field__input" placeholder="Nom de l'élève ou numéro du parent…" />
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
              ></textarea>
              <div class="field__footer">
                <span class="field__help">Français · 1 SMS par famille</span>
                <span class="field__count" :class="{ 'field__count--warn': messageText.length > 140 }">
                  {{ messageText.length }}/160
                </span>
              </div>
            </div>

            <div class="field">
              <label class="field__label">Envoi</label>
              <select class="field__select">
                <option>Lundi 18 janvier, 08:00</option>
                <option>Maintenant</option>
              </select>
              <p class="field__help">Les envois respectent les heures calmes : 08:00 à 19:00, pas le dimanche.</p>
            </div>

            <div class="actions">
              <button class="btn btn--outline">M'envoyer un test</button>
              <button class="btn btn--navy">↗ Programmer l'envoi</button>
            </div>
          </div>

          <!-- Log -->
          <div class="card">
            <h3 class="card__title">Derniers envois</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Message</th>
                  <th>Destinataires</th>
                  <th>Livrés</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in store.smsLog" :key="log.id">
                  <td class="td--muted">{{ log.date }}</td>
                  <td>{{ log.message }}</td>
                  <td>{{ log.recipients }}</td>
                  <td>
                    <span class="badge" :class="log.status === 'ok' ? 'badge--success' : 'badge--warning'">
                      {{ log.status === 'ok' ? '✓' : '⏱' }} {{ log.delivered }} · {{ log.deliveryPercent }} %
                    </span>
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
              <p class="sms-bubble__text">{{ messageText }}</p>
            </div>
          </div>

          <!-- Auto alerts -->
          <div class="card">
            <h3 class="card__title">Alertes automatiques</h3>
            <div class="alert-list">
              <label v-for="alert in alertItems" :key="alert.key" class="alert-item">
                <input type="checkbox" v-model="store.alertSettings[alert.key]" class="alert-item__check" />
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
import { ref, computed } from 'vue'
import { useMessagesStore, useClassesStore } from '@/stores'

const store = useMessagesStore()
const classesStore = useClassesStore()

const selectedAudience = ref('secondaire')
const selectedClassId = ref('')
const familySearch = ref('')
const messageText = ref('LongiPlus : Les examens du 1er semestre commencent le lundi 25 janvier à 7h30. Arrivée des élèves à 7h00 avec leur matériel. C.S. Mwinda')

const audienceTabs = [
  { value: 'ecole', label: 'Toute l\'école' },
  { value: 'secondaire', label: 'Secondaire' },
  { value: 'classe', label: 'Une classe' },
  { value: 'famille', label: 'Une famille' },
]

const audienceStats = computed(() => {
  if (selectedAudience.value === 'ecole') {
    return '412 élèves · 342 familles · 318 numéros valides'
  }
  if (selectedAudience.value === 'secondaire') {
    return '142 élèves · 118 familles · 112 numéros valides'
  }
  if (selectedAudience.value === 'classe') {
    if (!selectedClassId.value) return 'Sélectionnez une classe pour voir le nombre de destinataires'
    const c = classesStore.classes.find(x => x.id === selectedClassId.value)
    if (!c) return ''
    const fam = Math.round(c.studentCount * 0.83)
    const valid = Math.round(fam * 0.95)
    return `${c.studentCount} élèves · ${fam} familles · ${valid} numéros valides`
  }
  if (selectedAudience.value === 'famille') {
    if (!familySearch.value.trim()) return 'Recherchez une famille pour cibler un seul parent'
    return '1 famille · 1 numéro valide'
  }
  return ''
})

const alertItems = [
  { key: 'absence3days' as const, title: 'Absence 3 jours de suite', sub: 'SMS au parent, copie au titulaire' },
  { key: 'bulletinPublished' as const, title: 'Bulletin publié', sub: 'Lien sécurisé envoyé au parent' },
  { key: 'missingNotes' as const, title: 'Notes manquantes', sub: 'Rappel aux enseignants 3 jours avant la clôture' },
  { key: 'correctionApproved' as const, title: 'Correction approuvée', sub: 'SMS au parent avec la nouvelle version' },
  { key: 'repeatedLate' as const, title: 'Retards répétés', sub: 'Résumé de la semaine au titulaire, pas de SMS' },
]
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
.field__input { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13px; font-family: inherit; box-sizing: border-box; }
.sub-select { margin: 6px 0 4px; }

.actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
.btn { padding: 9px 18px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; border: none; }
.btn--outline { background: #fff; border: 1.5px solid var(--k-border); color: var(--k-navy); }
.btn--navy { background: var(--k-navy); color: #fff; }

.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th { text-align: left; font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--k-text-muted); padding: 0 12px 8px; border-bottom: 1px solid var(--k-border); }
.table td { padding: 10px 12px; border-bottom: 1px solid var(--k-border); }
.td--muted { color: var(--k-text-muted); white-space: nowrap; }
.badge { display: inline-flex; align-items: center; gap: 3px; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.badge--success { background: #dcfce7; color: #166534; }
.badge--warning { background: #fff7ed; color: #9a3412; }

.sms-bubble { background: #f3f4f6; border-radius: 10px; padding: 12px 14px; }
.sms-bubble__sender { font-size: 11px; font-weight: 700; color: var(--k-text-muted); text-transform: uppercase; margin: 0 0 4px; }
.sms-bubble__text { font-size: 13px; color: #1f2937; margin: 0; line-height: 1.5; }

.alert-list { display: flex; flex-direction: column; gap: 12px; }
.alert-item { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.alert-item__check { margin-top: 2px; flex-shrink: 0; accent-color: var(--k-navy); width: 15px; height: 15px; }
.alert-item__title { font-size: 13px; font-weight: 600; color: var(--k-navy); margin: 0 0 2px; }
.alert-item__sub { font-size: 12px; color: var(--k-text-muted); margin: 0; }
</style>

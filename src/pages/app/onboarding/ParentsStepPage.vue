<template>
  <div class="step-page">
    <div class="step-breadcrumb">
      <RouterLink to="/app/onboarding" class="breadcrumb-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Démarrage
      </RouterLink>
    </div>

    <p class="eyebrow">ÉTAPE 6 SUR 6 · PRÉVENIR LES PARENTS</p>
    <h1 class="page-title">Prévenir les parents</h1>
    <p class="page-sub">Chaque parent reçoit un SMS avec le code élève et la classe. Rien ne part sans votre accord.</p>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <p class="stat-card__value">612</p>
        <p class="stat-card__label">élèves importés</p>
      </div>
      <div class="stat-card stat-card--highlight">
        <p class="stat-card__value">548</p>
        <p class="stat-card__label">parents à prévenir</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__value">41</p>
        <p class="stat-card__label">sans numéro de téléphone</p>
      </div>
      <div class="stat-card">
        <p class="stat-card__value">23</p>
        <p class="stat-card__label">familles avec plusieurs enfants — 1 SMS chacune</p>
      </div>
    </div>

    <!-- SMS Preview -->
    <div class="preview-section">
      <div class="preview-card">
        <p class="preview-label">APERÇU DU SMS</p>
        <div class="sms-phone">
          <div class="sms-phone__header">
            <span class="sms-phone__sender">LONGIPLUS</span>
          </div>
          <div class="sms-bubble">
            <p class="sms-text">
              LongiPlus : Bonjour. Grace KABONGO est inscrite en 4e Scientifique A à C.S. Mwinda pour l'année 2026-2027. Code élève : 2041 3378 5. Gardez ce code pour les paiements.
            </p>
            <p class="sms-char">~162 caractères · 2 SMS</p>
          </div>
        </div>
      </div>

      <div class="info-panel">
        <div class="info-item info-item--blue">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <p class="info-item__title">Familles avec plusieurs enfants</p>
            <p class="info-item__desc">Un seul SMS par famille, avec tous les enfants inscrits.</p>
          </div>
        </div>
        <div class="info-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <div>
            <p class="info-item__title">41 élèves sans numéro</p>
            <p class="info-item__desc">Vous pourrez les ajouter plus tard dans la fiche de l'élève.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="step-actions">
      <RouterLink to="/app/onboarding" class="btn btn--ghost">Retour</RouterLink>
      <button class="btn btn--navy" :disabled="sent" @click="sendSms">
        <template v-if="!sent">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Envoyer 548 SMS
        </template>
        <template v-else>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          548 SMS envoyés
        </template>
      </button>
    </div>

    <!-- Completion banner -->
    <div v-if="sent" class="completion-banner">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <div>
        <p class="completion-banner__title">Démarrage terminé !</p>
        <p class="completion-banner__sub">C.S. Mwinda est prête pour l'année 2026-2027.</p>
      </div>
      <RouterLink to="/app/dashboard" class="btn btn--navy btn--sm" @click="finish">
        Aller au tableau de bord
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSchoolStore } from '@/stores/school'

const schoolStore = useSchoolStore()
const sent = ref(false)

function sendSms() {
  sent.value = true
  const step = schoolStore.onboardingSteps.find(s => s.id === 6)
  if (step) step.done = true
  schoolStore.onboardingStep = 6
}

function finish() {
  schoolStore.isOnboardingComplete = true
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
  margin: 0 0 6px;
}

.page-sub { font-size: 14px; color: #6b7280; margin: 0 0 24px; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 16px;
  text-align: center;
}

.stat-card--highlight { border-color: var(--k-navy); background: var(--k-sky); }

.stat-card__value {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0 0 4px;
  line-height: 1;
}

.stat-card__label { font-size: 12px; color: #6b7280; margin: 0; line-height: 1.4; }

.preview-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.preview-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 20px;
}

.preview-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin: 0 0 14px;
}

.sms-phone {
  background: #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
}

.sms-phone__header {
  background: #e5e7eb;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sms-phone__sender { font-size: 12px; font-weight: 700; color: #374151; letter-spacing: 0.05em; }

.sms-bubble { padding: 12px; }
.sms-text   { font-size: 13px; color: #374151; margin: 0 0 8px; line-height: 1.6; }
.sms-char   { font-size: 11px; color: #9ca3af; margin: 0; }

.info-panel { display: flex; flex-direction: column; gap: 12px; }

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid var(--k-border);
}

.info-item--blue { background: #E8F1FC; border-color: transparent; }

.info-item__title { font-weight: 600; font-size: 13px; color: #1a1a2e; margin: 0 0 3px; }
.info-item__desc  { font-size: 12px; color: #6b7280; margin: 0; }

.step-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
}

.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btn--sm { padding: 9px 16px; font-size: 13px; }

.completion-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: #dcfce7;
  border: 1.5px solid #86efac;
  border-radius: var(--k-radius);
}

.completion-banner__title {
  font-weight: 700;
  font-size: 15px;
  color: #14532d;
  margin: 0 0 2px;
}

.completion-banner__sub { font-size: 13px; color: #166534; margin: 0; }
.completion-banner .btn { margin-left: auto; flex-shrink: 0; }
</style>

<template>
  <div class="onboarding-page">
    <div class="ob-main">
      <p class="eyebrow">DÉMARRAGE · ÉTAPE {{ schoolStore.onboardingStep }} SUR 6</p>
      <h1 class="page-title">Préparons {{ school.name }} pour la rentrée</h1>
      <p class="page-sub">Six étapes, environ 30 minutes. Vous pouvez vous arrêter et reprendre plus tard.</p>

      <div class="progress-row">
        <div class="progress-bar">
          <div class="progress-bar__fill" :style="{ width: doneCount / 6 * 100 + '%' }"></div>
        </div>
        <span class="progress-label">{{ doneCount }} sur 6 terminées</span>
      </div>

      <div class="steps-list">
        <div
          v-for="step in schoolStore.onboardingSteps"
          :key="step.id"
          class="step"
          :class="{
            'step--done': step.done,
            'step--active': step.id === schoolStore.onboardingStep && !step.done,
            'step--pending': !step.done && step.id !== schoolStore.onboardingStep,
          }"
        >
          <div class="step__num">
            <template v-if="step.done">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </template>
            <template v-else>{{ step.id }}</template>
          </div>
          <div class="step__content">
            <p class="step__label">{{ step.label }}</p>
            <p class="step__desc">{{ step.desc }}</p>
          </div>
          <div class="step__action">
            <RouterLink v-if="step.done" :to="stepRoute(step.id)" class="step__modify">Modifier</RouterLink>
            <div v-else-if="step.id === schoolStore.onboardingStep && step.id === 4" class="step__action-group">
              <RouterLink to="/app/students/import" class="btn btn--navy step__continue">Importer Excel</RouterLink>
              <RouterLink to="/app/students/new" class="step__modify">ou inscrire un élève</RouterLink>
            </div>
            <RouterLink
              v-else-if="step.id === schoolStore.onboardingStep"
              :to="stepRoute(step.id)"
              class="btn btn--navy step__continue"
            >
              {{ step.id <= 4 ? 'Continuer' : 'Ouvrir' }}
            </RouterLink>
            <span v-else class="step__pending-label">En attente</span>
          </div>
        </div>
      </div>

      <button class="btn btn--ghost mt-20" @click="skipToApp">
        Voir le tableau de bord complet →
      </button>
    </div>

    <aside class="ob-aside">
      <div class="agent-card">
        <p class="agent-card__label">VOTRE ACCOMPAGNATEUR</p>
        <p class="agent-card__name">{{ school.agentName }}</p>
        <p class="agent-card__desc">Il vient à l'école pour l'import des élèves et la formation de l'équipe.</p>
        <a :href="`tel:${school.agentPhone}`" class="btn btn--yellow w-full">Appeler · {{ school.agentPhone }}</a>
      </div>
      <div class="info-card">
        <p class="info-card__title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0160D3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Les parents ne voient rien avant la fin
        </p>
        <p class="info-card__desc">Les SMS partent seulement après l'import des élèves et votre accord.</p>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSchoolStore } from '@/stores/school'

const schoolStore = useSchoolStore()
const router = useRouter()
const school = computed(() => schoolStore.school)
const doneCount = computed(() => schoolStore.onboardingSteps.filter(s => s.done).length)

function stepRoute(id: number): string {
  const map: Record<number, string> = {
    1: '/app/onboarding/profile',
    2: '/app/onboarding/year',
    3: '/app/classes',
    4: '/app/students/import',
    5: '/app/onboarding/teachers',
    6: '/app/onboarding/parents',
  }
  return map[id] ?? '/app/onboarding'
}

function skipToApp() {
  schoolStore.isOnboardingComplete = true
  router.push('/app/dashboard')
}
</script>

<style scoped>
.onboarding-page {
  padding: 32px;
  display: flex;
  gap: 32px;
  min-height: 100%;
}

.ob-main { flex: 1; }

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--k-orange);
  margin: 0 0 8px;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0 0 6px;
}

.page-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0 24px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: var(--k-navy);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-label { font-size: 13px; color: #6b7280; white-space: nowrap; }

.steps-list { display: flex; flex-direction: column; gap: 10px; }

.step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
}

.step--active { border: 2px solid var(--k-navy); }
.step--pending { opacity: 0.55; }

.step__num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
  margin-top: 1px;
}

.step--done .step__num  { background: #dcfce7; }
.step--active .step__num { background: var(--k-navy); color: #fff; }

.step__content { flex: 1; }
.step__label { font-weight: 600; font-size: 14px; color: #1a1a2e; margin: 0 0 3px; }
.step__desc  { font-size: 13px; color: #6b7280; margin: 0; }
.step__action { display: flex; align-items: center; padding-top: 3px; }

.step__modify {
  color: var(--k-blue);
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
}

.step__continue {
  padding: 8px 20px;
  white-space: nowrap;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
}

.step__pending-label { font-size: 12px; color: #9ca3af; white-space: nowrap; }
.step__action-group { display: flex; align-items: center; gap: 12px; }

.mt-20 { margin-top: 20px; }

/* Aside */
.ob-aside {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 52px;
}

.agent-card {
  background: var(--k-navy);
  border-radius: var(--k-radius);
  padding: 20px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.agent-card::after {
  content: '';
  position: absolute;
  top: -24px;
  right: -24px;
  width: 100px;
  height: 100px;
  background: var(--k-yellow);
  border-radius: 50%;
  opacity: 0.8;
}

.agent-card__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.6);
  margin: 0 0 6px;
  position: relative;
  z-index: 1;
}

.agent-card__name {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px;
  position: relative;
  z-index: 1;
}

.agent-card__desc {
  font-size: 13px;
  color: rgba(255,255,255,0.75);
  margin: 0 0 16px;
  position: relative;
  z-index: 1;
  line-height: 1.5;
}

.w-full { width: 100%; display: block; text-align: center; text-decoration: none; }

.info-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 16px;
}

.info-card__title {
  font-weight: 600;
  font-size: 13px;
  color: var(--k-navy);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-card__desc { font-size: 12px; color: #6b7280; margin: 0; }
</style>

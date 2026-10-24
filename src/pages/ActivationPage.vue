<template>
  <div class="activation-page">
    <div class="activation-card">
      <div class="card-header">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="28" />
      </div>

      <h1 class="card-title">Bienvenue, M. Kabeya</h1>

      <div class="school-info-box">
        <div class="info-row">
          <span class="info-label">École</span>
          <span class="info-value">Complexe Scolaire Mwinda</span>
        </div>
        <div class="info-row">
          <span class="info-label">Rôle</span>
          <span class="info-value">Enseignant · Chimie</span>
        </div>
        <div class="info-row">
          <span class="info-label">Classes</span>
          <span class="info-value">4e Scient. A, 3e Scient., 2e Scient.</span>
        </div>
        <div class="info-row">
          <span class="info-label">Invité par</span>
          <span class="info-value">J. Mukendi, préfet</span>
        </div>
      </div>

      <!-- Verification code -->
      <div class="pin-section">
        <p class="pin-label">Code reçu par SMS au +243 97 ••• 18 40</p>
        <div class="otp-row">
          <input
            v-for="i in 4"
            :key="`otp-${i}`"
            type="text"
            maxlength="1"
            class="otp-input"
            inputmode="numeric"
            pattern="[0-9]*"
            @input="onOtpInput($event, i - 1)"
            @keydown="onOtpKeydown($event, i - 1)"
            :ref="el => { if (el) otpRefs[i - 1] = el as HTMLInputElement }"
          />
        </div>
        <p class="resend-hint">Renvoyer le code dans <strong>0:42</strong></p>
      </div>

      <!-- PIN choice -->
      <div class="pin-section">
        <p class="pin-label section-label">Choisir un code PIN à 4 chiffres</p>
        <div class="otp-row">
          <input
            v-for="i in 4"
            :key="`pin-${i}`"
            type="password"
            maxlength="1"
            class="otp-input"
            inputmode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div class="otp-row mt-8">
          <input
            v-for="i in 4"
            :key="`pin2-${i}`"
            type="password"
            maxlength="1"
            class="otp-input"
            inputmode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <p class="form-hint">Vous l'utilisez pour ouvrir LongiPlus sur ce téléphone.</p>
      </div>

      <button class="btn btn--navy activate-btn" @click="handleActivate">
        Activer et ouvrir mes classes
      </button>

      <p class="footer-note">Ce téléphone devient votre appareil lié. Le préfet le retire en cas de perte.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const otpRefs = ref<HTMLInputElement[]>([])

function handleActivate() {
  router.push('/app/teacher/day')
}

function onOtpInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  if (input.value && index < 3) {
    otpRefs.value[index + 1]?.focus()
  }
}

function onOtpKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace' && !(event.target as HTMLInputElement).value && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}
</script>

<style scoped>
.activation-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: 'Inter', sans-serif;
}

.activation-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 32px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header { display: flex; justify-content: center; }

.card-title {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0;
  text-align: center;
}

.school-info-box {
  background: var(--k-sky);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-width: 68px;
  flex-shrink: 0;
}

.info-value { font-size: 13px; color: #1a1a2e; font-weight: 500; }

/* OTP */
.pin-section { display: flex; flex-direction: column; gap: 8px; }

.pin-label {
  font-size: 13px;
  color: #374151;
  margin: 0;
}

.section-label { font-weight: 600; color: var(--k-navy); font-size: 14px; }

.otp-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.otp-input {
  width: 52px;
  height: 56px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  border: 2px solid var(--k-border);
  border-radius: 10px;
  outline: none;
  color: var(--k-navy);
  transition: border-color 0.15s;
}

.otp-input:focus { border-color: var(--k-blue); }

.resend-hint { font-size: 12px; color: #9ca3af; margin: 0; text-align: center; }

.mt-8 { margin-top: 8px; }
.form-hint { font-size: 12px; color: #9ca3af; margin: 0; }

.activate-btn {
  width: 100%;
  justify-content: center;
  padding: 14px;
  font-size: 15px;
}

.footer-note {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}
</style>

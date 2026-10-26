<template>
  <div class="activation-page">
    <div class="activation-card">
      <div class="card-header">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="28" />
      </div>

      <template v-if="!activated">
        <h1 class="card-title">Activation de votre compte</h1>
        <p class="card-sub">Entrez votre numéro de téléphone et le code à 6 chiffres reçu par SMS.</p>

        <div class="field-group">
          <label class="field-label">Votre numéro de téléphone</label>
          <input v-model="phone" type="tel" class="field-input" placeholder="+243 81 234 0012" />
        </div>

        <div class="pin-section">
          <p class="pin-label">Code reçu par SMS</p>
          <div class="otp-row">
            <input
              v-for="i in 6"
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
        </div>

        <p v-if="activateError" class="error-msg">{{ activateError }}</p>

        <button class="btn btn--navy activate-btn" :disabled="activating || !canActivate" @click="handleActivate">
          {{ activating ? 'Activation…' : 'Activer mon compte' }}
        </button>

        <p class="footer-note">Votre numéro de téléphone et le code sont fournis par votre directeur d'école.</p>
      </template>

      <template v-else>
        <div class="success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 class="card-title">Compte activé !</h1>
        <p class="card-sub">Votre accès est prêt. Connectez-vous avec votre numéro de téléphone.</p>
        <RouterLink to="/login" class="btn btn--navy activate-btn" style="text-align:center">
          Se connecter
        </RouterLink>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { publicApi } from '@/api/setup'

const otpRefs = ref<HTMLInputElement[]>([])
const otpDigits = ref(['', '', '', '', '', ''])
const phone = ref('')
const activating = ref(false)
const activateError = ref('')
const activated = ref(false)

const canActivate = computed(() =>
  phone.value.trim().length >= 10 &&
  otpDigits.value.every(d => d !== '')
)

async function handleActivate() {
  activating.value = true
  activateError.value = ''
  try {
    const code = otpDigits.value.join('')
    await publicApi.memberships.verifyInvite({ phone: phone.value.trim(), code })
    activated.value = true
  } catch (e) {
    activateError.value = e instanceof Error ? e.message : 'Code invalide ou expiré. Vérifiez et réessayez.'
  } finally {
    activating.value = false
  }
}

function onOtpInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '').slice(-1)
  input.value = val
  otpDigits.value[index] = val
  if (val && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }
}

function onOtpKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace' && !(event.target as HTMLInputElement).value && index > 0) {
    otpDigits.value[index - 1] = ''
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

.card-sub {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  text-align: center;
  line-height: 1.5;
}

.field-group { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.field-input {
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

.field-input:focus { border-color: var(--k-blue); }

.error-msg {
  font-size: 13px;
  color: #dc2626;
  margin: 0;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: 6px;
}

.success-icon {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.success-icon > svg {
  background: #dcfce7;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  padding: 16px;
  box-sizing: border-box;
}

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
  width: 44px;
  height: 52px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  border: 2px solid var(--k-border);
  border-radius: 10px;
  outline: none;
  color: var(--k-navy);
  transition: border-color 0.15s;
}

.otp-input:focus { border-color: var(--k-blue); }

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

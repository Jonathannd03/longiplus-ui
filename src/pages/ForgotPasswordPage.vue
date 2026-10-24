<template>
  <div class="fp-layout">
    <div class="fp-left">
      <div class="fp-left__logo">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="48" style="filter: brightness(0) invert(1)" />
      </div>
      <div class="fp-left__circle"></div>
      <div class="fp-left__bottom">
        <div class="fp-left__arcs" aria-hidden="true">
          <span class="arc arc--1"></span>
          <span class="arc arc--2"></span>
        </div>
        <h2 class="fp-left__tagline">Toute votre école, sur un seul écran.</h2>
        <p class="fp-left__sub">Élèves, appel, notes et bulletins de votre école, au même endroit.</p>
      </div>
    </div>

    <div class="fp-right">
      <div class="fp-form-wrap">
        <RouterLink to="/login" class="back-link">← Connexion</RouterLink>

        <p class="eyebrow">ESPACE ÉCOLE</p>
        <h1 class="fp-title">Mot de passe oublié</h1>
        <p class="fp-sub">Un code SMS confirme que le numéro est à vous. Ensuite, choisissez un nouveau mot de passe.</p>

        <div class="steps">
          <span class="step step--done">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Téléphone
          </span>
          <span class="step-line"></span>
          <span class="step step--active">2 Code</span>
          <span class="step-line"></span>
          <span class="step step--pending">3 Nouveau mot de passe</span>
        </div>

        <div class="form-group">
          <label class="form-label">Téléphone du compte</label>
          <input v-model="phone" type="tel" class="form-input" placeholder="+243 81 234 5678" />
        </div>

        <div class="form-group">
          <label class="form-label">Code reçu par SMS</label>
          <div class="otp-row">
            <input
              v-for="(_, i) in otpDigits"
              :key="i"
              :ref="(el) => { if (el) otpRefs[i] = el as HTMLInputElement }"
              v-model="otpDigits[i]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="otp-box"
              :class="{ 'otp-box--filled': (otpDigits[i] ?? '').length > 0 }"
              @input="onOtpInput(i)"
              @keydown.backspace="onOtpBackspace(i)"
            />
          </div>
          <p class="form-timer">Renvoyer dans {{ countdown }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">Nouveau mot de passe</label>
          <input v-model="newPassword" type="password" class="form-input" placeholder="••••••••••" />
          <p class="form-hint">8 caractères au moins, avec un chiffre. Différent de l'ancien.</p>
        </div>

        <button class="btn-primary" :disabled="!canSubmit" @click="handleSubmit">Changer le mot de passe</button>

        <div class="phone-box">
          <span class="phone-box__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </span>
          <div>
            <p class="phone-box__title">Vous avez changé de numéro ?</p>
            <p class="phone-box__desc">Demandez au promoteur ou à votre agent LongiPlus de mettre à jour votre compte.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const phone = ref('+243 81 234 5678')
const otpDigits = reactive(['8', '1', '4', '6', '0', ''])
const otpRefs: HTMLInputElement[] = []
const newPassword = ref('••••••••••')
const totalSeconds = ref(52)

const countdown = computed(() => {
  const m = Math.floor(totalSeconds.value / 60)
  const s = totalSeconds.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

const otpFilled = computed(() => otpDigits.every(d => (d ?? '').length > 0))
const canSubmit = computed(() => phone.value.length > 0 && otpFilled.value && newPassword.value.length >= 8)

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    if (totalSeconds.value > 0) totalSeconds.value--
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function onOtpInput(i: number) {
  const val = (otpDigits[i] ?? '').replace(/\D/g, '')
  otpDigits[i] = val.slice(-1)
  if (val && i < 5) {
    otpRefs[i + 1]?.focus()
  }
}

function onOtpBackspace(i: number) {
  if (!(otpDigits[i] ?? '') && i > 0) {
    otpRefs[i - 1]?.focus()
  }
}

function handleSubmit() {
  router.push('/login')
}
</script>

<style scoped>
.fp-layout {
  display: flex;
  min-height: 100vh;
}

.fp-left {
  width: 42%;
  background: #083A8C;
  display: flex;
  flex-direction: column;
  padding: 40px;
  position: relative;
  overflow: hidden;
}
.fp-left__logo { z-index: 2; position: relative; }
.fp-left__circle {
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-60%);
  width: 280px;
  height: 280px;
  background: #FDC409;
  border-radius: 50%;
  z-index: 1;
}
.fp-left__bottom { margin-top: auto; z-index: 2; position: relative; }
.fp-left__arcs { position: absolute; bottom: -120px; left: -20px; width: 300px; height: 200px; }
.arc { position: absolute; border-radius: 50%; border: 3px solid rgba(1,96,211,0.6); display: block; }
.arc--1 { width: 180px; height: 180px; left: 30px; bottom: 40px; }
.arc--2 { width: 240px; height: 240px; left: -10px; bottom: 10px; }
.fp-left__tagline {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.25;
}
.fp-left__sub { color: rgba(255,255,255,0.75); font-size: 14px; margin: 0; }

.fp-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  padding: 40px;
}
.fp-form-wrap {
  width: 100%;
  max-width: 480px;
}

.back-link {
  display: inline-block;
  color: #0160D3;
  font-size: 13px;
  text-decoration: none;
  margin-bottom: 24px;
}
.back-link:hover { text-decoration: underline; }

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #F7A21B;
  margin: 0 0 12px;
}
.fp-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
}
.fp-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px;
  line-height: 1.5;
}

.steps {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}
.step {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}
.step--done { color: #0160D3; }
.step--active {
  background: #083A8C;
  color: #fff;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
}
.step--pending { color: #9ca3af; }
.step-line { flex: 1; height: 1px; background: #e5e7eb; min-width: 16px; }

.form-group { margin-bottom: 18px; }
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}
.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  color: #1a1a2e;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.form-input:focus { border-color: #0160D3; }
.form-hint { font-size: 12px; color: #6b7280; margin: 6px 0 0; }
.form-timer { font-size: 12px; color: #6b7280; margin: 8px 0 0; }

.otp-row {
  display: flex;
  gap: 8px;
}
.otp-box {
  flex: 1;
  aspect-ratio: 1;
  max-width: 60px;
  border: 2px solid #d1d5db;
  border-radius: 10px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: #1a1a2e;
  background: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.otp-box:focus {
  border-color: #0160D3;
  box-shadow: 0 0 0 3px rgba(1,96,211,0.12);
}
.otp-box--filled { border-color: #083A8C; }

.btn-primary {
  width: 100%;
  padding: 14px;
  background: #083A8C;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background 0.15s, opacity 0.15s;
}
.btn-primary:hover:not(:disabled) { background: #052a6a; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.phone-box {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #FFF8E6;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 14px 16px;
}
.phone-box__icon { flex-shrink: 0; margin-top: 2px; }
.phone-box__title { font-weight: 600; font-size: 14px; color: #92400e; margin: 0 0 4px; }
.phone-box__desc { font-size: 13px; color: #78350f; margin: 0; }
</style>

<template>
  <div class="code-layout">
    <div class="code-left">
      <div class="code-left__logo">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="48" style="filter: brightness(0) invert(1)" />
      </div>
      <div class="code-left__circle"></div>
      <div class="code-left__bottom">
        <div class="code-left__arcs" aria-hidden="true">
          <span class="arc arc--1"></span>
          <span class="arc arc--2"></span>
        </div>
        <h2 class="code-left__tagline">Toute votre école, sur un seul écran.</h2>
        <p class="code-left__sub">Élèves, appel, notes et bulletins de votre école, au même endroit.</p>
      </div>
    </div>

    <div class="code-right">
      <div class="code-form-wrap">
        <RouterLink to="/login" class="back-link">← Retour</RouterLink>

        <p class="eyebrow">ESPACE ÉCOLE · VÉRIFICATION</p>
        <h1 class="code-title">Entrez le code reçu par SMS</h1>
        <p class="code-sub">Envoyé au +243 81 ••• 00 12. Il expire dans 10 minutes.</p>

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

        <div class="otp-meta">
          <span class="otp-timer">{{ canResend ? 'Renvoyer le code' : `Renvoyer dans ${countdown}` }}</span>
          <a href="#" class="link">Recevoir un appel vocal</a>
        </div>

        <label class="trust-label">
          <input type="checkbox" v-model="trust" class="trust-checkbox" />
          <div class="trust-text">
            <span class="trust-main">Faire confiance à cet ordinateur pendant 30 jours</span>
            <p class="trust-hint">Seulement sur un ordinateur personnel, jamais au cybercafé.</p>
          </div>
        </label>

        <button class="btn-primary" @click="handleValidate">Valider et entrer</button>

        <div class="why-box">
          <span class="why-box__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0160D3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <div>
            <p class="why-box__title">Pourquoi ce code ?</p>
            <p class="why-box__desc">Le promoteur, le préfet et le préfet des études voient toute l'école. Le code protège ces comptes.</p>
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

const otpDigits = reactive(['5', '2', '9', '', '', ''])
const otpRefs: HTMLInputElement[] = []
const trust = ref(true)
const totalSeconds = ref(41)

const canResend = computed(() => totalSeconds.value <= 0)
const countdown = computed(() => {
  const m = Math.floor(totalSeconds.value / 60)
  const s = totalSeconds.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    if (totalSeconds.value > 0) totalSeconds.value--
  }, 1000)
  otpRefs[3]?.focus()
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

function handleValidate() {
  router.push('/app/dashboard')
}
</script>

<style scoped>
.code-layout {
  display: flex;
  min-height: 100vh;
}

.code-left {
  width: 42%;
  background: #083A8C;
  display: flex;
  flex-direction: column;
  padding: 40px;
  position: relative;
  overflow: hidden;
}
.code-left__logo { z-index: 2; position: relative; }
.code-left__circle {
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
.code-left__bottom { margin-top: auto; z-index: 2; position: relative; }
.code-left__arcs { position: absolute; bottom: -120px; left: -20px; width: 300px; height: 200px; }
.arc { position: absolute; border-radius: 50%; border: 3px solid rgba(1,96,211,0.6); display: block; }
.arc--1 { width: 180px; height: 180px; left: 30px; bottom: 40px; }
.arc--2 { width: 240px; height: 240px; left: -10px; bottom: 10px; }
.code-left__tagline {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.25;
}
.code-left__sub { color: rgba(255,255,255,0.75); font-size: 14px; margin: 0; }

.code-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  padding: 40px;
}
.code-form-wrap {
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
.code-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
}
.code-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 32px;
}

.otp-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.otp-box {
  flex: 1;
  aspect-ratio: 1;
  max-width: 68px;
  border: 2px solid #d1d5db;
  border-radius: 10px;
  font-size: 28px;
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

.otp-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.otp-timer { font-size: 13px; color: #6b7280; }
.link { color: #0160D3; font-size: 13px; text-decoration: none; }
.link:hover { text-decoration: underline; }

.trust-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 28px;
  cursor: pointer;
}
.trust-checkbox {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: #0160D3;
  cursor: pointer;
}
.trust-text { display: flex; flex-direction: column; gap: 4px; }
.trust-main { font-size: 14px; color: #1a1a2e; line-height: 1.4; }
.trust-hint { font-size: 12px; color: #6b7280; margin: 0; }

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
  transition: background 0.15s;
}
.btn-primary:hover { background: #052a6a; }

.why-box {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #E8F1FC;
  border-radius: 10px;
  padding: 14px 16px;
}
.why-box__icon { flex-shrink: 0; margin-top: 2px; }
.why-box__title { font-weight: 600; font-size: 14px; color: #083A8C; margin: 0 0 4px; }
.why-box__desc { font-size: 13px; color: #374151; margin: 0; }
</style>

<template>
  <div class="login-layout">
    <div class="login-left">
      <div class="login-left__logo">
        <img src="/longiplus-logo-white.svg" alt="LongiPlus" height="40" style="filter: brightness(0) invert(1);" />
        <p class="login-left__subtitle">Tout pour mieux gérer votre école.</p>
      </div>
      <div class="login-left__circle"></div>
      <img src="/longiplus-icon.svg" class="login-left__deco" aria-hidden="true" />
      <div class="login-left__bottom">
        <h2 class="login-left__tagline">Toute votre école, sur un seul écran.</h2>
        <p class="login-left__sub">Élèves, appel, notes et bulletins de votre école, au même endroit.</p>
      </div>
    </div>

    <div class="login-right">
      <div class="login-form-wrap">
        <p class="eyebrow">ESPACE ÉCOLE</p>
        <h1 class="login-title">Connexion</h1>
        <p class="login-sub">Pour le promoteur, le préfet, l'économe, le secrétariat et les enseignants.</p>

        <form @submit.prevent="submit">
          <div class="field">
            <label class="field__label" for="identifier">Téléphone ou e-mail</label>
            <input
              id="identifier"
              v-model="identifier"
              class="field__input"
              type="text"
              placeholder="+243 81 234 5678"
              autocomplete="username"
              :disabled="loading"
              required
            />
          </div>

          <div class="field">
            <div class="field__header">
              <label class="field__label" for="password">Mot de passe</label>
              <RouterLink to="/forgot-password" class="link field__forgot">Mot de passe oublié</RouterLink>
            </div>
            <input
              id="password"
              v-model="password"
              class="field__input"
              type="password"
              autocomplete="current-password"
              :disabled="loading"
              required
            />
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="btn-primary__spinner" aria-hidden="true"></span>
            {{ loading ? 'Connexion en cours…' : 'Se connecter' }}
          </button>
        </form>

        <div class="verification-box">
          <span class="verification-box__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0160D3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <div>
            <p class="verification-box__title">Code de vérification</p>
            <p class="verification-box__desc">Le promoteur, le préfet et l'économe confirment chaque connexion par un code SMS.</p>
          </div>
        </div>

        <div class="login-footer">
          <span class="login-footer__text">Vous êtes parent ?</span>
          <a href="#" class="link">Consulter un bulletin</a>
        </div>

        <div class="register-box">
          <div>
            <p class="register-box__title">Votre école n'utilise pas encore LongiPlus ?</p>
            <p class="register-box__sub">Inscription en 4 étapes, environ 10 minutes.</p>
          </div>
          <RouterLink to="/register" class="link register-box__link">Inscrire mon école</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  error.value = null
  loading.value = true
  try {
    const err = await authStore.loginWithCredentials(identifier.value, password.value)
    if (err) {
      error.value = err
    } else {
      await router.push('/app/dashboard')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-layout {
  display: flex;
  min-height: 100vh;
}

.login-left {
  width: 42%;
  background: #083A8C;
  display: flex;
  flex-direction: column;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.login-left__logo {
  z-index: 2;
  position: relative;
}

.login-left__subtitle {
  color: rgba(255,255,255,0.6);
  font-size: 12px;
  margin: 6px 0 0;
}

.login-left__circle {
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-60%);
  width: 200px;
  height: 200px;
  background: #FDC409;
  border-radius: 50%;
  z-index: 1;
}

.login-left__deco {
  position: absolute;
  bottom: -60px;
  left: -60px;
  width: 280px;
  filter: brightness(0) invert(1);
  opacity: 0.1;
  pointer-events: none;
  z-index: 1;
}

.login-left__bottom {
  margin-top: auto;
  z-index: 2;
  position: relative;
}

.login-left__tagline {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.25;
}

.login-left__sub {
  color: rgba(255,255,255,0.75);
  font-size: 14px;
  margin: 0;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  padding: 40px;
}

.login-form-wrap {
  width: 100%;
  max-width: 440px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #F7A21B;
  margin: 0 0 12px;
}

.login-title {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.login-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px;
}

/* ── Form fields ── */

.field {
  margin-bottom: 16px;
}

.field__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.field__label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.field__header .field__label {
  margin-bottom: 0;
}

.field__forgot {
  font-size: 13px;
}

.field__input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  color: #1a1a2e;
  background: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.field__input:focus {
  border-color: #0160D3;
  box-shadow: 0 0 0 3px rgba(1, 96, 211, 0.12);
}

.field__input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.error-msg {
  font-size: 13px;
  color: #dc2626;
  margin: 0 0 12px;
  padding: 10px 12px;
  background: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fecaca;
}

/* ── Button ── */

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
  margin-top: 4px;
  margin-bottom: 20px;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) {
  background: #052a6a;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Info boxes ── */

.link {
  color: #0160D3;
  font-size: 13px;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.verification-box {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #E8F1FC;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 24px;
}

.verification-box__icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.verification-box__title {
  font-weight: 600;
  font-size: 14px;
  color: #083A8C;
  margin: 0 0 4px;
}

.verification-box__desc {
  font-size: 13px;
  color: #374151;
  margin: 0;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.login-footer__text {
  font-size: 13px;
  color: #6b7280;
}

.register-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #FFF8E6;
  border-radius: 10px;
  padding: 14px 16px;
  margin-top: 16px;
}

.register-box__title {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 3px;
}

.register-box__sub {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.register-box__link {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
</style>

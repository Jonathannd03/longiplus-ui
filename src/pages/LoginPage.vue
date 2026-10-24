<template>
  <div class="login-layout">
    <div class="login-left">
      <div class="login-left__logo">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="48" style="filter: brightness(0) invert(1)" />
      </div>
      <div class="login-left__circle"></div>
      <div class="login-left__bottom">
        <div class="login-left__arcs" aria-hidden="true">
          <span class="arc arc--1"></span>
          <span class="arc arc--2"></span>
        </div>
        <h2 class="login-left__tagline">Toute votre école, sur un seul écran.</h2>
        <p class="login-left__sub">Paiements, élèves, notes et bulletins de votre école, au même endroit.</p>
      </div>
    </div>

    <div class="login-right">
      <div class="login-form-wrap">
        <p class="eyebrow">ESPACE ÉCOLE</p>
        <h1 class="login-title">Connexion</h1>
        <p class="login-sub">Pour le promoteur, le préfet, l'économe, le secrétariat et les enseignants.</p>

        <button class="btn-primary" @click="authStore.login()">Se connecter</button>

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
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
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

.login-left__circle {
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

.login-left__bottom {
  margin-top: auto;
  z-index: 2;
  position: relative;
}

.login-left__arcs {
  position: absolute;
  bottom: -120px;
  left: -20px;
  width: 300px;
  height: 200px;
}

.arc {
  position: absolute;
  border-radius: 50%;
  border: 3px solid rgba(1, 96, 211, 0.6);
  display: block;
}

.arc--1 {
  width: 180px;
  height: 180px;
  left: 30px;
  bottom: 40px;
}

.arc--2 {
  width: 240px;
  height: 240px;
  left: -10px;
  bottom: 10px;
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

.form-group {
  margin-bottom: 18px;
}

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

.form-input:focus {
  border-color: #0160D3;
}

.form-hint-right {
  text-align: right;
  margin-top: 6px;
}

.link {
  color: #0160D3;
  font-size: 13px;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

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

.btn-primary:hover {
  background: #052a6a;
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

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="app-header__brand">
        <img
          :src="logoUrl"
          :alt="t('app.title')"
          class="app-header__logo"
          height="36"
        />
        <span class="app-header__title">{{ t('app.title') }}</span>
      </div>

      <nav class="app-header__nav" aria-label="Navigation principale">
        <a href="/" class="app-header__nav-link app-header__nav-link--active">
          {{ t('nav.dashboard') }}
        </a>
        <a href="/eleves" class="app-header__nav-link">{{ t('nav.students') }}</a>
        <a href="/frais" class="app-header__nav-link">{{ t('nav.fees') }}</a>
        <a href="/notes" class="app-header__nav-link">{{ t('nav.grades') }}</a>
      </nav>
    </header>

    <main class="app-main">
      <div class="app-main__welcome">
        <h1>{{ t('app.tagline') }}</h1>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const logoUrl = '/longiplus-logo.svg';
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--k-navy);
  color: #fff;
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  flex-shrink: 0;
}

.app-header__logo {
  height: 36px;
  width: auto;
  object-fit: contain;
}

.app-header__title {
  font-family: 'Poppins', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: #fff;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.app-header__nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.15s, color 0.15s;
}

.app-header__nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
}

.app-header__nav-link--active {
  background-color: var(--k-blue);
  color: #fff;
}

.app-main {
  flex: 1;
  padding: 2rem 1.5rem;
}

.app-main__welcome h1 {
  color: var(--k-navy);
}
</style>

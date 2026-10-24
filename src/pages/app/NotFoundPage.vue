<template>
  <div class="nf-wrap">
    <div class="nf-illustration" aria-hidden="true">
      <svg width="100" height="90" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Yellow circle -->
        <circle cx="50" cy="16" r="14" fill="#FDC409"/>
        <!-- Book left page -->
        <path d="M8 38 C8 32 18 28 50 30 L50 80 C18 78 8 74 8 68 Z" fill="#083A8C"/>
        <!-- Book right page -->
        <path d="M92 38 C92 32 82 28 50 30 L50 80 C82 78 92 74 92 68 Z" fill="#0160D3"/>
        <!-- Book spine highlight -->
        <rect x="48" y="30" width="4" height="50" rx="2" fill="#fff" opacity="0.2"/>
      </svg>
    </div>

    <p class="nf-eyebrow">ERREUR 404</p>
    <h1 class="nf-title">Cette page n'existe pas</h1>
    <p class="nf-desc">Le lien est peut-être ancien, ou l'élève a changé de classe. Cherchez directement ce que vous voulez.</p>

    <div class="nf-search">
      <svg class="nf-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input
        v-model="query"
        type="text"
        class="nf-search__input"
        placeholder="Nom ou code élève"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="nf-actions">
      <RouterLink to="/app/dashboard" class="btn btn--navy">Tableau de bord</RouterLink>
      <RouterLink to="/app/students" class="btn btn--ghost-navy">Liste des élèves</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')

function handleSearch() {
  if (query.value.trim()) {
    router.push(`/app/students?q=${encodeURIComponent(query.value.trim())}`)
  }
}
</script>

<style scoped>
.nf-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 48px 24px;
  text-align: center;
  gap: 0;
}

.nf-illustration {
  margin-bottom: 20px;
}

.nf-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #9ca3af;
  margin: 0 0 12px;
}

.nf-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px;
}

.nf-desc {
  font-size: 14px;
  color: #6b7280;
  max-width: 420px;
  line-height: 1.6;
  margin: 0 0 28px;
}

.nf-search {
  position: relative;
  width: 100%;
  max-width: 360px;
  margin-bottom: 20px;
}
.nf-search__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.nf-search__input {
  width: 100%;
  padding: 13px 14px 13px 42px;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  color: #1a1a2e;
  background: #fff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.nf-search__input:focus { border-color: #0160D3; }
.nf-search__input::placeholder { color: #9ca3af; }

.nf-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

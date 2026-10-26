<template>
  <template v-if="!authStore.authReady">
    <div class="app-init-loader">
      <div class="app-init-card">
        <img src="/longiplus-logo.svg" alt="LongiPlus" class="app-init-logo" />
        <div class="app-init-track">
          <div class="app-init-bar"></div>
        </div>
      </div>
    </div>
  </template>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<style>
.app-init-loader {
  position: fixed;
  inset: 0;
  background: #083A8C;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.app-init-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}
.app-init-logo {
  height: 44px;
  filter: brightness(0) invert(1);
}
.app-init-track {
  width: 160px;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 99px;
  overflow: hidden;
}
.app-init-bar {
  height: 100%;
  width: 40%;
  background: #FDC409;
  border-radius: 99px;
  animation: sweep 1.2s ease-in-out infinite;
}
@keyframes sweep {
  0%   { transform: translateX(-100%); }
  50%  { transform: translateX(150%); }
  100% { transform: translateX(300%); }
}
</style>

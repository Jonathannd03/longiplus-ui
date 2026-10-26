<template>
  <template v-if="!authStore.authReady">
    <div class="app-init-loader">
      <div class="app-init-spinner"></div>
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
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.app-init-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #083A8C;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>

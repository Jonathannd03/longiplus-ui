<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import { useSchoolStore } from '@/stores/school'

const route = useRoute()
const router = useRouter()
const schoolStore = useSchoolStore()

watch(
  () => route.path,
  (path) => {
    const inOnboarding = path.startsWith('/app/onboarding')
    if (!schoolStore.isOnboardingComplete && !inOnboarding) {
      router.replace('/app/onboarding')
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.app-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}
</style>

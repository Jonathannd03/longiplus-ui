<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import { useSchoolStore } from '@/stores/school'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const schoolStore = useSchoolStore()
const authStore = useAuthStore()

// Sync onboarding step completion from the API on first load
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await schoolStore.syncOnboardingState()
  }
})

// Re-check if the user logs in after the layout mounts
watch(() => authStore.isAuthenticated, async (authenticated) => {
  if (authenticated && !schoolStore.onboardingChecked) {
    await schoolStore.syncOnboardingState()
  }
})

// Guard: redirect to onboarding only after the check has finished
watch(
  [() => route.path, () => schoolStore.onboardingChecked, () => schoolStore.isOnboardingComplete],
  ([path, checked, complete]) => {
    if (!checked) return // API check still in flight — don't redirect yet
    const inOnboarding = (path as string).startsWith('/app/onboarding')
    if (!complete && !inOnboarding) {
      router.replace('/app/onboarding')
    }
  },
  { immediate: true },
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

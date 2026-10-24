<template>
  <div v-if="authStore.schools.length > 1" class="school-switcher">
    <button class="school-switcher__btn" @click="open = !open">
      <span class="school-switcher__name">{{ currentSchoolName }}</span>
      <svg class="school-switcher__caret" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div v-if="open" class="school-switcher__dropdown">
      <button
        v-for="school in authStore.schools"
        :key="school.id"
        class="school-switcher__option"
        :class="{ 'school-switcher__option--active': school.id === authStore.schoolId }"
        @click="switchTo(school.id)"
      >
        {{ school.name }}
      </button>
    </div>
  </div>

  <div v-else class="school-switcher__single">
    {{ currentSchoolName }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const open = ref(false)

const currentSchoolName = computed(() =>
  authStore.schools.find(s => s.id === authStore.schoolId)?.name ?? '—'
)

async function switchTo(id: string) {
  open.value = false
  await authStore.switchSchool(id)
}
</script>

<style scoped>
.school-switcher {
  position: relative;
}

.school-switcher__btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 100%;
  text-align: left;
}

.school-switcher__name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.school-switcher__single {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.school-switcher__caret {
  flex-shrink: 0;
  color: #6b7280;
}

.school-switcher__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 200px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  overflow: hidden;
}

.school-switcher__option {
  display: block;
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  background: none;
  border: none;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.school-switcher__option:hover {
  background: #f3f4f6;
}

.school-switcher__option--active {
  color: #0B3A8C;
  font-weight: 600;
  background: #E8F1FC;
}
</style>

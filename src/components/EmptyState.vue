<template>
  <div class="empty-state">
    <div class="empty-state__icon" v-html="icon"></div>
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="description" class="empty-state__desc">{{ description }}</p>
    <RouterLink v-if="cta && ctaTo" :to="ctaTo" class="empty-state__btn">{{ cta }}</RouterLink>
    <button v-else-if="cta && !ctaTo" class="empty-state__btn" @click="$emit('cta')">{{ cta }}</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description?: string
  cta?: string
  ctaTo?: string
}>()
defineEmits<{ cta: [] }>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  text-align: center;
  gap: 12px;
}

.empty-state__icon {
  width: 56px;
  height: 56px;
  background: var(--k-sky);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--k-navy);
  margin-bottom: 4px;
}

.empty-state__title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0;
}

.empty-state__desc {
  font-size: 14px;
  color: var(--k-text-muted);
  margin: 0;
  max-width: 340px;
  line-height: 1.55;
}

.empty-state__btn {
  margin-top: 8px;
  padding: 10px 22px;
  background: var(--k-navy);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
  transition: opacity 0.15s;
}

.empty-state__btn:hover {
  opacity: 0.88;
  text-decoration: none;
}
</style>

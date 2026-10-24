<template>
  <div class="stat-card">
    <p class="stat-card__label">{{ label }}</p>
    <p class="stat-card__value">{{ value }}</p>
    <p v-if="sub" class="stat-card__sub">{{ sub }}</p>
    <div v-if="barValue !== undefined" class="stat-card__bar">
      <div class="stat-card__bar-fill" :style="{ width: barValue + '%', background: barColor || 'var(--k-navy)' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  sub?: string
  barValue?: number
  barColor?: string
}>()
</script>

<style scoped>
.stat-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 20px;
  flex: 1;
  min-width: 0;
}

.stat-card__label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--k-text-muted);
  margin: 0 0 8px;
}

.stat-card__value {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0 0 4px;
  line-height: 1.1;
}

.stat-card__sub {
  font-size: 12px;
  color: var(--k-text-muted);
  margin: 0 0 10px;
}

.stat-card__bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
}

.stat-card__bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;
}
</style>

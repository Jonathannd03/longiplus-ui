<template>
  <span class="badge" :class="`badge--${variant}`">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'orange' | 'navy'
}>()
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.badge--success { background: #dcfce7; color: #166534; }
.badge--warning { background: #fef9c3; color: #854d0e; }
.badge--error   { background: #fee2e2; color: #991b1b; }
.badge--info    { background: var(--k-sky); color: var(--k-navy); }
.badge--neutral { background: #f3f4f6; color: #374151; }
.badge--orange  { background: #fff7ed; color: #9a3412; }
.badge--navy    { background: var(--k-navy); color: #fff; }
</style>

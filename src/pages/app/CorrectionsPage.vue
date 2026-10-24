<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Demandes de correction</h1>
        <p class="page-sub">{{ pendingCount }} demande(s) en attente d'approbation</p>
      </div>
    </div>

    <div class="corrections-layout">
      <!-- Left: queue -->
      <div class="queue-panel">
        <div class="queue-section">
          <p class="queue-label">EN ATTENTE ({{ pending.length }})</p>
          <div v-for="c in pending" :key="c.id" :class="['correction-card', selectedId === c.id ? 'correction-card--selected' : '']" @click="selectedId = c.id">
            <div class="correction-top">
              <span class="correction-name">{{ c.studentName }}</span>
              <StatusBadge variant="warning">En attente</StatusBadge>
            </div>
            <p class="correction-detail">{{ c.subject }} · {{ c.period }} · {{ c.oldScore }} → {{ c.newScore }}</p>
            <p class="correction-date">{{ c.requestDate }}</p>
          </div>
        </div>
        <div class="queue-section">
          <p class="queue-label">TRAITÉS RÉCEMMENT</p>
          <div v-for="c in treated" :key="c.id" class="correction-card correction-card--treated">
            <div class="correction-top">
              <span class="correction-name">{{ c.studentName }}</span>
              <StatusBadge :variant="c.status === 'approved' ? 'success' : 'error'">{{ c.status === 'approved' ? 'Approuvé' : 'Refusé' }}</StatusBadge>
            </div>
            <p class="correction-detail">{{ c.subject }} · {{ c.period }} · {{ c.oldScore }} → {{ c.newScore }}</p>
            <p class="correction-date">{{ c.requestDate }}</p>
          </div>
        </div>
      </div>

      <!-- Right: detail -->
      <div class="detail-panel" v-if="selected">
        <div class="detail-header">
          <h2 class="detail-title">Demande de correction</h2>
          <StatusBadge variant="warning">En attente</StatusBadge>
        </div>

        <div class="detail-fields">
          <div class="detail-field">
            <span class="detail-label">Élève</span>
            <span class="detail-value">{{ selected.studentName }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Cours</span>
            <span class="detail-value">{{ selected.subject }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Période</span>
            <span class="detail-value">{{ selected.period }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Note actuelle</span>
            <span class="detail-value score-old">{{ selected.oldScore }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Note demandée</span>
            <span class="detail-value score-new">{{ selected.newScore }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Demandé par</span>
            <span class="detail-value">{{ selected.requestedBy }}</span>
          </div>
          <div class="detail-field detail-field--full">
            <span class="detail-label">Justification</span>
            <span class="detail-value">{{ selected.reason }}</span>
          </div>
        </div>

        <div class="detail-actions">
          <button class="btn btn--refuse" @click="refuse">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Refuser
          </button>
          <button class="btn btn--approve" @click="approve">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Approuver la correction
          </button>
        </div>
      </div>

      <div class="detail-panel detail-panel--empty" v-else>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p>Sélectionnez une demande pour l'examiner</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGradesStore } from '@/stores'
import StatusBadge from '@/components/StatusBadge.vue'

const gradesStore = useGradesStore()

const pending = computed(() => gradesStore.corrections.filter(c => c.status === 'pending'))
const treated = computed(() => gradesStore.corrections.filter(c => c.status !== 'pending'))
const pendingCount = computed(() => pending.value.length)

const selectedId = ref(pending.value[0]?.id ?? null)
const selected = computed(() => gradesStore.corrections.find(c => c.id === selectedId.value) ?? null)

function approve() {
  if (selectedId.value) {
    gradesStore.approveCorrection(selectedId.value)
    const next = pending.value.find(c => c.id !== selectedId.value)
    selectedId.value = next?.id ?? null
  }
}

function refuse() {
  if (selectedId.value) {
    gradesStore.refuseCorrection(selectedId.value)
    const next = pending.value.find(c => c.id !== selectedId.value)
    selectedId.value = next?.id ?? null
  }
}
</script>

<style scoped>
.page { padding: 32px; height: 100%; display: flex; flex-direction: column; }
.page-header { margin-bottom: 24px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700; color: var(--k-navy); margin: 0 0 4px; }
.page-sub { font-size: 13px; color: var(--k-text-muted); margin: 0; }
.corrections-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; flex: 1; }
.queue-panel { display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
.queue-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--k-text-muted); margin: 0 0 8px; }
.correction-card { background: #fff; border: 1px solid var(--k-border); border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: border-color 0.15s; }
.correction-card:hover { border-color: var(--k-blue); }
.correction-card--selected { border-color: var(--k-navy); box-shadow: 0 0 0 2px rgba(8,58,140,0.12); }
.correction-card--treated { opacity: 0.65; cursor: default; }
.correction-card + .correction-card { margin-top: 8px; }
.correction-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.correction-name { font-size: 14px; font-weight: 600; color: var(--k-text); }
.correction-detail { font-size: 12px; color: var(--k-text-muted); margin: 0 0 2px; }
.correction-date { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #9ca3af; margin: 0; }
.detail-panel { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 28px; }
.detail-panel--empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #9ca3af; font-size: 14px; min-height: 200px; }
.detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.detail-title { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700; color: var(--k-navy); margin: 0; }
.detail-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
.detail-field { display: flex; flex-direction: column; gap: 4px; }
.detail-field--full { grid-column: 1 / -1; }
.detail-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--k-text-muted); }
.detail-value { font-size: 14px; color: var(--k-text); }
.score-old { color: #991b1b; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
.score-new { color: #166534; font-weight: 700; font-family: 'IBM Plex Mono', monospace; }
.detail-actions { display: flex; gap: 12px; justify-content: flex-end; border-top: 1px solid var(--k-border); padding-top: 20px; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; }
.btn--approve { background: var(--k-navy); color: #fff; }
.btn--refuse { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
</style>

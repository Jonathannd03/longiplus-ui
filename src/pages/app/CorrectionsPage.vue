<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Demandes de correction</h1>
        <p class="page-sub">{{ pending.length }} demande(s) en attente d'approbation</p>
      </div>
    </div>

    <div v-if="loading" class="state-msg">Chargement…</div>
    <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>

    <div v-else class="corrections-layout">
      <!-- Left: queue -->
      <div class="queue-panel">
        <div class="queue-section">
          <p class="queue-label">EN ATTENTE ({{ pending.length }})</p>
          <div
            v-for="c in pending"
            :key="c.id"
            :class="['correction-card', selectedId === c.id ? 'correction-card--selected' : '']"
            @click="selectedId = c.id"
          >
            <div class="correction-top">
              <span class="correction-name">{{ c.studentLastName }} {{ c.studentFirstName }}</span>
              <StatusBadge variant="warning">En attente</StatusBadge>
            </div>
            <p class="correction-detail">{{ c.subjectName }} · {{ c.periodLabel }} · {{ c.currentScore ?? '—' }} → {{ c.newScore }}</p>
            <p class="correction-date">{{ formatDate(c.createdAt) }}</p>
          </div>
          <p v-if="pending.length === 0" class="empty-msg">Aucune demande en attente</p>
        </div>
        <div class="queue-section" v-if="treated.length > 0">
          <p class="queue-label">TRAITÉS RÉCEMMENT</p>
          <div v-for="c in treated" :key="c.id" class="correction-card correction-card--treated">
            <div class="correction-top">
              <span class="correction-name">{{ c.studentLastName }} {{ c.studentFirstName }}</span>
              <StatusBadge :variant="c.status === 'approved' ? 'success' : 'error'">
                {{ c.status === 'approved' ? 'Approuvé' : 'Refusé' }}
              </StatusBadge>
            </div>
            <p class="correction-detail">{{ c.subjectName }} · {{ c.periodLabel }} · {{ c.currentScore ?? '—' }} → {{ c.newScore }}</p>
            <p class="correction-date">{{ formatDate(c.createdAt) }}</p>
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
            <span class="detail-value">{{ selected.studentLastName }} {{ selected.studentFirstName }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Cours</span>
            <span class="detail-value">{{ selected.subjectName }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Période</span>
            <span class="detail-value">{{ selected.periodLabel }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Note actuelle</span>
            <span class="detail-value score-old">{{ selected.currentScore ?? '—' }}</span>
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

        <div v-if="actionError" class="action-error">{{ actionError }}</div>

        <div class="detail-actions">
          <button class="btn btn--refuse" @click="openRefuse" :disabled="acting">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Refuser
          </button>
          <button class="btn btn--approve" @click="approve" :disabled="acting">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {{ acting ? 'Traitement…' : 'Approuver la correction' }}
          </button>
        </div>
      </div>

      <div class="detail-panel detail-panel--empty" v-else>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <p>Sélectionnez une demande pour l'examiner</p>
      </div>
    </div>

    <!-- Refuse modal -->
    <div v-if="showRefuseModal" class="modal-overlay" @click.self="showRefuseModal = false">
      <div class="modal">
        <h3 class="modal-title">Motif du refus</h3>
        <textarea
          v-model="refuseNote"
          class="modal-textarea"
          placeholder="Expliquez pourquoi cette correction est refusée…"
          rows="4"
        ></textarea>
        <div class="modal-actions">
          <button class="btn btn--ghost" @click="showRefuseModal = false">Annuler</button>
          <button class="btn btn--refuse" @click="confirmRefuse" :disabled="!refuseNote.trim() || acting">
            Confirmer le refus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSetupApi } from '@/api/setup'
import type { CorrectionRequest } from '@/api/setup'
import StatusBadge from '@/components/StatusBadge.vue'

const api = useSetupApi()

const loading = ref(true)
const error = ref('')
const acting = ref(false)
const actionError = ref('')
const showRefuseModal = ref(false)
const refuseNote = ref('')

const corrections = ref<CorrectionRequest[]>([])
const selectedId = ref<string | null>(null)

const pending = computed(() => corrections.value.filter(c => c.status === 'pending'))
const treated = computed(() => corrections.value.filter(c => c.status !== 'pending'))
const selected = computed(() => pending.value.find(c => c.id === selectedId.value) ?? null)

onMounted(async () => {
  try {
    corrections.value = await api.corrections.list()
    selectedId.value = pending.value[0]?.id ?? null
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur de chargement'
  } finally {
    loading.value = false
  }
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-CD', { day: 'numeric', month: 'short', year: 'numeric' })
}

function advanceSelection(excludeId: string) {
  const next = pending.value.find(c => c.id !== excludeId)
  selectedId.value = next?.id ?? null
}

async function approve() {
  if (!selectedId.value || acting.value) return
  const id = selectedId.value
  acting.value = true
  actionError.value = ''
  try {
    await api.corrections.approve(id)
    corrections.value = corrections.value.map(c =>
      c.id === id ? { ...c, status: 'approved' as const } : c
    )
    advanceSelection(id)
  } catch (e) {
    actionError.value = e instanceof Error ? e.message : 'Erreur'
  } finally {
    acting.value = false
  }
}

function openRefuse() {
  refuseNote.value = ''
  showRefuseModal.value = true
}

async function confirmRefuse() {
  if (!selectedId.value || !refuseNote.value.trim() || acting.value) return
  const id = selectedId.value
  acting.value = true
  actionError.value = ''
  try {
    await api.corrections.reject(id, refuseNote.value.trim())
    corrections.value = corrections.value.map(c =>
      c.id === id ? { ...c, status: 'rejected' as const } : c
    )
    advanceSelection(id)
    showRefuseModal.value = false
  } catch (e) {
    actionError.value = e instanceof Error ? e.message : 'Erreur'
  } finally {
    acting.value = false
  }
}
</script>

<style scoped>
.page { padding: 32px; height: 100%; display: flex; flex-direction: column; }
.page-header { margin-bottom: 24px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700; color: var(--k-navy); margin: 0 0 4px; }
.page-sub { font-size: 13px; color: var(--k-text-muted); margin: 0; }

.state-msg { padding: 60px; text-align: center; color: #6b7280; font-size: 14px; }
.state-msg--error { color: #ef4444; }

.corrections-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; flex: 1; min-height: 0; }
.queue-panel { display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
.queue-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--k-text-muted); margin: 0 0 8px; }
.empty-msg { font-size: 13px; color: #9ca3af; padding: 12px 0; }
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

.action-error { background: #fee2e2; color: #991b1b; border-radius: 6px; padding: 10px 14px; font-size: 13px; margin-bottom: 12px; }

.detail-actions { display: flex; gap: 12px; justify-content: flex-end; border-top: 1px solid var(--k-border); padding-top: 20px; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--approve { background: var(--k-navy); color: #fff; }
.btn--refuse { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.btn--ghost { background: #fff; color: var(--k-text); border: 1px solid #d1d5db; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: #fff; border-radius: 12px; padding: 28px; width: 480px; max-width: calc(100vw - 40px); }
.modal-title { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700; color: var(--k-navy); margin: 0 0 16px; }
.modal-textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: inherit; resize: vertical; box-sizing: border-box; }
.modal-textarea:focus { outline: none; border-color: var(--k-blue); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
</style>

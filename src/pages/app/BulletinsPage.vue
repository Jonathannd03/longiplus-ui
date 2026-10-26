<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Bulletins<template v-if="activePeriod"> — {{ activePeriod.label }}</template></h1>
        <p class="page-sub">{{ publishedCount }}/{{ sections.length }} classes publiées</p>
      </div>
      <button class="btn btn--navy" :disabled="generating || readyCount === 0" @click="publishAll">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        {{ generating ? 'Génération…' : 'Tout publier' }}
      </button>
    </div>

    <div v-if="loading" class="loading-hint">Chargement des bulletins…</div>

    <template v-else>
      <!-- Pipeline progress -->
      <div class="pipeline">
        <div v-for="(stage, i) in pipeline" :key="i" class="pipeline-stage">
          <div class="stage-num">{{ stage.count }}</div>
          <div class="stage-label">{{ stage.label }}</div>
          <div v-if="i < pipeline.length - 1" class="stage-arrow">›</div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="genError" class="error-banner">{{ genError }}</div>

      <!-- Classes table -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Classe</th>
              <th>Notes saisies</th>
              <th>Bulletins générés</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sections.length === 0">
              <td colspan="5" style="text-align:center;color:#9ca3af;padding:24px">Aucune classe cette année</td>
            </tr>
            <tr v-for="s in sections" :key="s.id">
              <td class="class-name">{{ s.name }}</td>
              <td>
                <div class="progress-bar-wrapper">
                  <div class="progress-bar-track">
                    <div class="progress-bar-fill" :style="{ width: s.notesPercent + '%', background: s.notesPercent === 100 ? '#16a34a' : 'var(--k-blue)' }"></div>
                  </div>
                  <span class="progress-label">{{ s.notesPercent }}%</span>
                </div>
              </td>
              <td>{{ s.bulletinCount }}</td>
              <td><StatusBadge :variant="statusVariant(s.status)">{{ statusLabel(s.status) }}</StatusBadge></td>
              <td>
                <button
                  v-if="s.status === 'ready'"
                  class="btn btn--sm btn--navy"
                  :disabled="generating"
                  @click="generate(s)"
                >
                  {{ generating ? '…' : 'Générer et publier' }}
                </button>
                <RouterLink
                  v-else-if="s.status === 'published'"
                  :to="`/app/bulletins/${s.id}`"
                  class="btn btn--sm btn--ghost"
                >
                  Voir
                </RouterLink>
                <button v-else class="btn btn--sm btn--ghost" disabled>En attente</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Info box -->
      <div class="info-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div>
          <strong>Publication du bulletin</strong> : Dès qu'une classe est publiée, les parents reçoivent un SMS avec le lien vers le bulletin de leur enfant.
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSetupApi } from '@/api/setup'
import type { BulletinSectionStatus, AcademicYear, Period } from '@/api/setup'
import StatusBadge from '@/components/StatusBadge.vue'

const api = useSetupApi()

const loading = ref(true)
const generating = ref(false)
const genError = ref('')
const sections = ref<BulletinSectionStatus[]>([])
const activeYear = ref<AcademicYear | null>(null)
const activePeriod = ref<Period | null>(null)

const publishedCount = computed(() => sections.value.filter(s => s.status === 'published').length)
const readyCount = computed(() => sections.value.filter(s => s.status === 'ready').length)

const pipeline = computed(() => [
  { count: sections.value.filter(s => s.status === 'missing_notes').length, label: 'Notes manquantes' },
  { count: sections.value.filter(s => s.status === 'in_progress').length, label: 'En cours' },
  { count: readyCount.value, label: 'Prêts à publier' },
  { count: publishedCount.value, label: 'Publiés' },
])

function statusVariant(status: string): 'success' | 'warning' | 'info' | 'neutral' {
  const map: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
    published: 'success',
    ready: 'info',
    missing_notes: 'warning',
    in_progress: 'neutral',
  }
  return map[status] ?? 'neutral'
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    published: 'Publié',
    ready: 'Prêt',
    missing_notes: 'Notes manquantes',
    in_progress: 'En cours',
  }
  return map[status] ?? status
}

async function generate(section: BulletinSectionStatus) {
  if (!activeYear.value) return
  generating.value = true
  genError.value = ''
  try {
    await api.bulletins.generate({
      classSectionId: section.id,
      periodId: section.periodId,
      yearId: activeYear.value.id,
    })
    const idx = sections.value.findIndex(s => s.id === section.id)
    if (idx !== -1) {
      const existing = sections.value[idx]
      if (existing) sections.value[idx] = { ...existing, status: 'published' }
    }
  } catch (err) {
    genError.value = 'Erreur lors de la génération des bulletins. Vérifiez que toutes les notes sont saisies.'
    console.error(err)
  } finally {
    generating.value = false
  }
}

async function publishAll() {
  const readySections = sections.value.filter(s => s.status === 'ready')
  for (const s of readySections) {
    await generate(s)
  }
}

onMounted(async () => {
  try {
    const years = await api.academicYears.list()
    const active = years.find(y => y.status === 'active') ?? years[0] ?? null
    activeYear.value = active
    if (!active) return

    const detail = await api.academicYears.get(active.id)
    activePeriod.value = detail.periods.find(p => p.status === 'open') ?? detail.periods[detail.periods.length - 1] ?? null

    sections.value = await api.bulletins.status(active.id)
  } catch (err) {
    console.error('BulletinsPage load error', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page { padding: 32px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 700; color: var(--k-navy); margin: 0 0 4px; }
.page-sub { font-size: 13px; color: var(--k-text-muted); margin: 0; }
.loading-hint { color: #9ca3af; font-size: 14px; padding: 8px 0 24px; }
.error-banner { background: #fee2e2; color: #991b1b; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; }
.btn--navy { background: var(--k-navy); color: #fff; }
.btn--ghost { background: transparent; border: 1px solid #d1d5db; color: var(--k-text); }
.btn--sm { padding: 6px 12px; font-size: 12px; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pipeline { display: flex; align-items: center; background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px 24px; margin-bottom: 24px; }
.pipeline-stage { display: flex; align-items: center; gap: 8px; flex: 1; }
.stage-num { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; color: var(--k-navy); }
.stage-label { font-size: 13px; color: var(--k-text-muted); }
.stage-arrow { color: #9ca3af; font-size: 20px; padding: 0 16px; }
.table-wrapper { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); overflow: hidden; margin-bottom: 16px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { background: #f9fafb; padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--k-text-muted); border-bottom: 1px solid var(--k-border); white-space: nowrap; }
.data-table td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.class-name { font-weight: 600; color: var(--k-text); }
.progress-bar-wrapper { display: flex; align-items: center; gap: 8px; }
.progress-bar-track { flex: 1; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; min-width: 80px; }
.progress-bar-fill { height: 100%; border-radius: 3px; }
.progress-label { font-size: 12px; color: var(--k-text-muted); white-space: nowrap; }
.info-box { display: flex; gap: 12px; background: var(--k-sky); border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px 16px; font-size: 13px; color: var(--k-navy); }
</style>

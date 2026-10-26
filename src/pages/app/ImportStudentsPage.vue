<template>
  <div class="page">
    <div class="page-content">
      <p class="breadcrumb"><RouterLink to="/app/students">Élèves et familles</RouterLink> › Importer depuis Excel</p>
      <h1 class="page-title">Importation des élèves</h1>

      <div v-if="noYear" class="alert-warn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Aucune année scolaire configurée. <RouterLink to="/app/onboarding/year" class="alert-link">Configurer l'année</RouterLink> avant d'importer des élèves.
      </div>

      <div class="import-options">
        <RouterLink to="/app/students/new" class="option-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Inscrire un élève manuellement
        </RouterLink>
      </div>

      <div class="steps-bar">
        <div v-for="(step, i) in steps" :key="i" class="step-item" :class="{ 'step-item--active': currentStep === i, 'step-item--done': currentStep > i }">
          <div class="step-circle">
            <svg v-if="currentStep > i" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="step-label">{{ step }}</span>
          <div v-if="i < steps.length - 1" class="step-line"></div>
        </div>
      </div>

      <!-- Step 0: Upload -->
      <div v-if="currentStep === 0" class="step-panel">
        <div class="format-guide">
          <p class="format-guide__title">Colonnes attendues dans votre fichier</p>
          <div class="format-cols">
            <div class="format-col format-col--required">
              <span class="format-col__badge">Obligatoire</span>
              <ul>
                <li><code>Nom</code></li>
                <li><code>Post-nom</code></li>
                <li><code>Prénom</code></li>
                <li><code>Sexe</code> <span class="format-hint">M ou F</span></li>
                <li><code>Date de naissance</code> <span class="format-hint">AAAA-MM-JJ ou JJ/MM/AAAA</span></li>
                <li><code>Classe</code> <span class="format-hint">nom exact de la classe</span></li>
              </ul>
            </div>
            <div class="format-col format-col--optional">
              <span class="format-col__badge">Facultatif</span>
              <ul>
                <li><code>Lieu de naissance</code></li>
                <li><code>Nom du parent</code></li>
                <li><code>Téléphone du parent</code> <span class="format-hint">+243…</span></li>
              </ul>
            </div>
          </div>
        </div>

        <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden-input" @change="onFileChange" />
        <div
          class="upload-zone"
          :class="{ 'upload-zone--drag': dragging }"
          @click="fileInput?.click()"
          @dragover.prevent="dragging = true"
          @dragleave="dragging = false"
          @drop.prevent="onDrop"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p class="upload-label" v-if="!selectedFile">Glissez votre fichier Excel ici, ou <span class="link">parcourir</span></p>
          <p class="upload-label" v-else>{{ selectedFile.name }}</p>
          <p class="upload-hint">.xlsx ou .csv · 5 MB max</p>
        </div>
        <div class="template-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <button class="link-btn" @click="downloadTemplate">Télécharger le modèle Excel LongiPlus</button>
        </div>
        <p v-if="uploadError" class="form-error">{{ uploadError }}</p>
        <div class="step-actions" v-if="selectedFile">
          <button class="btn btn--navy" :disabled="previewing" @click="doPreview">
            {{ previewing ? 'Analyse en cours…' : 'Vérifier le fichier' }}
          </button>
        </div>
      </div>

      <!-- Step 1: Preview -->
      <div v-if="currentStep === 1 && previewData" class="step-panel">
        <div class="verify-header">
          <div class="verify-stats">
            <div class="verify-stat verify-stat--ok"><strong>{{ previewData.stats.ok }}</strong> Prêts à importer</div>
            <div class="verify-stat verify-stat--warn"><strong>{{ previewData.stats.warnings }}</strong> Avertissements</div>
            <div class="verify-stat verify-stat--error"><strong>{{ previewData.stats.errors }}</strong> Erreurs</div>
          </div>
          <p class="verify-desc">Vérifiez les lignes en erreur avant de continuer.</p>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ligne</th><th>Nom complet</th><th>Sexe</th><th>Naissance</th><th>Classe</th><th>Téléphone parent</th><th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in previewData.rows" :key="row.line">
                <td class="mono">{{ row.line }}</td>
                <td>{{ row.lastName }} {{ row.postName }} {{ row.firstName }}</td>
                <td>{{ row.sex }}</td>
                <td>{{ row.birthDate }}</td>
                <td>{{ row.className }}</td>
                <td class="mono">{{ row.guardianPhone || '—' }}</td>
                <td>
                  <span v-if="row.errors.length > 0" class="row-badge row-badge--error" :title="row.errors.join(', ')">
                    {{ row.errors[0] }}
                  </span>
                  <span v-else-if="row.warnings.length > 0" class="row-badge row-badge--warn" :title="row.warnings.join(', ')">
                    Avertissement
                  </span>
                  <span v-else class="row-badge row-badge--ok">OK</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="commitError" class="form-error">{{ commitError }}</p>
        <div class="step-actions">
          <button class="btn btn--ghost" @click="currentStep = 0; previewData = null">Retour</button>
          <button class="btn btn--navy" :disabled="committing || previewData.stats.ok === 0" @click="doCommit">
            {{ committing ? 'Import en cours…' : `Importer ${previewData.stats.ok} élève${previewData.stats.ok !== 1 ? 's' : ''}` }}
          </button>
        </div>
      </div>

      <!-- Step 2: Success -->
      <div v-if="currentStep === 2 && commitResult" class="step-panel step-panel--center">
        <div class="success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 class="success-title">{{ commitResult.inserted }} élève{{ commitResult.inserted !== 1 ? 's' : '' }} importé{{ commitResult.inserted !== 1 ? 's' : '' }} avec succès</h2>
        <p v-if="commitResult.skipped > 0" class="success-desc">{{ commitResult.skipped }} doublon{{ commitResult.skipped !== 1 ? 's' : '' }} ignoré{{ commitResult.skipped !== 1 ? 's' : '' }}.</p>
        <p class="success-desc">Ils apparaissent dans la liste des élèves et les feuilles d'appel.</p>
        <div class="success-actions">
          <RouterLink to="/app/students" class="btn btn--navy">Voir la liste des élèves</RouterLink>
          <button class="btn btn--ghost" @click="startOver">Faire un autre import</button>
          <button class="btn btn--danger" @click="doUndo" :disabled="undoing">
            {{ undoing ? 'Annulation…' : 'Annuler cet import' }}
          </button>
        </div>
        <p v-if="undoError" class="form-error">{{ undoError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useSetupApi } from '@/api/setup'
import { useAcademicYears } from '@/composables/queries'
import type { ImportPreview, ImportResult } from '@/api/setup'

const api = useSetupApi()
const queryClient = useQueryClient()

const { data: years, isError: yearsError } = useAcademicYears()
const activeYearId = computed(() => (years.value?.find(y => y.status === 'active') ?? years.value?.[0])?.id ?? '')
const noYear = computed(() => yearsError.value || (years.value !== undefined && years.value.length === 0))

const steps = ['Charger le fichier', 'Vérification', 'Import terminé']
const currentStep = ref(0)

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const dragging = ref(false)

const previewing = ref(false)
const committing = ref(false)
const undoing = ref(false)

const uploadError = ref('')
const commitError = ref('')
const undoError = ref('')

const previewData = ref<ImportPreview | null>(null)
const commitResult = ref<ImportResult | null>(null)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) { selectedFile.value = file; uploadError.value = '' }
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) { selectedFile.value = file; uploadError.value = '' }
}

async function doPreview() {
  if (!selectedFile.value || previewing.value) return
  if (!activeYearId.value) { uploadError.value = 'Aucune année scolaire configurée.'; return }
  previewing.value = true
  uploadError.value = ''
  try {
    previewData.value = await api.students.import.preview(activeYearId.value, selectedFile.value)
    currentStep.value = 1
  } catch (e) {
    uploadError.value = e instanceof Error ? e.message : 'Erreur lors de l\'analyse'
  } finally {
    previewing.value = false
  }
}

async function doCommit() {
  if (!selectedFile.value || !activeYearId.value || committing.value) return
  committing.value = true
  commitError.value = ''
  try {
    commitResult.value = await api.students.import.commit(activeYearId.value, selectedFile.value)
    currentStep.value = 2
    await queryClient.invalidateQueries({ queryKey: ['students', activeYearId.value] })
  } catch (e) {
    commitError.value = e instanceof Error ? e.message : 'Erreur lors de l\'import'
  } finally {
    committing.value = false
  }
}

async function doUndo() {
  if (!commitResult.value || undoing.value) return
  undoing.value = true
  undoError.value = ''
  try {
    await api.students.import.undo(commitResult.value.batchId)
    startOver()
  } catch (e) {
    undoError.value = e instanceof Error ? e.message : 'Erreur lors de l\'annulation'
  } finally {
    undoing.value = false
  }
}

function startOver() {
  currentStep.value = 0
  selectedFile.value = null
  previewData.value = null
  commitResult.value = null
  uploadError.value = ''
  commitError.value = ''
  undoError.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function downloadTemplate() {
  const headers = 'Nom,Post-nom,Prénom,Sexe,Date de naissance,Lieu de naissance,Classe,Nom du parent,Téléphone du parent\n'
  const example = 'KABONGO,Ilunga,José,M,2010-03-15,Kinshasa,4S A,KABONGO Jean,+243812345678\n'
  const blob = new Blob(['﻿' + headers + example], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'modele-longiplus.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.page { padding: 32px; }
.page-content { max-width: 1200px; }
.breadcrumb { font-size: 13px; color: var(--k-text-muted); margin: 0 0 8px; }
.breadcrumb a { color: var(--k-blue); text-decoration: none; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; color: var(--k-navy); margin: 0 0 28px; }

.steps-bar { display: flex; align-items: center; margin-bottom: 32px; }
.step-item { display: flex; align-items: center; gap: 10px; }
.step-circle { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #6b7280; flex-shrink: 0; }
.step-item--active .step-circle { border-color: var(--k-navy); background: var(--k-navy); color: #fff; }
.step-item--done .step-circle { border-color: #16a34a; background: #16a34a; color: #fff; }
.step-label { font-size: 13px; color: #6b7280; white-space: nowrap; }
.step-item--active .step-label { color: var(--k-navy); font-weight: 600; }
.step-line { flex: 1; height: 1px; background: #e5e7eb; min-width: 48px; margin: 0 8px; }

.step-panel { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 32px; }
.step-panel--center { text-align: center; }

.hidden-input { display: none; }
.upload-zone {
  border: 2px dashed #d1d5db; border-radius: 12px; padding: 48px;
  text-align: center; cursor: pointer; transition: border-color 0.15s;
}
.upload-zone:hover, .upload-zone--drag { border-color: var(--k-blue); background: var(--k-sky); }
.upload-label { font-size: 15px; color: #374151; margin: 12px 0 4px; }
.upload-hint { font-size: 13px; color: #9ca3af; margin: 0; }
.link { color: var(--k-blue); }
.template-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--k-text-muted); margin-top: 16px; }
.link-btn { background: none; border: none; color: var(--k-blue); font-size: 13px; cursor: pointer; padding: 0; text-decoration: underline; }

.verify-header { margin-bottom: 20px; }
.verify-stats { display: flex; gap: 12px; margin-bottom: 8px; }
.verify-stat { font-size: 13px; padding: 4px 12px; border-radius: 6px; }
.verify-stat--ok { background: #f0fdf4; color: #166534; }
.verify-stat--warn { background: #fefce8; color: #854d0e; }
.verify-stat--error { background: #fef2f2; color: #991b1b; }
.verify-desc { font-size: 13px; color: var(--k-text-muted); margin: 0; }

.table-wrapper { overflow-x: auto; border: 1px solid var(--k-border); border-radius: 8px; margin-bottom: 16px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { background: #f9fafb; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--k-text-muted); border-bottom: 1px solid var(--k-border); white-space: nowrap; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
.data-table tr:last-child td { border-bottom: none; }
.mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
.row-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
.row-badge--ok { background: #dcfce7; color: #166534; }
.row-badge--warn { background: #fef9c3; color: #854d0e; }
.row-badge--error { background: #fee2e2; color: #991b1b; }

.form-error { color: #ef4444; font-size: 13px; margin: 12px 0 0; }
.step-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }

.success-icon { width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.success-title { font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; color: var(--k-navy); margin: 0 0 8px; }
.success-desc { font-size: 14px; color: var(--k-text-muted); margin: 0 0 8px; }
.success-actions { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 24px; }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; }
.btn--navy { background: var(--k-navy); color: #fff; }
.btn--navy:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--ghost { background: transparent; color: var(--k-text); border: 1px solid #d1d5db; }
.btn--danger { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.btn--danger:disabled { opacity: 0.5; cursor: not-allowed; }

.format-guide {
  background: #f9fafb; border: 1px solid var(--k-border); border-radius: 10px;
  padding: 16px 20px; margin-bottom: 20px;
}
.format-guide__title { font-size: 13px; font-weight: 600; color: var(--k-navy); margin: 0 0 12px; }
.format-cols { display: flex; gap: 32px; }
.format-col ul { list-style: none; padding: 0; margin: 8px 0 0; display: flex; flex-direction: column; gap: 5px; }
.format-col li { font-size: 13px; color: #374151; display: flex; align-items: baseline; gap: 6px; }
.format-col code { background: #e5e7eb; border-radius: 4px; padding: 1px 6px; font-size: 12px; font-family: 'IBM Plex Mono', monospace; color: #1a1a2e; }
.format-col__badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; }
.format-col--required .format-col__badge { background: #fee2e2; color: #991b1b; }
.format-col--optional .format-col__badge { background: #f3f4f6; color: #6b7280; }
.format-hint { font-size: 11px; color: #9ca3af; }

.alert-warn {
  display: flex; align-items: center; gap: 10px;
  background: #fef9c3; border: 1px solid #fef08a; border-radius: 8px;
  padding: 12px 16px; font-size: 13px; color: #854d0e; margin-bottom: 20px;
}
.alert-link { color: #854d0e; font-weight: 600; }

.import-options {
  display: flex; justify-content: flex-end; margin-bottom: 16px;
}
.option-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: var(--k-blue); text-decoration: none;
}
.option-link:hover { text-decoration: underline; }
</style>

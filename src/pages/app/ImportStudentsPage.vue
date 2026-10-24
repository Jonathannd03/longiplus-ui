<template>
  <div class="page">
    <div class="page-content">
      <p class="breadcrumb"><RouterLink to="/app/students">Élèves et familles</RouterLink> › Importer depuis Excel</p>
      <h1 class="page-title">Importation des élèves</h1>

      <!-- Step indicator -->
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
        <div class="upload-zone" @click="currentStep = 1">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p class="upload-label">Glissez votre fichier Excel ici, ou <span class="link">parcourir</span></p>
          <p class="upload-hint">.xlsx ou .csv — 5 MB max</p>
        </div>
        <div class="template-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Télécharger le <a href="#" class="link">modèle Excel LongiPlus</a>
        </div>
      </div>

      <!-- Step 1: Verification -->
      <div v-if="currentStep === 1" class="step-panel">
        <div class="verify-header">
          <div class="verify-stats">
            <div class="verify-stat verify-stat--ok"><strong>127</strong> Prêts à importer</div>
            <div class="verify-stat verify-stat--warn"><strong>4</strong> Avertissements</div>
            <div class="verify-stat verify-stat--error"><strong>2</strong> Erreurs</div>
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
              <tr v-for="row in previewRows" :key="row.line">
                <td class="mono">{{ row.line }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.sex }}</td>
                <td>{{ row.birth }}</td>
                <td>{{ row.classe }}</td>
                <td class="mono">{{ row.phone }}</td>
                <td>
                  <span :class="['row-badge', `row-badge--${row.status}`]">
                    {{ row.statusLabel }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="step-actions">
          <button class="btn btn--ghost" @click="currentStep = 0">Retour</button>
          <button class="btn btn--navy" @click="currentStep = 2">Continuer l'import (127 élèves)</button>
        </div>
      </div>

      <!-- Step 2: Success -->
      <div v-if="currentStep === 2" class="step-panel step-panel--center">
        <div class="success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 class="success-title">127 élèves importés avec succès</h2>
        <p class="success-desc">Ils apparaissent dans la liste, les feuilles d'appel et les carnets de notes de leurs classes.</p>
        <div class="success-actions">
          <RouterLink to="/app/students" class="btn btn--navy">Voir la liste des élèves</RouterLink>
          <button class="btn btn--ghost" @click="currentStep = 0">Faire un autre import</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const steps = ['Charger le fichier', 'Vérification', 'Import terminé']
const currentStep = ref(0)

const previewRows = [
  { line: 1, name: 'KABONGO Grace', sex: 'F', birth: '12/03/2012', classe: '4e Sc. A', phone: '+243 81 234 5678', status: 'ok', statusLabel: 'OK' },
  { line: 2, name: 'LUKUSA Patrick', sex: 'M', birth: '05/07/2011', classe: '4e Sc. A', phone: '+243 82 345 6789', status: 'ok', statusLabel: 'OK' },
  { line: 3, name: 'WEMBI Christelle', sex: 'F', birth: '22/11/2012', classe: '4e Sc. B', phone: '+243 81 456 7890', status: 'ok', statusLabel: 'OK' },
  { line: 4, name: 'AMISI Joseph', sex: 'M', birth: '08/04/2012', classe: '4e Sc. A', phone: '', status: 'warn', statusLabel: 'Sans téléphone' },
  { line: 5, name: 'BAHATI Esther', sex: 'F', birth: '14/09/2012', classe: '4e Sc. A', phone: '+243 99 567 8901', status: 'ok', statusLabel: 'OK' },
  { line: 6, name: 'MBUYI', sex: 'F', birth: '01/01/2013', classe: 'Inconnue', phone: '+243 81 678 9012', status: 'error', statusLabel: 'Classe manquante' },
  { line: 7, name: 'NGALULA Sophie', sex: 'F', birth: '30/06/2012', classe: '3e Com.', phone: '+243 82 789 0123', status: 'ok', statusLabel: 'OK' },
]
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
.upload-zone { border: 2px dashed #d1d5db; border-radius: 12px; padding: 48px; text-align: center; cursor: pointer; transition: border-color 0.15s; }
.upload-zone:hover { border-color: var(--k-blue); }
.upload-label { font-size: 15px; color: #374151; margin: 12px 0 4px; }
.upload-hint { font-size: 13px; color: #9ca3af; margin: 0; }
.link { color: var(--k-blue); cursor: pointer; }
.template-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--k-text-muted); margin-top: 16px; }
.verify-header { margin-bottom: 20px; }
.verify-stats { display: flex; gap: 12px; margin-bottom: 8px; }
.verify-stat { font-size: 13px; padding: 4px 12px; border-radius: 6px; }
.verify-stat--ok { background: #f0fdf4; color: #166534; }
.verify-stat--warn { background: #fefce8; color: #854d0e; }
.verify-stat--error { background: #fef2f2; color: #991b1b; }
.verify-desc { font-size: 13px; color: var(--k-text-muted); margin: 0; }
.table-wrapper { overflow-x: auto; border: 1px solid var(--k-border); border-radius: 8px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { background: #f9fafb; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--k-text-muted); border-bottom: 1px solid var(--k-border); white-space: nowrap; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
.data-table tr:last-child td { border-bottom: none; }
.mono { font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
.row-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
.row-badge--ok { background: #dcfce7; color: #166534; }
.row-badge--warn { background: #fef9c3; color: #854d0e; }
.row-badge--error { background: #fee2e2; color: #991b1b; }
.step-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; }
.btn--navy { background: var(--k-navy); color: #fff; }
.btn--ghost { background: transparent; color: var(--k-text); border: 1px solid #d1d5db; }
.success-icon { width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.success-title { font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; color: var(--k-navy); margin: 0 0 8px; }
.success-desc { font-size: 14px; color: var(--k-text-muted); margin: 0 0 28px; }
.success-actions { display: flex; align-items: center; justify-content: center; gap: 12px; }
</style>

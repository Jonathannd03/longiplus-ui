<template>
  <div class="page">
    <div class="page-content">
      <p class="breadcrumb"><RouterLink to="/app/students">Élèves et familles</RouterLink> › {{ student?.firstName }} {{ student?.lastName }}</p>

      <!-- Header -->
      <div class="profile-header">
        <div class="avatar">{{ student?.initials }}</div>
        <div class="profile-info">
          <h1 class="profile-name">{{ student?.lastName }} {{ student?.postName }} {{ student?.firstName }}</h1>
          <div class="profile-meta">
            <span class="code">{{ student?.code }}</span>
            <span>{{ student?.className }}</span>
            <StatusBadge :variant="student?.isNew ? 'warning' : 'success'">{{ student?.isNew ? 'Nouvelle' : 'Actif' }}</StatusBadge>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn--ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Modifier
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button v-for="tab in tabs" :key="tab.id" :class="['tab-btn', activeTab === tab.id ? 'tab-btn--active' : '']" @click="activeTab = tab.id">
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab: Résultats -->
      <div v-if="activeTab === 'results'" class="tab-content">
        <div class="results-header">
          <h2 class="section-title">Notes — 4e Sc. A · Période P2</h2>
          <span class="avg-badge">Moyenne générale : <strong>14,6 / 20</strong></span>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Cours</th><th>Enseignant</th><th>Max</th><th>Note</th><th>/ 20</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in studentGrades" :key="g.course">
                <td>{{ g.course }}</td>
                <td>{{ g.teacher }}</td>
                <td>{{ g.max }}</td>
                <td><strong>{{ g.score }}</strong></td>
                <td>{{ (g.score / g.max * 20).toFixed(1) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4"><strong>Total P2</strong></td>
                <td><strong>14,6</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Tab: Présences -->
      <div v-if="activeTab === 'attendance'" class="tab-content">
        <div class="attendance-grid">
          <div class="att-stat"><div class="att-num">96%</div><div class="att-label">Taux de présence T1</div></div>
          <div class="att-stat"><div class="att-num">2</div><div class="att-label">Absences ce mois</div></div>
          <div class="att-stat"><div class="att-num">0</div><div class="att-label">Retards</div></div>
        </div>
        <div class="absence-list">
          <h3 class="subsection-title">Dernières absences</h3>
          <div v-for="a in absences" :key="a.date" class="absence-row">
            <span class="absence-date">{{ a.date }}</span>
            <span class="absence-label">{{ a.label }}</span>
            <StatusBadge :variant="a.justified ? 'success' : 'warning'">{{ a.justified ? 'Justifiée' : 'Non justifiée' }}</StatusBadge>
          </div>
        </div>
      </div>

      <!-- Tab: Famille -->
      <div v-if="activeTab === 'family'" class="tab-content">
        <div class="family-card">
          <div class="family-header">
            <div class="family-avatar">KM</div>
            <div>
              <p class="family-name">KABONGO Mujinga Thérèse</p>
              <p class="family-role">Mère · Parent responsable</p>
            </div>
          </div>
          <div class="family-fields">
            <div class="family-field">
              <span class="field-label">Téléphone</span>
              <span class="field-value">+243 81 234 5678</span>
            </div>
            <div class="family-field">
              <span class="field-label">SMS LongiPlus</span>
              <StatusBadge variant="success">Actif</StatusBadge>
            </div>
          </div>
          <p class="family-siblings"><strong>Autres enfants dans l'école :</strong> Patrick (4e Sc. A) · Esther (2e Péda.)</p>
        </div>
      </div>

      <!-- Tab: Parcours -->
      <div v-if="activeTab === 'parcours'" class="tab-content">
        <div class="timeline">
          <div class="timeline-item" v-for="item in parcours" :key="item.year">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-year">{{ item.year }}</span>
              <span class="timeline-class">{{ item.classe }}</span>
              <StatusBadge :variant="item.result === 'Admis(e)' ? 'success' : 'warning'">{{ item.result }}</StatusBadge>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Messages -->
      <div v-if="activeTab === 'messages'" class="tab-content">
        <div v-for="msg in messages" :key="msg.date" class="msg-row">
          <div class="msg-meta">
            <span class="msg-date">{{ msg.date }}</span>
            <StatusBadge variant="neutral">{{ msg.type }}</StatusBadge>
          </div>
          <p class="msg-text">{{ msg.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentsStore } from '@/stores'
import StatusBadge from '@/components/StatusBadge.vue'

const route = useRoute()
const studentsStore = useStudentsStore()

const student = computed(() => studentsStore.getStudentById(route.params.id as string))

const activeTab = ref('results')
const tabs = [
  { id: 'results', label: 'Résultats' },
  { id: 'attendance', label: 'Présences' },
  { id: 'family', label: 'Famille' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'messages', label: 'Messages' },
]

const studentGrades = [
  { course: 'Mathématiques', teacher: 'M. Matala', max: 40, score: 32 },
  { course: 'Physique', teacher: 'Mme Nsenga', max: 30, score: 24 },
  { course: 'Chimie', teacher: 'M. Kabeya', max: 20, score: 14 },
  { course: 'Biologie', teacher: 'Mme Kasongo', max: 20, score: 16 },
  { course: 'Français', teacher: 'M. Ilunga', max: 20, score: 15 },
  { course: 'Anglais', teacher: 'Mme Mutombo', max: 20, score: 17 },
]

const absences = [
  { date: '15 jan. 2027', label: 'Mardi 15 janvier', justified: false },
  { date: '08 jan. 2027', label: 'Mercredi 8 janvier', justified: true },
]

const parcours = [
  { year: '2026-2027', classe: '4e Scientifique A', result: 'En cours' },
  { year: '2025-2026', classe: '3e Commerciale', result: 'Admis(e)' },
  { year: '2024-2025', classe: '2e Pédagogique', result: 'Admis(e)' },
]

const messages = [
  { date: '15 jan. 2027', type: 'Absence', text: 'LONGIPLUS : Grace a été absent(e) le 15/01/2027 à C.S. Mwinda. Pour justifier : 0891...' },
  { date: '06 nov. 2026', type: 'Bulletin', text: 'LONGIPLUS : Le bulletin de P1 de Grace est disponible. Code : GK-2041.' },
]
</script>

<style scoped>
.page { padding: 32px; }
.page-content { max-width: 1300px; }
.breadcrumb { font-size: 13px; color: var(--k-text-muted); margin: 0 0 20px; }
.breadcrumb a { color: var(--k-blue); text-decoration: none; }
.profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
.avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--k-sky); color: var(--k-navy); font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.profile-info { flex: 1; }
.profile-name { font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; color: var(--k-navy); margin: 0 0 6px; }
.profile-meta { display: flex; align-items: center; gap: 12px; font-size: 13px; color: var(--k-text-muted); }
.code { font-family: 'IBM Plex Mono', monospace; background: #f3f4f6; padding: 2px 8px; border-radius: 4px; color: var(--k-text); }
.profile-actions { flex-shrink: 0; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; }
.btn--ghost { background: transparent; border: 1px solid #d1d5db; color: var(--k-text); }
.tabs-bar { display: flex; gap: 4px; border-bottom: 1px solid var(--k-border); margin-bottom: 24px; }
.tab-btn { padding: 10px 16px; font-size: 14px; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; color: var(--k-text-muted); margin-bottom: -1px; }
.tab-btn--active { color: var(--k-navy); border-bottom-color: var(--k-navy); font-weight: 600; }
.tab-content { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 24px; }
.results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0; }
.avg-badge { font-size: 13px; background: var(--k-sky); color: var(--k-navy); padding: 4px 12px; border-radius: 6px; }
.table-wrapper { overflow-x: auto; border: 1px solid var(--k-border); border-radius: 8px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { background: #f9fafb; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--k-text-muted); border-bottom: 1px solid var(--k-border); }
.data-table td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tfoot td { background: #f9fafb; border-top: 1px solid var(--k-border); border-bottom: none; }
.attendance-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
.att-stat { background: var(--k-sky); border-radius: 10px; padding: 20px; }
.att-num { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; color: var(--k-navy); }
.att-label { font-size: 12px; color: var(--k-text-muted); margin-top: 4px; }
.subsection-title { font-size: 13px; font-weight: 600; color: var(--k-text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 12px; }
.absence-row { display: flex; align-items: center; gap: 16px; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
.absence-date { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--k-text-muted); min-width: 100px; }
.absence-label { flex: 1; }
.family-card { background: #f9fafb; border-radius: 10px; padding: 20px; }
.family-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.family-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--k-sky); color: var(--k-navy); font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.family-name { font-weight: 600; font-size: 14px; margin: 0 0 2px; color: var(--k-text); }
.family-role { font-size: 12px; color: var(--k-text-muted); margin: 0; }
.family-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.family-field { display: flex; flex-direction: column; gap: 4px; }
.field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--k-text-muted); }
.field-value { font-size: 13px; }
.family-siblings { font-size: 13px; color: var(--k-text-muted); margin: 0; }
.timeline { display: flex; flex-direction: column; gap: 16px; }
.timeline-item { display: flex; align-items: center; gap: 16px; }
.timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--k-navy); flex-shrink: 0; }
.timeline-content { display: flex; align-items: center; gap: 12px; font-size: 13px; }
.timeline-year { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--k-text-muted); min-width: 90px; }
.timeline-class { color: var(--k-text); }
.msg-row { padding: 14px 0; border-bottom: 1px solid #f3f4f6; }
.msg-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.msg-date { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--k-text-muted); }
.msg-text { font-size: 13px; color: var(--k-text); margin: 0; }
</style>

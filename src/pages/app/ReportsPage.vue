<template>
  <div class="page">
    <div class="page-content">
      <p class="eyebrow">ANNÉE 2026-2027 · PÉRIODE 2 EN COURS</p>
      <h2 class="page-title">Rapports et exports</h2>

      <div class="report-grid">
        <div v-for="report in reports" :key="report.id" class="report-card">
          <div class="report-card__icon" :style="{ background: report.iconBg }">
            <span v-html="report.icon"></span>
          </div>
          <div class="report-card__body">
            <p class="report-card__title">{{ report.title }}</p>
            <p class="report-card__desc">{{ report.desc }}</p>
          </div>
          <div class="report-card__actions">
            <select class="report-card__select" v-if="report.hasPeriod">
              <option>Période 2</option>
              <option>Période 1</option>
              <option>Année complète</option>
            </select>
            <select class="report-card__select" v-else-if="report.hasFormat">
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
            <button class="btn btn--outline">↓ Exporter</button>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section__title">Exports récents</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Rapport</th>
              <th>Période</th>
              <th>Format</th>
              <th>Date</th>
              <th>Taille</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ex in recentExports" :key="ex.id">
              <td class="td--bold">{{ ex.name }}</td>
              <td class="td--muted">{{ ex.period }}</td>
              <td>
                <span class="format-badge" :class="`format-badge--${ex.format.toLowerCase()}`">
                  {{ ex.format }}
                </span>
              </td>
              <td class="td--muted">{{ ex.date }}</td>
              <td class="td--muted">{{ ex.size }}</td>
              <td>
                <button class="link-btn">↓ Télécharger</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const iconList = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`
const iconCalendar = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
const iconUsers = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
const iconFile = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`
const iconTrophy = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M7 4H4a2 2 0 0 0-2 2v1a6 6 0 0 0 6 6h8a6 6 0 0 0 6-6V6a2 2 0 0 0-2-2h-3"/><rect x="7" y="2" width="10" height="5" rx="1"/></svg>`
const iconBook = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`

const reports = [
  {
    id: 'listes',
    title: 'Listes de classe',
    desc: 'Effectifs par classe, coordonnées des familles',
    icon: iconList,
    iconBg: '#e8f1fc',
    hasPeriod: false,
    hasFormat: true,
  },
  {
    id: 'absences',
    title: 'Rapport d\'absences',
    desc: 'Taux de présence, absences chroniques par élève',
    icon: iconCalendar,
    iconBg: '#fff7ed',
    hasPeriod: true,
    hasFormat: false,
  },
  {
    id: 'effectifs',
    title: 'Statistiques d\'effectifs',
    desc: 'Répartition par genre, niveau, classe',
    icon: iconUsers,
    iconBg: '#f0fdf4',
    hasPeriod: false,
    hasFormat: true,
  },
  {
    id: 'academique',
    title: 'Résumé académique',
    desc: 'Moyennes par classe, matière et période',
    icon: iconFile,
    iconBg: '#fef3c7',
    hasPeriod: true,
    hasFormat: false,
  },
  {
    id: 'palmares',
    title: 'Palmarès',
    desc: 'Classement par classe, distinctions de fin d\'année',
    icon: iconTrophy,
    iconBg: '#ede9fe',
    hasPeriod: true,
    hasFormat: false,
  },
  {
    id: 'journal',
    title: 'Journal de l\'école',
    desc: 'Historique des actions : inscriptions, notes, SMS',
    icon: iconBook,
    iconBg: '#fce7f3',
    hasPeriod: false,
    hasFormat: true,
  },
]

const recentExports = [
  { id: 'e1', name: 'Listes de classe', period: 'Toute l\'école', format: 'PDF', date: '14 janv. 2027', size: '248 Ko' },
  { id: 'e2', name: 'Rapport d\'absences', period: 'Période 1', format: 'Excel', date: '12 janv. 2027', size: '86 Ko' },
  { id: 'e3', name: 'Résumé académique', period: 'Période 1', format: 'PDF', date: '10 janv. 2027', size: '1,2 Mo' },
  { id: 'e4', name: 'Statistiques d\'effectifs', period: 'Année complète', format: 'CSV', date: '5 janv. 2027', size: '14 Ko' },
]
</script>

<style scoped>
.page { padding: 32px 36px; }
.page-content { max-width: 1400px; }
.eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 700; color: var(--k-navy); margin: 0 0 28px; }

.report-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }

.report-card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.report-card__icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--k-navy); flex-shrink: 0; }
.report-card__body { flex: 1; }
.report-card__title { font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; color: var(--k-navy); margin: 0 0 4px; }
.report-card__desc { font-size: 12px; color: var(--k-text-muted); margin: 0; line-height: 1.4; }
.report-card__actions { display: flex; align-items: center; gap: 8px; }
.report-card__select { flex: 1; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: #fff; }

.btn { padding: 7px 14px; border-radius: 7px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: none; white-space: nowrap; }
.btn--outline { background: #fff; border: 1.5px solid var(--k-border); color: var(--k-navy); }

.section { }
.section__title { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: var(--k-navy); margin: 0 0 14px; }

.table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); overflow: hidden; }
.table th { text-align: left; font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--k-text-muted); padding: 10px 14px; background: #f9fafb; border-bottom: 1px solid var(--k-border); }
.table td { padding: 12px 14px; border-bottom: 1px solid var(--k-border); }
.table tbody tr:last-child td { border-bottom: none; }
.td--bold { font-weight: 600; color: var(--k-navy); }
.td--muted { color: var(--k-text-muted); }

.format-badge { font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; }
.format-badge--pdf { background: #fee2e2; color: #991b1b; }
.format-badge--excel { background: #dcfce7; color: #166534; }
.format-badge--csv { background: #e0f2fe; color: #0369a1; }

.link-btn { background: none; border: none; font-size: 13px; font-weight: 600; color: var(--k-blue); cursor: pointer; padding: 0; }
</style>

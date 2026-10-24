<template>
  <div class="bulletin-page">
    <header class="bulletin-header">
      <img src="/longiplus-logo.svg" alt="LongiPlus" height="26" />
      <span class="header-sep">·</span>
      <span class="header-label">Bulletin scolaire</span>
    </header>

    <main class="bulletin-main">
      <!-- School + Student -->
      <div class="school-card">
        <div class="school-logo">CM</div>
        <div class="school-info">
          <p class="school-name">C.S. Mwinda</p>
          <p class="school-meta">{{ bulletin.className }} · {{ bulletin.year }}</p>
        </div>
      </div>

      <div class="student-block">
        <h1 class="student-name">{{ bulletin.studentName }}</h1>
        <p class="student-code">{{ bulletin.studentCode }}</p>
      </div>

      <div class="stats-row">
        <div class="stat-item stat-item--main">
          <p class="stat-value">{{ bulletin.average }}</p>
          <p class="stat-label">Moyenne</p>
        </div>
        <div class="stat-item">
          <p class="stat-value">{{ bulletin.rank }}</p>
          <p class="stat-label">Rang</p>
        </div>
        <div class="stat-item">
          <span class="conduct-chip">{{ bulletin.conduct }}</span>
          <p class="stat-label">Conduite</p>
        </div>
      </div>

      <p class="period-label">{{ bulletin.period }}</p>

      <!-- Grades table -->
      <div class="grades-card">
        <table class="grades-table">
          <thead>
            <tr>
              <th class="th-course">Cours</th>
              <th>Max</th>
              <th>Note</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in bulletin.courses" :key="row.name" :class="{ 'row-fail': row.fail }">
              <td class="td-course">{{ row.name }}</td>
              <td>{{ row.max }}</td>
              <td :class="{ 'td-fail': row.fail }">{{ row.note }}</td>
              <td :class="{ 'td-fail': row.fail }">{{ row.pct }} %</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td class="td-course"><strong>Total</strong></td>
              <td><strong>200</strong></td>
              <td><strong>144*</strong></td>
              <td><strong>72 %</strong></td>
            </tr>
          </tfoot>
        </table>

        <div v-if="bulletin.failNote" class="fail-banner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {{ bulletin.failNote }}
        </div>

        <p class="table-footnote">* Total provisoire, rang calculé quand toutes les notes sont saisies</p>
      </div>

      <!-- Download -->
      <button class="btn btn--navy download-btn" @click="downloadPdf">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Télécharger le PDF
      </button>
    </main>

    <footer class="bulletin-footer">
      <p>Ce bulletin est publié par C.S. Mwinda via LongiPlus.</p>
      <div class="footer-logo">
        <span>Généré avec</span>
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="18" />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const bulletin = {
  studentName: 'KABONGO Grace',
  studentCode: '2041 3378 5',
  className: '4e Scientifique A',
  year: '2026-2027',
  period: 'Période 1 · 2026-2027',
  average: '72 %',
  rank: '5 / 38',
  conduct: 'TB',
  failNote: 'Échec : Anglais (moins de 50 %). Le titulaire vous recommande un suivi.',
  courses: [
    { name: 'Mathématiques', max: 40, note: 32, pct: 80, fail: false },
    { name: 'Physique',       max: 30, note: 21, pct: 70, fail: false },
    { name: 'Chimie',         max: 20, note: 13, pct: 65, fail: false },
    { name: 'Français',       max: 20, note: 15, pct: 75, fail: false },
    { name: 'Anglais',        max: 20, note: 9,  pct: 45, fail: true  },
  ],
}

function downloadPdf() {
  window.print()
}
</script>

<style scoped>
.bulletin-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
}

.bulletin-header {
  width: 100%;
  max-width: 560px;
  padding: 20px 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-sep   { color: #9ca3af; font-size: 18px; }
.header-label { font-size: 14px; color: #374151; font-weight: 500; }

.bulletin-main {
  width: 100%;
  max-width: 560px;
  padding: 20px 0 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* School card */
.school-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 16px;
}

.school-logo {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: var(--k-sky);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--k-navy);
  flex-shrink: 0;
}

.school-name { font-weight: 700; font-size: 15px; color: #1a1a2e; margin: 0 0 2px; }
.school-meta { font-size: 12px; color: #6b7280; margin: 0; }

/* Student */
.student-block { padding: 4px 0; }
.student-name  { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; color: var(--k-navy); margin: 0 0 4px; }
.student-code  { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #6b7280; margin: 0; }

/* Stats */
.stats-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.stat-item { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.stat-item--main { flex: 1; }

.stat-value {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--k-navy);
  line-height: 1;
}

.stat-label { font-size: 12px; color: #6b7280; margin: 0; }

.conduct-chip {
  display: inline-block;
  background: var(--k-navy);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
}

.period-label { font-size: 13px; color: #374151; font-weight: 500; margin: 0; }

/* Grades */
.grades-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  overflow: hidden;
}

.grades-table { width: 100%; border-collapse: collapse; font-size: 14px; }

.grades-table th {
  padding: 10px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--k-border);
}

.grades-table td { padding: 11px 14px; border-bottom: 1px solid #f3f4f6; }
.grades-table tbody tr:last-child td { border-bottom: 1px solid var(--k-border); }

.th-course { width: 55%; }
.td-course { font-weight: 500; color: #1a1a2e; }

.row-fail td { background: #fff5f5; }
.td-fail { color: #dc2626; font-weight: 600; }

.total-row td {
  padding: 11px 14px;
  background: #f9fafb;
  font-weight: 600;
  color: #1a1a2e;
}

.fail-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #fff5f5;
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
  border-top: 1px solid #fecaca;
}

.table-footnote {
  padding: 8px 14px;
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  border-top: 1px solid #f3f4f6;
}

.download-btn { align-self: flex-start; }

/* Footer */
.bulletin-footer {
  width: 100%;
  max-width: 560px;
  padding: 16px 0 32px;
  border-top: 1px solid var(--k-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bulletin-footer p { font-size: 12px; color: #9ca3af; margin: 0; }

.footer-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #9ca3af;
}
</style>

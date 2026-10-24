<template>
  <div class="roll-call">
    <div class="page-header">
      <RouterLink to="/app/teacher/day" class="breadcrumb-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Mes cours
      </RouterLink>
    </div>

    <div class="page-meta">
      <div>
        <p class="eyebrow">APPEL · 10:10</p>
        <h1 class="page-title">Physique · 3e Scientifique</h1>
      </div>
      <button class="btn btn--ghost btn--sm" @click="markAllPresent">Tout P</button>
    </div>

    <div class="stats-bar">
      <span class="stat-chip stat-chip--green">{{ presentCount }} présents</span>
      <span class="stat-chip stat-chip--red">{{ absentCount }} absents</span>
      <span class="stat-chip stat-chip--yellow">{{ lateCount }} retard</span>
    </div>

    <p class="hint">Tous présents par défaut. Touchez A ou R.</p>

    <div class="students-list">
      <div v-for="student in students" :key="student.id" class="student-row">
        <div class="student-initials">{{ student.initials }}</div>
        <div class="student-info">
          <p class="student-name">{{ student.name }}</p>
          <p v-if="student.note" class="student-note">{{ student.note }}</p>
        </div>
        <div class="toggle-group">
          <button
            v-for="opt in (['P', 'A', 'R'] as const)"
            :key="opt"
            class="toggle-btn"
            :class="`toggle-btn--${opt.toLowerCase()} ${status[student.id] === opt ? 'toggle-btn--active' : ''}`"
            @click="status[student.id] = opt"
          >{{ opt }}</button>
        </div>
      </div>
    </div>

    <div class="submit-section">
      <p class="submit-hint">Gardé sur le téléphone. Fonctionne sans réseau.</p>
      <button class="btn btn--navy submit-btn" @click="validate">
        Valider l'appel · {{ students.length }} élèves
      </button>
      <p class="submit-sub">Les parents des {{ absentCount }} absents reçoivent un SMS.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const students = [
  { id: 's01', initials: 'AB', name: 'AMISI Bahati', note: '' },
  { id: 's02', initials: 'BK', name: 'BANZA Kevin',   note: '2e absence ce mois' },
  { id: 's03', initials: 'IM', name: 'ILUNGA Mireille', note: '' },
  { id: 's04', initials: 'KJ', name: 'KALALA Jonas',   note: 'Arrivé à 10:22' },
  { id: 's05', initials: 'KN', name: 'KASONGO Nadine', note: '' },
  { id: 's06', initials: 'MP', name: 'MULUMBA Prince', note: '' },
  { id: 's07', initials: 'NS', name: 'NSIMBA Sarah',   note: '' },
  { id: 's08', initials: 'WC', name: 'WEMBI Christelle', note: '' },
  { id: 's09', initials: 'LM', name: 'LUBOYA Marc',    note: '' },
  { id: 's10', initials: 'NT', name: 'NZUZI Thérèse', note: '' },
  { id: 's11', initials: 'MJ', name: 'MPIANA Joseph',  note: '' },
  { id: 's12', initials: 'TG', name: 'TSHIMANGA Grace', note: '' },
  { id: 's13', initials: 'KA', name: 'KAYEMBE Aimé',  note: '' },
]

const status = ref<Record<string, 'P' | 'A' | 'R'>>(
  Object.fromEntries(students.map(s => [s.id, 'P']))
)

const presentCount = computed(() => Object.values(status.value).filter(v => v === 'P').length)
const absentCount  = computed(() => Object.values(status.value).filter(v => v === 'A').length)
const lateCount    = computed(() => Object.values(status.value).filter(v => v === 'R').length)

function markAllPresent() {
  students.forEach(s => { status.value[s.id] = 'P' })
}

function validate() {
  // submit logic would go here
}
</script>

<style scoped>
.roll-call {
  padding: 24px 32px;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--k-blue);
  font-size: 13px;
  text-decoration: none;
  font-weight: 500;
}

.page-meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--k-orange);
  margin: 0 0 6px;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0;
}

.stats-bar { display: flex; gap: 8px; flex-wrap: wrap; }

.stat-chip {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.stat-chip--green  { background: #dcfce7; color: #166534; }
.stat-chip--red    { background: #fee2e2; color: #991b1b; }
.stat-chip--yellow { background: #fef9c3; color: #854d0e; }

.hint { font-size: 13px; color: #6b7280; margin: 0; }

.students-list {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  overflow: hidden;
}

.student-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.student-row:last-child { border-bottom: none; }

.student-initials {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--k-sky);
  color: var(--k-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.student-info { flex: 1; }
.student-name { font-weight: 600; font-size: 13px; color: #1a1a2e; margin: 0 0 1px; }
.student-note { font-size: 11px; color: #9a3412; margin: 0; font-weight: 500; }

.toggle-group { display: flex; gap: 4px; flex-shrink: 0; }

.toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1.5px solid var(--k-border);
  background: #f9fafb;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.1s;
}

.toggle-btn--p.toggle-btn--active { background: #dcfce7; border-color: #86efac; color: #166534; }
.toggle-btn--a.toggle-btn--active { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
.toggle-btn--r.toggle-btn--active { background: #fef9c3; border-color: #fde047; color: #854d0e; }

/* Submit */
.submit-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 8px 0;
}

.submit-hint { font-size: 12px; color: #9ca3af; margin: 0; }
.submit-sub  { font-size: 12px; color: #6b7280; margin: 0; }

.submit-btn { width: 100%; justify-content: center; padding: 14px; font-size: 15px; }
</style>

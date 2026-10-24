<template>
  <div class="print-page">
    <div class="screen-bar no-print">
      <RouterLink :to="`/app/classes/${classId}`" class="btn btn--ghost btn--sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </RouterLink>
      <button class="btn btn--navy btn--sm" @click="print">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Imprimer (Ctrl+P)
      </button>
    </div>

    <div class="a4-card">
      <!-- School header -->
      <div class="school-header">
        <div class="school-logo">CM</div>
        <div class="school-info">
          <p class="school-name">Complexe Scolaire Mwinda</p>
          <p class="school-sub">Lingwala, Kinshasa</p>
        </div>
        <div class="list-label">LISTE DE CLASSE</div>
      </div>

      <div class="class-meta">
        <p class="class-name">{{ cls?.name ?? 'Classe' }} · {{ rows.length }} élèves</p>
        <p class="class-sub">Année 2026-2027 · Lingwala, Kinshasa</p>
        <p class="class-teacher">
          Titulaire : {{ headTeacher?.shortName ?? '—' }} · Salle : {{ cls?.room ?? '—' }} · Semaine du ______ au ______
        </p>
      </div>

      <!-- Roster table -->
      <table class="roster-table">
        <thead>
          <tr>
            <th class="col-num">N°</th>
            <th class="col-name">Nom, post-nom, prénom</th>
            <th class="col-sex">Sexe</th>
            <th class="col-code">Code élève</th>
            <th class="col-day">Lu</th>
            <th class="col-day">Ma</th>
            <th class="col-day">Me</th>
            <th class="col-day">Je</th>
            <th class="col-day">Ve</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in paddedRows" :key="i" :class="{ 'row-empty': !s }">
            <td class="col-num">{{ String(i + 1).padStart(2, '0') }}</td>
            <td class="col-name">{{ s ? `${s.lastName} ${s.postName} ${s.firstName}` : '' }}</td>
            <td class="col-sex">{{ s?.sex ?? '' }}</td>
            <td class="col-code">{{ s?.code ?? '' }}</td>
            <td class="col-day"></td>
            <td class="col-day"></td>
            <td class="col-day"></td>
            <td class="col-day"></td>
            <td class="col-day"></td>
          </tr>
        </tbody>
      </table>

      <p class="legend">P présent · A absent · R retard · J justifié. Liste de secours quand le téléphone n'est pas disponible. À saisir ensuite dans LongiPlus.</p>

      <div class="signatures">
        <div class="sig-block">
          <p class="sig-label">Le titulaire</p>
          <div class="sig-line"></div>
        </div>
        <div class="sig-block">
          <p class="sig-label">Le préfet des études</p>
          <div class="sig-line"></div>
        </div>
        <div class="sig-block sig-block--right">
          <p class="sig-label">Généré avec</p>
          <img src="/longiplus-logo.svg" alt="LongiPlus" height="18" />
        </div>
      </div>

      <p class="print-date">Imprimé le 15 janv. 2027 · page 1 sur 2</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useClassesStore } from '@/stores/classes'
import { useStudentsStore } from '@/stores/students'

const route = useRoute()
const classesStore = useClassesStore()
const studentsStore = useStudentsStore()

const classId = computed(() => route.params.id as string)
const cls = computed(() => classesStore.getClassById(classId.value))
const headTeacher = computed(() => cls.value?.headTeacherId ? classesStore.getTeacherById(cls.value.headTeacherId) : undefined)
const rows = computed(() => studentsStore.getStudentsByClass(classId.value))

const MIN_ROWS = 20
const paddedRows = computed(() => {
  const list: (typeof rows.value[number] | null)[] = [...rows.value]
  while (list.length < MIN_ROWS) list.push(null)
  return list
})

function print() {
  window.print()
}
</script>

<style scoped>
.print-page {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.screen-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 794px;
}

.a4-card {
  background: #fff;
  width: 794px;
  padding: 40px 48px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border-radius: 4px;
}

/* School header */
.school-header {
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 2px solid #1a1a2e;
  padding-bottom: 14px;
  margin-bottom: 16px;
}

.school-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--k-sky);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: var(--k-navy);
  flex-shrink: 0;
}

.school-info { flex: 1; }
.school-name { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 16px; color: #1a1a2e; margin: 0 0 2px; }
.school-sub  { font-size: 12px; color: #6b7280; margin: 0; }

.list-label {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: var(--k-navy);
  text-align: right;
}

/* Class meta */
.class-meta { margin-bottom: 14px; }
.class-name    { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 14px; color: #1a1a2e; margin: 0 0 2px; }
.class-sub     { font-size: 12px; color: #6b7280; margin: 0 0 2px; }
.class-teacher { font-size: 11px; color: #374151; margin: 0; }

/* Table */
.roster-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  margin-bottom: 10px;
}

.roster-table th {
  background: var(--k-navy);
  color: #fff;
  padding: 6px 8px;
  text-align: left;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.04em;
}

.roster-table td {
  padding: 5px 8px;
  border-bottom: 1px solid #e5e7eb;
  color: #1a1a2e;
}

.roster-table tbody tr:nth-child(even) { background: #fafafa; }
.row-empty td { color: transparent; }

.col-num  { width: 32px; }
.col-name { min-width: 200px; }
.col-sex  { width: 40px; text-align: center; }
.col-code { width: 90px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; }
.col-day  { width: 30px; text-align: center; border-left: 1px solid #e5e7eb; }

.legend {
  font-size: 10px;
  color: #6b7280;
  margin: 8px 0 20px;
  font-style: italic;
}

/* Signatures */
.signatures {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 12px;
}

.sig-block { flex: 1; }
.sig-block--right { text-align: right; flex: 0 0 auto; }
.sig-label  { font-size: 11px; color: #6b7280; margin: 0 0 24px; }
.sig-line   { border-bottom: 1px solid #9ca3af; }

.print-date { font-size: 10px; color: #9ca3af; text-align: right; margin: 0; }

@media print {
  .no-print { display: none !important; }

  .print-page {
    background: white;
    padding: 0;
  }

  .a4-card {
    box-shadow: none;
    border-radius: 0;
    width: 100%;
    padding: 20mm 20mm;
  }
}
</style>

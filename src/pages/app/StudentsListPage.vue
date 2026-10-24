<template>
  <div class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">{{ studentsStore.totalStudents }} ÉLÈVES · {{ studentsStore.totalFamilies }} FAMILLES · {{ studentsStore.totalClasses }} CLASSES</p>
        <h1 class="page-title">Élèves</h1>
      </div>
      <div class="page-header__actions">
        <RouterLink to="/app/students/import" class="btn-outline">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Importer depuis Excel
        </RouterLink>
        <RouterLink to="/app/students/new" class="btn-navy">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Inscrire un élève
        </RouterLink>
      </div>
    </div>

    <div class="filter-bar">
      <div class="search-input">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" v-model="search" placeholder="Nom, code élève ou téléphone du parent" />
      </div>
      <div class="class-filter">
        <label>Classe</label>
        <select v-model="selectedClass">
          <option value="4e Scientifique A">4e Scientifique A</option>
          <option value="3e Commerciale">3e Commerciale</option>
          <option value="6e Primaire">6e Primaire</option>
        </select>
      </div>
    </div>

    <div class="filter-tabs">
      <button
        v-for="tab in filterTabs"
        :key="tab.key"
        class="filter-tab"
        :class="{ 'filter-tab--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>

    <div v-if="checkedIds.length > 0" class="bulk-bar">
      <span class="bulk-bar__count">{{ checkedIds.length }} élèves sélectionnés</span>
      <div class="bulk-bar__actions">
        <button class="bulk-action">Envoyer un SMS aux parents</button>
        <button class="bulk-action">Imprimer les fiches code</button>
        <button class="bulk-action">Changer de classe</button>
      </div>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th class="th-check">
              <input type="checkbox" @change="toggleAll" />
            </th>
            <th></th>
            <th>Élève</th>
            <th>Classe</th>
            <th>Responsable</th>
            <th>Présence · janv.</th>
            <th>Moyenne P1</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in visibleStudents" :key="student.id" :class="{ 'tr-checked': checkedIds.includes(student.id) }">
            <td class="td-check">
              <input type="checkbox" :checked="checkedIds.includes(student.id)" @change="toggleStudent(student.id)" />
            </td>
            <td>
              <div class="avatar" :style="{ background: avatarColor(student.id) }">{{ student.initials }}</div>
            </td>
            <td>
              <p class="student-name">{{ student.lastName }} {{ student.postName }} {{ student.firstName }}</p>
              <p class="student-code">{{ student.code }} <span v-if="student.isNew" class="badge-new">Nouvelle</span></p>
            </td>
            <td>{{ student.className }}</td>
            <td>
              <p class="guardian-name">{{ student.guardianName }}</p>
              <p class="guardian-phone" :class="{ 'guardian-phone--missing': !student.guardianPhone }">
                {{ student.guardianPhone || 'Pas de téléphone' }}
              </p>
            </td>
            <td>
              <span :class="student.attendancePercent <= 80 ? 'attendance--warn' : 'attendance--ok'">
                <svg v-if="student.attendancePercent <= 80" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                {{ student.attendancePercent }} %
                <span v-if="student.attendancePercent <= 80" class="warn-label"> · 3 j de suite</span>
              </span>
            </td>
            <td>
              <span v-if="student.averageP1 !== undefined" :class="student.averageP1 < 50 ? 'avg--fail' : 'avg--ok'">
                {{ student.averageP1.toFixed(1) }} %
              </span>
              <span v-else class="avg--na">Arrivée en P2</span>
            </td>
            <td>
              <RouterLink :to="`/app/students/${student.id}`" class="link-open">Ouvrir</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <span class="pagination__info">1 à {{ visibleStudents.length }} sur 38 en {{ selectedClass }}</span>
      <div class="pagination__btns">
        <button class="pagination__btn" disabled>Précédent</button>
        <button class="pagination__btn pagination__btn--active">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStudentsStore } from '@/stores/students'

const studentsStore = useStudentsStore()

const search = ref('')
const selectedClass = ref('4e Scientifique A')
const activeTab = ref('all')
const checkedIds = ref<string[]>(['s1', 's2', 's3'])

const filterTabs = [
  { key: 'all', label: 'Tous · 38' },
  { key: 'new', label: 'Nouveaux · 2' },
  { key: 'absent', label: 'Souvent absents · 3' },
  { key: 'nophone', label: 'Sans téléphone parent · 1' },
]

const visibleStudents = computed(() => {
  let list = studentsStore.students
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(s =>
      `${s.lastName} ${s.postName} ${s.firstName}`.toLowerCase().includes(q) ||
      s.code.includes(q)
    )
  }
  if (activeTab.value === 'new') list = list.filter(s => s.isNew)
  if (activeTab.value === 'absent') list = list.filter(s => s.attendancePercent <= 80)
  if (activeTab.value === 'nophone') list = list.filter(s => !s.guardianPhone)
  return list
})

const avatarColors = ['#083A8C', '#0160D3', '#1d4ed8', '#2563eb', '#4f46e5', '#7c3aed', '#db2777']
function avatarColor(id: string) {
  const idx = parseInt(id.replace('s', '')) - 1
  return avatarColors[idx % avatarColors.length]
}

function toggleStudent(id: string) {
  const i = checkedIds.value.indexOf(id)
  if (i >= 0) checkedIds.value.splice(i, 1)
  else checkedIds.value.push(id)
}

function toggleAll() {
  if (checkedIds.value.length === visibleStudents.value.length) checkedIds.value = []
  else checkedIds.value = visibleStudents.value.map(s => s.id)
}
</script>

<style scoped>
.page { padding: 32px; display: flex; flex-direction: column; gap: 20px; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; }
.page-header__actions { display: flex; gap: 10px; align-items: center; }

.eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 4px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 700; color: var(--k-navy); margin: 0; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px; border: 1.5px solid var(--k-border); border-radius: 8px;
  font-size: 13px; font-weight: 600; color: #374151; text-decoration: none;
  background: #fff;
}
.btn-navy {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px; background: var(--k-navy); border-radius: 8px;
  font-size: 13px; font-weight: 600; color: #fff; text-decoration: none; border: none; cursor: pointer;
}

.filter-bar { display: flex; gap: 12px; align-items: center; }

.search-input {
  display: flex; align-items: center; gap: 10px; flex: 1;
  border: 1.5px solid var(--k-border); border-radius: 8px;
  padding: 9px 14px; background: #fff;
}
.search-input input { border: none; outline: none; font-size: 14px; color: #374151; flex: 1; background: transparent; }

.class-filter { display: flex; align-items: center; gap: 8px; }
.class-filter label { font-size: 13px; font-weight: 600; color: #374151; }
.class-filter select { border: 1.5px solid var(--k-border); border-radius: 7px; padding: 8px 28px 8px 10px; font-size: 13px; outline: none; cursor: pointer; }

.filter-tabs { display: flex; gap: 4px; }
.filter-tab { padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--k-border); font-size: 13px; font-weight: 500; background: #fff; cursor: pointer; color: #374151; }
.filter-tab--active { background: var(--k-navy); color: #fff; border-color: var(--k-navy); }

.bulk-bar {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  background: var(--k-navy); color: #fff; padding: 12px 20px; border-radius: var(--k-radius);
}
.bulk-bar__count { font-weight: 600; font-size: 14px; }
.bulk-bar__actions { display: flex; gap: 10px; }
.bulk-action { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 7px; padding: 7px 14px; color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; }

.table-wrap { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.data-table th { padding: 10px 14px; font-size: 12px; font-weight: 600; color: #6b7280; border-bottom: 1px solid var(--k-border); text-align: left; background: #fafafa; }
.data-table td { padding: 13px 14px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.th-check, .td-check { width: 40px; }
.tr-checked { background: #f0f5ff; }

.avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; }

.student-name { font-weight: 600; color: var(--k-navy); margin: 0 0 2px; }
.student-code { font-size: 12px; color: var(--k-blue); margin: 0; font-family: 'IBM Plex Mono', monospace; display: flex; align-items: center; gap: 6px; }
.badge-new { background: #dcfce7; color: #166534; font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 10px; font-family: 'Inter', sans-serif; }

.guardian-name { font-size: 13px; font-weight: 500; margin: 0 0 2px; }
.guardian-phone { font-size: 12px; color: #6b7280; margin: 0; }
.guardian-phone--missing { color: #ef4444; font-weight: 500; }

.attendance--warn { color: #b45309; font-weight: 600; display: flex; align-items: center; gap: 4px; }
.attendance--ok   { color: #374151; }
.warn-label { font-size: 12px; }
.avg--fail { color: #ef4444; font-weight: 700; }
.avg--ok   { color: #374151; }
.avg--na   { color: #9ca3af; font-size: 12px; }

.link-open { color: var(--k-blue); font-weight: 600; font-size: 13px; text-decoration: none; }

.pagination { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
.pagination__info { font-size: 13px; color: #6b7280; }
.pagination__btns { display: flex; gap: 8px; }
.pagination__btn { padding: 7px 16px; border: 1.5px solid var(--k-border); border-radius: 7px; font-size: 13px; cursor: pointer; background: #fff; }
.pagination__btn--active { background: var(--k-navy); color: #fff; border-color: var(--k-navy); }
.pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>

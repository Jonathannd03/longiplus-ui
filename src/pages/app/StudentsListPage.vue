<template>
  <div class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">{{ students.length }} ÉLÈVE{{ students.length !== 1 ? 'S' : '' }} · {{ sections.length }} CLASSE{{ sections.length !== 1 ? 'S' : '' }}</p>
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
        <input type="text" v-model="search" placeholder="Nom ou code élève" />
      </div>
      <div class="class-filter">
        <label>Classe</label>
        <select v-model="selectedSectionId">
          <option value="">Toutes</option>
          <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
    </div>

    <div class="filter-tabs">
      <button class="filter-tab" :class="{ 'filter-tab--active': activeTab === 'all' }" @click="activeTab = 'all'">
        Tous · {{ students.length }}
      </button>
      <button class="filter-tab" :class="{ 'filter-tab--active': activeTab === 'new' }" @click="activeTab = 'new'">
        Nouveaux · {{ newStudents.length }}
      </button>
    </div>

    <div v-if="checkedIds.length > 0" class="bulk-bar">
      <span class="bulk-bar__count">{{ checkedIds.length }} élève{{ checkedIds.length > 1 ? 's' : '' }} sélectionné{{ checkedIds.length > 1 ? 's' : '' }}</span>
      <div class="bulk-bar__actions">
        <button class="bulk-action">Imprimer les fiches code</button>
      </div>
    </div>

    <div v-if="loading" class="state-msg">Chargement…</div>
    <div v-else-if="error" class="state-msg state-msg--error">{{ error }}</div>
    <template v-else>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-check"><input type="checkbox" @change="toggleAll" /></th>
              <th></th>
              <th>Élève</th>
              <th>Classe</th>
              <th>Responsable</th>
              <th>Présence</th>
              <th>Moyenne</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="visible.length === 0">
              <td colspan="7" class="td-empty">Aucun élève trouvé.</td>
            </tr>
            <tr v-for="s in visible" :key="s.id" :class="{ 'tr-checked': checkedIds.includes(s.id) }">
              <td class="td-check"><input type="checkbox" :checked="checkedIds.includes(s.id)" @change="toggleStudent(s.id)" /></td>
              <td><div class="avatar" :style="{ background: avatarColor(s.id) }">{{ initials(s) }}</div></td>
              <td>
                <p class="student-name">{{ s.lastName }} {{ s.postName }} {{ s.firstName }}</p>
                <p class="student-code">{{ s.studentCode }}</p>
              </td>
              <td>{{ s.className ?? '—' }}</td>
              <td class="muted">—</td>
              <td class="muted">—</td>
              <td class="muted">—</td>
              <td><RouterLink :to="`/app/students/${s.id}`" class="link-open">Ouvrir</RouterLink></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination__info">{{ visible.length }} sur {{ filtered.length }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSetupApi } from '@/api/setup'
import type { StudentListItem, ClassSection } from '@/api/setup'

const api = useSetupApi()

const loading = ref(true)
const error = ref('')
const students = ref<StudentListItem[]>([])
const sections = ref<ClassSection[]>([])
const activeYearId = ref('')

const search = ref('')
const selectedSectionId = ref('')
const activeTab = ref('all')
const checkedIds = ref<string[]>([])

onMounted(async () => {
  try {
    const years = await api.academicYears.list()
    const year = years.find(y => y.status === 'active') ?? years[0]
    if (year) {
      activeYearId.value = year.id
      const [studs, sects] = await Promise.all([
        api.students.list({ yearId: year.id }),
        api.classSections.list(year.id),
      ])
      students.value = studs
      sections.value = sects
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur de chargement'
  } finally {
    loading.value = false
  }
})

const newStudents = computed(() => {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  return students.value.filter(s => new Date(s.createdAt).getTime() > cutoff)
})

const selectedSection = computed(() => sections.value.find(s => s.id === selectedSectionId.value))

const filtered = computed(() => {
  let list = activeTab.value === 'new' ? newStudents.value : students.value
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(s =>
      `${s.lastName} ${s.postName} ${s.firstName}`.toLowerCase().includes(q) ||
      s.studentCode.includes(q)
    )
  }
  if (selectedSectionId.value && selectedSection.value) {
    list = list.filter(s => s.className === selectedSection.value!.name)
  }
  return list
})

const visible = computed(() => filtered.value)

const avatarColors = ['#083A8C', '#0160D3', '#1d4ed8', '#2563eb', '#4f46e5', '#7c3aed', '#db2777']
function avatarColor(id: string): string {
  let hash = 0
  for (const c of id) hash = ((hash * 31) + c.charCodeAt(0)) & 0x7fffffff
  return avatarColors[hash % avatarColors.length]!
}

function initials(s: StudentListItem): string {
  return `${s.lastName[0] ?? ''}${s.firstName[0] ?? ''}`.toUpperCase()
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fr-CD', { day: '2-digit', month: 'short', year: 'numeric' })
}

function toggleStudent(id: string) {
  const i = checkedIds.value.indexOf(id)
  if (i >= 0) checkedIds.value.splice(i, 1)
  else checkedIds.value.push(id)
}

function toggleAll() {
  if (checkedIds.value.length === visible.value.length) checkedIds.value = []
  else checkedIds.value = visible.value.map(s => s.id)
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
  font-size: 13px; font-weight: 600; color: #374151; text-decoration: none; background: #fff;
}
.btn-navy {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px; background: var(--k-navy); border-radius: 8px;
  font-size: 13px; font-weight: 600; color: #fff; text-decoration: none; border: none; cursor: pointer;
}

.filter-bar { display: flex; gap: 12px; align-items: center; }
.search-input {
  display: flex; align-items: center; gap: 10px; flex: 1;
  border: 1.5px solid var(--k-border); border-radius: 8px; padding: 9px 14px; background: #fff;
}
.search-input input { border: none; outline: none; font-size: 14px; color: #374151; flex: 1; background: transparent; }
.class-filter { display: flex; align-items: center; gap: 8px; }
.class-filter label { font-size: 13px; font-weight: 600; color: #374151; }
.class-filter select { border: 1.5px solid var(--k-border); border-radius: 7px; padding: 8px 28px 8px 10px; font-size: 13px; outline: none; cursor: pointer; }

.filter-tabs { display: flex; gap: 4px; }
.filter-tab { padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--k-border); font-size: 13px; font-weight: 500; background: #fff; cursor: pointer; color: #374151; }
.filter-tab--active { background: var(--k-navy); color: #fff; border-color: var(--k-navy); }

.bulk-bar {
  display: flex; align-items: center; gap: 16px;
  background: var(--k-navy); color: #fff; padding: 12px 20px; border-radius: var(--k-radius);
}
.bulk-bar__count { font-weight: 600; font-size: 14px; }
.bulk-bar__actions { display: flex; gap: 10px; }
.bulk-action { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 7px; padding: 7px 14px; color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; }

.state-msg { padding: 40px; text-align: center; color: #6b7280; font-size: 14px; }
.state-msg--error { color: #ef4444; }

.table-wrap { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.data-table th { padding: 10px 14px; font-size: 12px; font-weight: 600; color: #6b7280; border-bottom: 1px solid var(--k-border); text-align: left; background: #fafafa; }
.data-table td { padding: 13px 14px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
.th-check, .td-check { width: 40px; }
.td-empty { text-align: center; color: #9ca3af; padding: 40px !important; }
.tr-checked { background: #f0f5ff; }

.avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; }
.student-name { font-weight: 600; color: var(--k-navy); margin: 0 0 2px; }
.student-code { font-size: 12px; color: var(--k-blue); margin: 0; font-family: 'IBM Plex Mono', monospace; }

.link-open { color: var(--k-blue); font-weight: 600; font-size: 13px; text-decoration: none; }
.muted { color: #9ca3af; font-size: 13px; }

.pagination { display: flex; align-items: center; justify-content: flex-end; padding: 4px 0; }
.pagination__info { font-size: 13px; color: #6b7280; }
</style>

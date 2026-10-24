<template>
  <div class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">PRÉSENCES · {{ attendanceStore.today.date.toUpperCase() }}</p>
        <h2>Présences quotidiennes</h2>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline">⬇ Exporter</button>
        <button class="btn btn-navy">📱 Envoyer rappel</button>
      </div>
    </div>

    <div class="stats-row">
      <StatCard
        label="Présents"
        :value="attendanceStore.today.present"
        :sub="`/ ${attendanceStore.today.total} élèves inscrits`"
        :barValue="Math.round(attendanceStore.today.present / attendanceStore.today.total * 100)"
        barColor="var(--k-navy)"
      />
      <StatCard
        label="Absents"
        :value="attendanceStore.today.absents"
        :sub="`dont ${attendanceStore.today.justifiedAbsents} justifiés`"
        :barValue="Math.round(attendanceStore.today.absents / attendanceStore.today.total * 100)"
        barColor="#ef4444"
      />
      <div class="stat-card stat-card--alert">
        <p class="stat-card__label">Classes sans appel</p>
        <p class="stat-card__value stat-value--red">{{ attendanceStore.today.classesWithoutRoll }}</p>
        <p class="stat-card__sub">{{ attendanceStore.today.classesWithoutRollNames }}</p>
      </div>
    </div>

    <div class="attendance-layout">
      <!-- MAIN: Weekly chart + absents list -->
      <div class="attendance-main">
        <div class="card">
          <h3>Présences cette semaine</h3>
          <div class="weekly-chart">
            <div v-for="day in attendanceStore.weeklyData" :key="day.day" class="day-col">
              <div class="bar-wrap">
                <div class="bar-inner">
                  <div class="bar-fill bar-present" :style="{ height: day.percent + '%' }"></div>
                  <div class="bar-fill bar-absent" :style="{ height: (100 - day.percent) + '%' }"></div>
                </div>
              </div>
              <p class="day-label" :class="{ 'day-today': day.isCurrent }">{{ day.day }}</p>
              <p class="day-num" :class="{ 'day-today': day.isCurrent }">{{ day.date }}</p>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-dot legend-dot--present"></span><span>Présents</span>
            <span class="legend-dot legend-dot--absent"></span><span>Absents</span>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Absents aujourd'hui · {{ attendanceStore.today.absents }}</h3>
            <div class="search-wrap">
              <input class="input-search" placeholder="Rechercher un élève…" v-model="searchAbsents" />
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Élève</th>
                <th>Classe</th>
                <th>Motif</th>
                <th>SMS envoyé</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in filteredAbsents" :key="a.id">
                <td>
                  <div class="student-cell">
                    <span class="avatar-sm">{{ initials(a.studentName) }}</span>
                    <span>{{ a.studentName }}</span>
                  </div>
                </td>
                <td>{{ a.className }}</td>
                <td>
                  <span v-if="a.motif" class="badge badge-info">{{ a.motif }}</span>
                  <span v-else class="badge badge-neutral">Non justifié</span>
                </td>
                <td>
                  <span v-if="a.smsSent" class="badge badge-success">✓ Envoyé</span>
                  <span v-else class="badge badge-warning">—</span>
                </td>
                <td>
                  <button class="btn-link">📱 SMS</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SIDEBAR: 3-day absence alert -->
      <div class="attendance-sidebar">
        <div class="card alert-card">
          <h3>Alerte 3 jours consécutifs</h3>
          <p class="alert-desc">{{ attendanceStore.threeDayAbsents.length }} élèves absents 3 jours ou plus</p>
          <div class="alert-list">
            <div v-for="(a, i) in attendanceStore.threeDayAbsents" :key="i" class="alert-item">
              <div class="alert-item-top">
                <span class="avatar-sm avatar-sm--red">{{ initials(a.name) }}</span>
                <div>
                  <p class="alert-name">{{ a.name }}</p>
                  <p class="alert-class">{{ a.className }}</p>
                </div>
                <span class="alert-days">3j</span>
              </div>
              <div class="alert-item-sms">
                <p class="sms-preview-text">{{ smsPreview(a.name) }}</p>
                <button v-if="!a.noPhone" class="btn btn-navy btn-sm">📱 Envoyer</button>
                <span v-else class="badge badge-warning">Sans téléphone</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Paramètres d'alerte</h3>
          <div class="setting-row">
            <label class="checkbox-label">
              <input type="checkbox" checked />
              <span>SMS après 3 absences consécutives</span>
            </label>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
              <input type="checkbox" checked />
              <span>Rappel aux enseignants sans appel</span>
            </label>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
              <input type="checkbox" />
              <span>Rapport hebdomadaire au préfet</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAttendanceStore } from '@/stores'
import StatCard from '@/components/StatCard.vue'

const attendanceStore = useAttendanceStore()
const searchAbsents = ref('')

const filteredAbsents = computed(() => {
  const q = searchAbsents.value.toLowerCase()
  if (!q) return attendanceStore.todayAbsents
  return attendanceStore.todayAbsents.filter(a => a.studentName.toLowerCase().includes(q))
})

function initials(name: string) {
  const parts = name.split(' ')
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

function smsPreview(name: string) {
  return `LONGIPLUS : ${name} est absent(e) depuis 3 jours à C.S. Mwinda. Merci de contacter l'école.`
}
</script>

<style scoped>
.page { padding: 32px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
h2 { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; color: var(--k-navy); margin: 0; }
h3 { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0 0 16px; }
.header-actions { display: flex; gap: 8px; }

.stats-row { display: flex; gap: 16px; margin-bottom: 24px; }
.stat-card--alert { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; flex: 1; }
.stat-card__label { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--k-text-muted); margin: 0 0 8px; }
.stat-card__value { font-family: 'Poppins', sans-serif; font-size: 32px; font-weight: 700; color: var(--k-navy); margin: 0 0 4px; line-height: 1.1; }
.stat-value--red { color: #dc2626; }
.stat-card__sub { font-size: 12px; color: var(--k-text-muted); margin: 0; }

.attendance-layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
.attendance-main { display: flex; flex-direction: column; gap: 16px; }

.card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-header h3 { margin: 0; }

.weekly-chart { display: flex; gap: 8px; align-items: flex-end; height: 120px; }
.day-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.bar-inner { width: 100%; height: 80px; display: flex; flex-direction: column; justify-content: flex-end; border-radius: 4px; overflow: hidden; }
.bar-fill { width: 100%; transition: height .3s; }
.bar-present { background: var(--k-navy); }
.bar-absent { background: #fca5a5; }
.day-label { font-size: 11px; color: var(--k-text-muted); margin: 0; text-transform: capitalize; }
.day-num { font-size: 12px; font-weight: 600; color: var(--k-navy); margin: 0; }
.day-today { color: var(--k-blue) !important; }
.chart-legend { display: flex; align-items: center; gap: 12px; margin-top: 12px; font-size: 12px; color: var(--k-text-muted); }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.legend-dot--present { background: var(--k-navy); }
.legend-dot--absent { background: #fca5a5; }

.input-search { border: 1px solid #d1d5db; border-radius: 8px; padding: 7px 12px; font-size: 13px; font-family: inherit; width: 220px; }
.input-search:focus { outline: none; border-color: var(--k-blue); }

.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.data-table th { text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 600; color: var(--k-text-muted); border-bottom: 1px solid var(--k-border); text-transform: uppercase; letter-spacing: .04em; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid var(--k-border); color: var(--k-text); }

.student-cell { display: flex; align-items: center; gap: 10px; }
.avatar-sm { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--k-sky); color: var(--k-navy); font-size: 11px; font-weight: 700; flex-shrink: 0; }
.avatar-sm--red { background: #fee2e2; color: #991b1b; }

.badge { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.badge-success { background: #dcfce7; color: #166534; }
.badge-warning { background: #fef9c3; color: #854d0e; }
.badge-info { background: var(--k-sky); color: var(--k-navy); }
.badge-neutral { background: #f3f4f6; color: #374151; }

.btn-link { background: none; border: none; color: var(--k-blue); font-size: 13px; cursor: pointer; padding: 2px 4px; }

.alert-card { background: #fff; }
.alert-desc { font-size: 12px; color: var(--k-text-muted); margin: -8px 0 16px; }
.alert-list { display: flex; flex-direction: column; gap: 16px; }
.alert-item { border: 1px solid #fee2e2; border-radius: 8px; padding: 12px; background: #fff5f5; }
.alert-item-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.alert-name { font-size: 13.5px; font-weight: 600; color: var(--k-navy); margin: 0 0 2px; }
.alert-class { font-size: 11px; color: var(--k-text-muted); margin: 0; }
.alert-days { margin-left: auto; font-size: 20px; font-weight: 700; color: #dc2626; font-family: 'Poppins', sans-serif; }
.alert-item-sms { display: flex; flex-direction: column; gap: 8px; }
.sms-preview-text { font-size: 12px; color: #374151; margin: 0; background: #fff; border-radius: 6px; padding: 8px; }

.setting-row { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
.setting-row:last-child { border-bottom: none; }
.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
.checkbox-label span { color: var(--k-text); }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent; font-family: inherit; }
.btn-navy { background: var(--k-navy); color: #fff; border-color: var(--k-navy); }
.btn-outline { background: #fff; color: var(--k-navy); border-color: #d1d5db; }
.btn-sm { padding: 5px 12px; font-size: 12.5px; }
</style>

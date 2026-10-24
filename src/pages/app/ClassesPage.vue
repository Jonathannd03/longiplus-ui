<template>
  <div class="page">
    <div class="page-tabs">
      <button class="tab-btn" :class="{ active: tab === 'classes' }" @click="tab = 'classes'">Classes</button>
      <button class="tab-btn" :class="{ active: tab === 'teachers' }" @click="tab = 'teachers'">Enseignants</button>
    </div>

    <!-- CLASSES TAB -->
    <template v-if="tab === 'classes'">
      <div class="page-header">
        <div>
          <p class="eyebrow">12 CLASSES · 412 ÉLÈVES · 2026-2027</p>
          <h2>Classes et cours</h2>
        </div>
        <button class="btn btn-navy">+ Nouvelle classe</button>
      </div>

      <div class="classes-layout">
        <div class="class-list">
          <p class="list-group-label">PRIMAIRE</p>
          <button v-for="c in primaireClasses" :key="c.id"
            class="class-item" :class="{ selected: selectedClassId === c.id }"
            @click="selectedClassId = c.id">
            <span>{{ c.name }}</span>
            <span class="class-count">{{ c.studentCount }}</span>
          </button>
          <p class="list-group-label">SECONDAIRE</p>
          <button v-for="c in secondaireClasses" :key="c.id"
            class="class-item" :class="{ selected: selectedClassId === c.id }"
            @click="selectedClassId = c.id">
            <span>{{ c.name }}</span>
            <span class="class-count">{{ c.studentCount }}</span>
          </button>
        </div>

        <div class="class-detail" v-if="selectedClass">
          <div class="detail-form-row">
            <div class="field">
              <label>Nom de la classe</label>
              <input class="input" :value="selectedClass.name" />
            </div>
            <div class="field">
              <label>Option</label>
              <select class="input">
                <option>{{ selectedClass.option || 'Général' }}</option>
              </select>
            </div>
            <div class="field">
              <label>Titulaire</label>
              <select class="input">
                <option>{{ headTeacher?.shortName || '—' }}</option>
              </select>
            </div>
            <div class="field">
              <label>Salle</label>
              <input class="input" :value="selectedClass.room || ''" />
            </div>
          </div>

          <div class="courses-header">
            <h3>Cours de la classe</h3>
            <div class="courses-actions">
              <button class="btn btn-outline">Copier d'une autre classe</button>
              <button class="btn btn-outline">+ Ajouter un cours</button>
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Max. période</th>
                <th>Max. examen</th>
                <th>Heures / sem.</th>
                <th>Enseignant</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in selectedCourses" :key="course.id">
                <td>{{ course.name }}</td>
                <td>{{ course.maxPeriod }}</td>
                <td>{{ course.maxExam }}</td>
                <td>{{ course.hoursPerWeek }}</td>
                <td>
                  <span v-if="course.teacherStatus === 'pending'" class="badge badge-orange">
                    {{ getTeacherName(course.teacherId) }} · invitation en attente
                  </span>
                  <span v-else>{{ getTeacherName(course.teacherId) }}</span>
                </td>
              </tr>
              <tr class="row-other">
                <td>Autres cours · 5</td>
                <td>50</td>
                <td>100</td>
                <td>9</td>
                <td>4 enseignants</td>
              </tr>
              <tr class="row-total">
                <td><strong>Total</strong></td>
                <td><strong>200</strong></td>
                <td><strong>400</strong></td>
                <td><strong>32</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div class="info-box info-box-blue">
            <span class="info-icon">ℹ</span>
            <span><strong>Le maximum de l'examen suit le barème</strong><br>2 × le maximum de la période. Changez-le dans Année et barème.</span>
          </div>
        </div>
      </div>
    </template>

    <!-- TEACHERS TAB -->
    <template v-else>
      <div class="page-header">
        <div>
          <p class="eyebrow">18 ENSEIGNANTS · 12 TITULAIRES · 2 INVITATIONS EN ATTENTE</p>
          <h2>Enseignants et affectations</h2>
        </div>
      </div>

      <div class="teachers-layout">
        <div class="teachers-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Enseignant</th>
                <th>Cours</th>
                <th>Classes</th>
                <th>Heures / sem.</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in classesStore.teachers" :key="t.id">
                <td><span class="avatar-sm">{{ t.initials }}</span></td>
                <td>
                  <strong>{{ t.name }}</strong><br>
                  <small class="text-muted">{{ t.headOfClassId ? 'Titulaire ' + getClassName(t.headOfClassId) : 'Enseignant' }}</small>
                </td>
                <td>{{ t.courses.join(', ') }}</td>
                <td>{{ t.classIds.length }} classes</td>
                <td>{{ t.hoursPerWeek }}</td>
                <td>
                  <span v-if="t.status === 'active'" class="badge badge-success">✓ Actif</span>
                  <span v-else class="badge badge-orange">⏱ Invitation envoyée</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="table-note">Au primaire, le titulaire enseigne en général toutes les branches de sa classe.</p>
        </div>

        <div class="invite-panel">
          <h3>Inviter un enseignant</h3>
          <div class="field">
            <label>Nom</label>
            <input class="input" value="Tshilombo Rachel" />
          </div>
          <div class="field">
            <label>Téléphone</label>
            <input class="input" value="+243 89 410 2233" />
          </div>
          <div class="field">
            <label>Cours et classes</label>
            <div class="tags">
              <span class="tag">Histoire · 4e Sc. A</span>
              <span class="tag">Histoire · 4e Sc. B</span>
              <span class="tag">Géographie · 3e Com.</span>
              <a href="#" class="link">+ Ajouter un cours</a>
            </div>
          </div>
          <label class="checkbox-label">
            <input type="checkbox" /> Titulaire d'une classe
          </label>
          <div class="sms-preview">
            <p class="sms-sender">LONGIPLUS</p>
            <p class="sms-text">LongiPlus : C.S. Mwinda vous invite comme enseignante. Ouvrez kls.cd/i/[LIEN] pour activer votre accès.</p>
          </div>
          <button class="btn btn-navy btn-full">↗ Envoyer l'invitation</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useClassesStore } from '@/stores'

const classesStore = useClassesStore()
const tab = ref<'classes' | 'teachers'>('classes')
const selectedClassId = ref('c7')

const selectedClass = computed(() => classesStore.getClassById(selectedClassId.value))
const selectedCourses = computed(() => classesStore.getCoursesByClass(selectedClassId.value))
const headTeacher = computed(() => {
  const cls = selectedClass.value
  return cls?.headTeacherId ? classesStore.getTeacherById(cls.headTeacherId) : null
})

const primaireClasses = computed(() => classesStore.classes.filter(c => c.level === 'primaire'))
const secondaireClasses = computed(() => classesStore.classes.filter(c => c.level === 'secondaire'))

function getTeacherName(id?: string) {
  if (!id) return '—'
  return classesStore.getTeacherById(id)?.shortName || '—'
}

function getClassName(id: string) {
  return classesStore.getClassById(id)?.name || ''
}
</script>

<style scoped>
.page { padding: 32px; }
.page-tabs { display: flex; gap: 0; border-bottom: 2px solid var(--k-border); margin-bottom: 24px; }
.tab-btn { padding: 10px 20px; border: none; background: none; font-size: 14px; font-weight: 500; color: var(--k-text-muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; }
.tab-btn.active { color: var(--k-navy); border-bottom-color: var(--k-navy); font-weight: 600; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
.eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
h2 { font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; color: var(--k-navy); margin: 0; }
h3 { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: var(--k-navy); margin: 0 0 16px; }

.classes-layout { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }
.class-list { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 8px; }
.list-group-label { font-size: 10px; font-weight: 700; letter-spacing: .08em; color: var(--k-text-muted); padding: 12px 12px 4px; margin: 0; }
.class-item { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 6px; border: none; background: none; cursor: pointer; font-size: 13.5px; color: #374151; text-align: left; }
.class-item:hover { background: #f5f7fa; }
.class-item.selected { background: var(--k-navy); color: #fff; font-weight: 600; }
.class-count { font-size: 12px; opacity: .7; }

.class-detail { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 24px; }
.detail-form-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 12px; font-weight: 600; color: var(--k-text-muted); }
.input { border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 10px; font-size: 13.5px; font-family: inherit; color: var(--k-text); }
.input:focus { outline: none; border-color: var(--k-blue); }

.courses-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.courses-actions { display: flex; gap: 8px; }

.data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.data-table th { text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 600; color: var(--k-text-muted); border-bottom: 1px solid var(--k-border); text-transform: uppercase; letter-spacing: .04em; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid var(--k-border); color: var(--k-text); }
.row-other td { color: var(--k-text-muted); }
.row-total td { border-top: 2px solid var(--k-border); border-bottom: none; }

.info-box { display: flex; gap: 12px; border-radius: 8px; padding: 14px 16px; margin-top: 16px; font-size: 13px; }
.info-box-blue { background: var(--k-sky); color: var(--k-navy); }
.info-icon { font-size: 16px; flex-shrink: 0; }

.teachers-layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
.teachers-table-wrap { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 0 0 16px; }
.teachers-table-wrap .data-table { margin: 0; }
.table-note { font-size: 12px; color: var(--k-text-muted); padding: 12px 16px 0; margin: 0; }

.invite-panel { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.invite-panel h3 { margin: 0; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.tag { background: var(--k-sky); color: var(--k-navy); font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: 6px; }
.link { color: var(--k-blue); font-size: 12px; text-decoration: none; }
.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13.5px; cursor: pointer; }
.sms-preview { background: #f3f4f6; border-radius: 8px; padding: 12px 14px; }
.sms-sender { font-size: 11px; font-weight: 700; color: var(--k-text-muted); margin: 0 0 4px; }
.sms-text { font-size: 13px; margin: 0; color: var(--k-text); }

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; border: 1px solid transparent; font-family: inherit; }
.btn-navy { background: var(--k-navy); color: #fff; border-color: var(--k-navy); }
.btn-outline { background: #fff; color: var(--k-navy); border-color: #d1d5db; }
.btn-full { width: 100%; justify-content: center; }

.avatar-sm { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: var(--k-sky); color: var(--k-navy); font-size: 12px; font-weight: 700; }
.badge { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
.badge-success { background: #dcfce7; color: #166534; }
.badge-orange { background: #fff7ed; color: #9a3412; }
.text-muted { color: var(--k-text-muted); font-size: 12px; }
</style>

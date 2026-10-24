<template>
  <div class="page">
    <div class="page-content">
      <p class="breadcrumb"><RouterLink to="/app/students">Élèves et familles</RouterLink> › Nouvelle inscription</p>
      <h1 class="page-title">Inscrire un élève</h1>

      <div class="form-layout">
        <div class="form-main">
          <!-- Section 1 -->
          <div class="form-section">
            <div class="section-num">1</div>
            <div class="section-body">
              <h2 class="section-title">L'élève</h2>
              <div class="fields-row fields-row--3">
                <div class="field">
                  <label>Nom</label>
                  <input type="text" v-model="form.lastName" class="input" />
                </div>
                <div class="field">
                  <label>Post-nom</label>
                  <input type="text" v-model="form.postName" class="input" />
                </div>
                <div class="field">
                  <label>Prénom</label>
                  <input type="text" v-model="form.firstName" class="input" />
                </div>
              </div>
              <div class="fields-row fields-row--3">
                <div class="field">
                  <label>Sexe</label>
                  <div class="toggle-group">
                    <button :class="['toggle-btn', form.sex === 'M' ? 'toggle-btn--active' : '']" @click="form.sex = 'M'">Garçon</button>
                    <button :class="['toggle-btn', form.sex === 'F' ? 'toggle-btn--active' : '']" @click="form.sex = 'F'">Fille</button>
                  </div>
                </div>
                <div class="field">
                  <label>Date de naissance</label>
                  <input type="text" v-model="form.birthDate" class="input" />
                </div>
                <div class="field">
                  <label>Lieu de naissance</label>
                  <input type="text" v-model="form.birthPlace" class="input" />
                </div>
              </div>
              <div class="field">
                <label>Classe 2026-2027</label>
                <select v-model="form.classId" class="input">
                  <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <p class="field-helper">Titulaire : Mme Mbala · {{ selectedClass?.studentCount }} élèves après inscription</p>
              </div>
            </div>
          </div>

          <!-- Section 2 -->
          <div class="form-section">
            <div class="section-num">2</div>
            <div class="section-body">
              <h2 class="section-title">Le parent responsable</h2>
              <div class="field">
                <label>Téléphone du parent</label>
                <input type="tel" v-model="form.guardianPhone" class="input" placeholder="+243 81 234 5678" />
                <p class="field-helper">Les alertes d'absence et les bulletins arrivent sur ce numéro.</p>
              </div>
              <div class="info-box info-box--green" v-if="familyFound">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
                <div>
                  <strong>Famille trouvée : KABONGO Mujinga Thérèse</strong><br>
                  Déjà responsable de Grace, Patrick et Esther. José sera lié à cette famille.
                </div>
              </div>
            </div>
          </div>

          <div class="info-box info-box--blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <div><strong>Aucun doublon trouvé</strong><br>LongiPlus a vérifié le nom et la date de naissance dans toute l'école.</div>
          </div>

          <div class="form-footer">
            <RouterLink to="/app/students" class="link-cancel">Annuler</RouterLink>
            <button class="btn btn--navy" @click="submit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Inscrire et envoyer le SMS
            </button>
          </div>
        </div>

        <!-- Right sidebar -->
        <aside class="form-sidebar">
          <div class="sidebar-card">
            <p class="sidebar-label">APRÈS L'ENREGISTREMENT</p>
            <ol class="sidebar-list">
              <li>LongiPlus crée le code élève permanent.</li>
              <li>José apparaît dans la liste d'appel et le carnet de notes de sa classe.</li>
              <li>Le parent reçoit le SMS ci-dessous.</li>
            </ol>
          </div>
          <div class="sidebar-card">
            <p class="sidebar-label">SMS ENVOYÉ AU PARENT</p>
            <div class="sms-preview">
              <p class="sms-sender">LONGIPLUS</p>
              <p class="sms-text">LongiPlus : José est inscrit à C.S. Mwinda. Classe : 1re Primaire. Code élève : [CRÉÉ À L'ENREGISTREMENT]. Gardez ce code.</p>
            </div>
            <p class="sidebar-note">Le code élève est permanent et suit l'enfant d'une année à l'autre.</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useClassesStore } from '@/stores'

const router = useRouter()
const classesStore = useClassesStore()
const classes = computed(() => classesStore.classes)

const form = ref({
  lastName: 'KABONGO',
  postName: 'Ilunga',
  firstName: 'José',
  sex: 'M' as 'M' | 'F',
  birthDate: '21/02/2020',
  birthPlace: 'Kinshasa',
  classId: 'c1',
  guardianPhone: '+243 81 234 5678',
})

const selectedClass = computed(() => classesStore.getClassById(form.value.classId))
const familyFound = computed(() => form.value.guardianPhone.length > 8)

function submit() {
  router.push('/app/students')
}
</script>

<style scoped>
.page { padding: 32px; }
.page-content { max-width: 1400px; }
.breadcrumb { font-size: 13px; color: var(--k-text-muted); margin: 0 0 8px; }
.breadcrumb a { color: var(--k-blue); text-decoration: none; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; color: var(--k-navy); margin: 0 0 24px; }
.form-layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
.form-section { display: flex; gap: 16px; background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 24px; margin-bottom: 16px; }
.section-num { width: 28px; height: 28px; border-radius: 50%; background: var(--k-navy); color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.section-body { flex: 1; }
.section-title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0 0 16px; }
.fields-row { display: grid; gap: 12px; margin-bottom: 12px; }
.fields-row--3 { grid-template-columns: repeat(3, 1fr); }
.field { display: flex; flex-direction: column; gap: 4px; }
.field label { font-size: 12px; font-weight: 600; color: var(--k-text-muted); }
.input { border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; font-size: 14px; font-family: inherit; outline: none; }
.input:focus { border-color: var(--k-blue); box-shadow: 0 0 0 3px rgba(1,96,211,0.1); }
.field-helper { font-size: 12px; color: var(--k-text-muted); margin: 4px 0 0; }
.toggle-group { display: flex; border: 1px solid #d1d5db; border-radius: 8px; overflow: hidden; }
.toggle-btn { flex: 1; padding: 8px; font-size: 14px; border: none; background: #fff; cursor: pointer; }
.toggle-btn--active { background: var(--k-sky); color: var(--k-navy); font-weight: 600; }
.info-box { display: flex; gap: 12px; padding: 14px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
.info-box--green { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.info-box--blue { background: var(--k-sky); border: 1px solid #bfdbfe; color: var(--k-navy); }
.form-footer { display: flex; align-items: center; justify-content: flex-end; gap: 16px; padding-top: 8px; }
.link-cancel { color: var(--k-blue); font-size: 14px; text-decoration: none; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; }
.btn--navy { background: var(--k-navy); color: #fff; }
.form-sidebar { display: flex; flex-direction: column; gap: 16px; }
.sidebar-card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; }
.sidebar-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; color: var(--k-text-muted); margin: 0 0 12px; text-transform: uppercase; }
.sidebar-list { padding-left: 18px; margin: 0; font-size: 13px; line-height: 1.7; color: var(--k-text); }
.sms-preview { background: #f3f4f6; border-radius: 8px; padding: 12px; margin-bottom: 8px; }
.sms-sender { font-size: 11px; font-weight: 700; color: var(--k-text-muted); margin: 0 0 4px; }
.sms-text { font-size: 13px; color: var(--k-text); margin: 0; }
.sidebar-note { font-size: 12px; color: var(--k-text-muted); margin: 0; }
</style>

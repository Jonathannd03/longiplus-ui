<template>
  <div class="console-layout">

    <!-- TOP NAV -->
    <header class="console-nav">
      <div class="console-nav__left">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="28" style="filter: brightness(0) invert(1)" />
        <span class="console-nav__title">Console équipe</span>
        <span class="console-nav__badge">Interne · LongiPlus seulement</span>
      </div>
      <div class="console-nav__right">
        <span class="console-nav__user">Grâce Kalonji · Équipe pilote Kinshasa</span>
      </div>
    </header>

    <div class="console-body">

      <!-- SIDEBAR -->
      <aside class="console-sidebar">
        <div class="sidebar-header">
          <h3 class="sidebar-title">Demandes d'écoles</h3>
          <div class="sidebar-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="sidebar-tab"
              :class="{ 'sidebar-tab--active': activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.label }} · {{ tab.count }}
            </button>
          </div>
        </div>
        <div class="school-list">
          <div
            v-for="school in filteredSchools"
            :key="school.id"
            class="school-item"
            :class="{ 'school-item--active': selectedId === school.id }"
            @click="selectedId = school.id"
          >
            <div class="school-item__top">
              <span class="school-item__name">{{ school.name }}</span>
              <span class="school-badge" :class="`school-badge--${school.badgeType}`">{{ school.badge }}</span>
            </div>
            <p class="school-item__sub">{{ school.demId }} · {{ school.location }} · {{ school.size }}</p>
            <p class="school-item__time">{{ school.docsLabel }} · {{ school.time }}</p>
          </div>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="console-main" v-if="selected">
        <div class="dem-header">
          <div>
            <p class="dem-id">{{ selected.demId }} · REÇUE LE {{ selected.receivedAt }}</p>
            <h1 class="dem-school">{{ selected.name }}</h1>
          </div>
          <span class="dem-timer" :class="selected.timerType">{{ selected.timerLabel }}</span>
        </div>

        <!-- Info cards row -->
        <div class="info-cards">
          <div class="info-card">
            <p class="info-card__label">DEMANDEUR</p>
            <p class="info-card__name">{{ selected.contact.name }} · {{ selected.contact.role }}</p>
            <p class="info-card__phone">
              {{ selected.contact.phone }}
              <span class="verified-badge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                vérifié
              </span>
            </p>
          </div>
          <div class="info-card">
            <p class="info-card__label">ÉCOLE</p>
            <p class="info-card__name">{{ selected.location }}</p>
            <p class="info-card__phone">{{ selected.levels }} · {{ selected.size }}</p>
          </div>
          <div class="info-card">
            <p class="info-card__label">AGRÉMENT EPST</p>
            <p class="info-card__name">{{ selected.epst }}</p>
            <p class="info-card__hint">À comparer avec l'arrêté</p>
          </div>
        </div>

        <!-- Documents -->
        <div class="section-card">
          <h3 class="section-title">Pièces</h3>
          <div class="doc-grid">
            <div v-for="doc in selected.docs" :key="doc.id" class="doc-thumb" :class="{ 'doc-thumb--missing': doc.missing }">
              <div class="doc-thumb__preview">
                <template v-if="doc.missing">
                  <p class="doc-thumb__missing-label">Pas encore envoyée</p>
                </template>
                <template v-else>
                  <div class="doc-thumb__placeholder">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p>Aperçu du document</p>
                  </div>
                </template>
              </div>
              <p class="doc-thumb__name">{{ doc.name }}</p>
            </div>
          </div>
        </div>

        <!-- Controls + Decision -->
        <div class="bottom-grid">
          <div class="section-card">
            <h3 class="section-title">Contrôles</h3>
            <div class="checklist">
              <label v-for="check in checks" :key="check.id" class="check-item">
                <input type="checkbox" v-model="check.done" class="check-input" />
                <span class="check-label" :class="{ 'check-label--done': check.done }">{{ check.label }}</span>
              </label>
            </div>
          </div>

          <div class="section-card">
            <h3 class="section-title">Décision</h3>
            <div class="form-group">
              <label class="form-label">Agent pour la visite</label>
              <select v-model="selectedAgent" class="form-input">
                <option value="">[NOM DE L'AGENT] · Lingwala</option>
                <option>Grâce Kalonji · Lingwala</option>
                <option>Patrick Mwamba · Kalamu</option>
                <option>Esther Lofombo · Gombe</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Message au demandeur</label>
              <textarea v-model="decisionMessage" class="form-textarea" rows="4" placeholder="Merci d'ajouter une photo de la façade avec le nom de l'école."></textarea>
            </div>
            <div class="decision-actions">
              <button class="btn btn--ghost btn--sm">Demander une pièce</button>
              <button class="btn btn--red btn--sm">Refuser</button>
              <button
                class="btn btn--navy btn--sm"
                :disabled="!allChecksDone"
                :title="allChecksDone ? '' : 'Cochez les 5 contrôles pour valider'"
              >
                Valider et planifier la visite
              </button>
            </div>
            <p class="decision-hint">
              Validation possible quand les {{ checks.length }} contrôles sont cochés. Chaque décision entre dans le journal.
            </p>
          </div>
        </div>

      </main>

      <main class="console-main console-main--empty" v-else>
        <p>Sélectionnez une demande dans la liste.</p>
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const activeTab = ref<'verify' | 'visit' | 'active'>('verify')

const tabs = [
  { id: 'verify' as const, label: 'À vérifier', count: 4 },
  { id: 'visit'  as const, label: 'Visite à faire', count: 3 },
  { id: 'active' as const, label: 'Activées', count: 11 },
]

const schools = [
  {
    id: 1, tab: 'verify',
    name: 'C.S. Mwinda', demId: 'DEM-2026-0148',
    location: 'Lingwala, Kinshasa', size: '300 à 500 élèves',
    levels: 'Primaire, secondaire',
    badge: '1 pièce manque', badgeType: 'warn',
    docsLabel: '2 sur 3 pièces', time: 'il y a 2 h',
    receivedAt: '24 OCT. 10:42',
    timerLabel: 'Vérification · délai 48 h, reste 46 h',
    timerType: 'timer--warn',
    contact: { name: 'Albert Mwinda', role: 'Promoteur', phone: '+243 81 234 0012' },
    epst: '[N° D\'AGRÉMENT]',
    docs: [
      { id: 1, name: 'Arrêté d\'agrément', missing: false },
      { id: 2, name: 'Pièce d\'identité',  missing: false },
      { id: 3, name: 'Façade de l\'école', missing: true  },
    ],
  },
  {
    id: 2, tab: 'verify',
    name: 'Institut La Colombe', demId: 'DEM-2026-0147',
    location: 'Katuba, Lubumbashi', size: '150 à 300 élèves',
    levels: 'Primaire, secondaire',
    badge: 'Complet', badgeType: 'ok',
    docsLabel: '3 sur 3 pièces', time: 'hier',
    receivedAt: '23 OCT. 14:15',
    timerLabel: 'Vérification · délai 48 h, reste 22 h',
    timerType: 'timer--ok',
    contact: { name: 'Marie Tshamba', role: 'Préfet', phone: '+243 97 812 3456' },
    epst: 'KAT/EPS/2021-0234',
    docs: [
      { id: 1, name: 'Arrêté d\'agrément', missing: false },
      { id: 2, name: 'Pièce d\'identité',  missing: false },
      { id: 3, name: 'Façade de l\'école', missing: false },
    ],
  },
  {
    id: 3, tab: 'verify',
    name: 'École Les Étoiles', demId: 'DEM-2026-0145',
    location: 'Ngaliema, Kinshasa', size: 'Moins de 150',
    levels: 'Primaire',
    badge: 'Délai dépassé', badgeType: 'danger',
    docsLabel: '3 sur 3 pièces', time: 'il y a 2 jours',
    receivedAt: '22 OCT. 09:00',
    timerLabel: 'Délai dépassé · 4 h de retard',
    timerType: 'timer--danger',
    contact: { name: 'Jean Lelo', role: 'Promoteur', phone: '+243 81 500 9988' },
    epst: 'KIN/EPS/2019-0087',
    docs: [
      { id: 1, name: 'Arrêté d\'agrément', missing: false },
      { id: 2, name: 'Pièce d\'identité',  missing: false },
      { id: 3, name: 'Façade de l\'école', missing: false },
    ],
  },
  {
    id: 4, tab: 'verify',
    name: 'C.S. Bondeko', demId: 'DEM-2026-0144',
    location: 'Limete, Kinshasa', size: '500 à 1 000 élèves',
    levels: 'Primaire, secondaire, humanités',
    badge: '2 pièces manquent', badgeType: 'danger',
    docsLabel: '1 sur 3 pièces', time: 'il y a 3 jours',
    receivedAt: '21 OCT. 16:00',
    timerLabel: 'Délai dépassé · 28 h de retard',
    timerType: 'timer--danger',
    contact: { name: 'Bosco Nkumu', role: 'Directeur', phone: '+243 82 344 7701' },
    epst: '[EN ATTENTE]',
    docs: [
      { id: 1, name: 'Arrêté d\'agrément', missing: false },
      { id: 2, name: 'Pièce d\'identité',  missing: true  },
      { id: 3, name: 'Façade de l\'école', missing: true  },
    ],
  },
]

const filteredSchools = computed(() => schools.filter(s => s.tab === activeTab.value))

const selectedId = ref(1)
const selected = computed(() => schools.find(s => s.id === selectedId.value) ?? null)

const selectedAgent = ref('')
const decisionMessage = ref('')

const checks = reactive([
  { id: 1, label: 'Le nom sur l\'arrêté correspond au nom déclaré', done: true },
  { id: 2, label: 'Le n° d\'agrément correspond à l\'arrêté', done: true },
  { id: 3, label: 'La pièce d\'identité correspond au demandeur', done: true },
  { id: 4, label: 'La façade montre le nom de l\'école', done: false },
  { id: 5, label: 'Aucune autre demande pour cette école', done: false },
])

const allChecksDone = computed(() => checks.every(c => c.done))
</script>

<style scoped>
/* ── LAYOUT ── */
.console-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* ── TOP NAV ── */
.console-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0b1e42;
  padding: 0 24px;
  height: 52px;
  flex-shrink: 0;
}

.console-nav__left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.console-nav__title {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.console-nav__badge {
  background: var(--k-orange);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

.console-nav__user {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
}

/* ── BODY ── */
.console-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── SIDEBAR ── */
.console-sidebar {
  width: 300px;
  min-width: 260px;
  background: #fff;
  border-right: 1px solid rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px 16px 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.sidebar-title {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0 0 12px;
}

.sidebar-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 0;
}

.sidebar-tab {
  padding: 7px 10px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-family: inherit;
  white-space: nowrap;
}

.sidebar-tab--active {
  color: var(--k-navy);
  border-bottom-color: var(--k-navy);
}

.school-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.school-item {
  padding: 12px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background 0.1s;
}

.school-item:hover { background: #f9fafb; }

.school-item--active {
  background: var(--k-sky);
  border-left-color: var(--k-navy);
}

.school-item__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 4px;
}

.school-item__name {
  font-size: 13px;
  font-weight: 700;
  color: #1a1a2e;
}

.school-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

.school-badge--ok      { background: #dcfce7; color: #15803d; }
.school-badge--warn    { background: #fef9c3; color: #92400e; }
.school-badge--danger  { background: #fee2e2; color: #991b1b; }

.school-item__sub  { font-size: 11px; color: #6b7280; margin: 0 0 2px; }
.school-item__time { font-size: 11px; color: #9ca3af; margin: 0; }

/* ── MAIN ── */
.console-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.console-main--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
}

.dem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
}

.dem-id {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--k-orange);
  margin: 0 0 6px;
}

.dem-school {
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0;
}

.dem-timer {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  white-space: nowrap;
  margin-top: 6px;
}

.timer--warn   { background: #fef9c3; color: #92400e; }
.timer--ok     { background: #dcfce7; color: #15803d; }
.timer--danger { background: #fee2e2; color: #991b1b; }

/* Info cards row */
.info-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.info-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 10px;
  padding: 14px 16px;
}

.info-card__label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin: 0 0 6px;
}

.info-card__name  { font-size: 13px; font-weight: 600; color: #1a1a2e; margin: 0 0 4px; }
.info-card__phone {
  font-size: 13px;
  color: #374151;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.info-card__hint  { font-size: 12px; color: #9ca3af; margin: 0; }

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  color: #15803d;
  background: #dcfce7;
  padding: 2px 7px;
  border-radius: 10px;
}

/* Section cards */
.section-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 16px;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0 0 14px;
}

/* Documents grid */
.doc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.doc-thumb {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 10px;
  overflow: hidden;
}

.doc-thumb__preview {
  height: 120px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doc-thumb--missing .doc-thumb__preview { background: var(--k-cream); }

.doc-thumb__missing-label {
  font-size: 12px;
  color: #9ca3af;
  font-style: italic;
}

.doc-thumb__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 11px;
}

.doc-thumb__name {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  padding: 8px 10px;
  margin: 0;
  border-top: 1px solid rgba(0,0,0,0.06);
}

/* Bottom grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

/* Checklist */
.checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.check-input {
  width: 16px;
  height: 16px;
  accent-color: var(--k-navy);
  flex-shrink: 0;
}

.check-label {
  font-size: 13px;
  color: #374151;
}

.check-label--done { color: #15803d; }

/* Decision form */
.form-group { margin-bottom: 14px; }
.form-label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }

.form-input {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  color: #1a1a2e;
  background: #fff;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.form-input:focus { border-color: var(--k-blue); }

.form-textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  color: #1a1a2e;
  background: #fff;
  outline: none;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.form-textarea:focus { border-color: var(--k-blue); }

.decision-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.decision-hint {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.5;
}
</style>

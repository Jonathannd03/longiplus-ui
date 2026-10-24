<template>
  <div class="page">
    <div class="page-content">
      <p class="eyebrow">ADMINISTRATION</p>
      <h2 class="page-title">Équipe et paramètres</h2>

      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ 'tab--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >{{ tab.label }}</button>
      </div>

      <!-- Tab: Équipe -->
      <div v-if="activeTab === 'team'">
        <!-- Invite banner -->
        <div class="invite-banner">
          <div>
            <p class="invite-banner__title">Inviter un membre de l'équipe</p>
            <p class="invite-banner__sub">Préfet adjoint, comptable, enseignant titulaire de classe…</p>
          </div>
          <div class="invite-banner__form">
            <input type="tel" placeholder="+243 81 XXX XX XX" class="invite-input" />
            <select class="invite-select">
              <option>Enseignant</option>
              <option>Préfet adjoint</option>
              <option>Comptable</option>
              <option>Secrétaire</option>
            </select>
            <button class="btn btn--yellow">+ Inviter</button>
          </div>
        </div>

        <!-- Team table -->
        <div class="card">
          <table class="table">
            <thead>
              <tr>
                <th>Membre</th>
                <th>Rôle</th>
                <th>Classes assignées</th>
                <th>Dernière connexion</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in teamMembers" :key="member.id">
                <td>
                  <div class="member-cell">
                    <div class="avatar">{{ member.initials }}</div>
                    <div>
                      <p class="member-name">{{ member.name }}</p>
                      <p class="member-phone">{{ member.phone }}</p>
                    </div>
                  </div>
                </td>
                <td class="td--muted">{{ member.role }}</td>
                <td class="td--muted">{{ member.classes || '—' }}</td>
                <td class="td--muted">{{ member.lastSeen }}</td>
                <td>
                  <span class="badge" :class="member.status === 'active' ? 'badge--success' : 'badge--warning'">
                    {{ member.status === 'active' ? 'Actif' : 'Invitation envoyée' }}
                  </span>
                </td>
                <td>
                  <button v-if="member.id !== 'u1'" class="link-btn link-btn--muted">Retirer</button>
                  <span v-else class="td--muted" style="font-size:12px">Vous</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Année scolaire -->
      <div v-if="activeTab === 'year'">
        <div class="two-col">
          <!-- Period calendar -->
          <div class="card">
            <h3 class="card__title">Calendrier des périodes</h3>
            <div class="period-list">
              <div v-for="period in schoolStore.periods" :key="period.id" class="period-row">
                <div class="period-row__label">
                  <span class="period-dot" :class="`period-dot--${period.status}`"></span>
                  <span class="period-name">{{ period.name }}</span>
                </div>
                <div class="period-row__dates">
                  <span class="td--muted">{{ period.startDate }} — {{ period.endDate }}</span>
                </div>
                <div class="period-row__clot">
                  <span class="td--muted" v-if="period.closingDate">Clôture {{ period.closingDate }}</span>
                </div>
                <div>
                  <span class="badge" :class="periodBadgeClass(period.status)">
                    {{ periodLabel(period.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Grade scale -->
          <div class="card">
            <h3 class="card__title">Barème de notation</h3>
            <div class="scale-table">
              <div class="scale-row scale-row--head">
                <span>Mention</span>
                <span>Seuil minimum</span>
                <span>Couleur</span>
              </div>
              <div v-for="s in gradeScale" :key="s.label" class="scale-row">
                <span class="scale-label">{{ s.label }}</span>
                <span class="scale-threshold">≥ {{ s.min }} %</span>
                <span class="scale-dot" :style="{ background: s.color }"></span>
              </div>
            </div>
            <p class="card__note">Note sur 20 · Seuil de réussite : 50 % · Paramètre national non modifiable</p>
          </div>
        </div>
      </div>

      <!-- Tab: École et année (placeholder) -->
      <div v-if="activeTab === 'school'">
        <div class="card placeholder-card">
          <div class="placeholder-icon">🏫</div>
          <p class="placeholder-title">Informations de l'école</p>
          <p class="placeholder-sub">Nom officiel, adresse, province, numéro EPSP — disponible en Phase 2.</p>
        </div>
      </div>

      <!-- Tab: Rôles et droits (placeholder) -->
      <div v-if="activeTab === 'roles'">
        <div class="card placeholder-card">
          <div class="placeholder-icon">🔐</div>
          <p class="placeholder-title">Gestion des rôles</p>
          <p class="placeholder-sub">Permissions granulaires par rôle — disponible en Phase 2.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSchoolStore } from '@/stores'

const schoolStore = useSchoolStore()

const activeTab = ref('team')

const tabs = [
  { id: 'team', label: 'Équipe' },
  { id: 'year', label: 'Année scolaire' },
  { id: 'school', label: 'École et année' },
  { id: 'roles', label: 'Rôles et droits' },
]

const teamMembers = [
  { id: 'u1', name: 'J. Mukendi', initials: 'JM', phone: '+243 81 ••• 34 56', role: 'Préfet', classes: 'Toutes', lastSeen: 'Il y a 2 min', status: 'active' },
  { id: 'u2', name: 'F. Ngoy', initials: 'FN', phone: '+243 99 ••• 12 34', role: 'Enseignant', classes: '4e Sc. A, 5e Sc. B', lastSeen: '13 janv. 2027', status: 'active' },
  { id: 'u3', name: 'B. Tshimanga', initials: 'BT', phone: '+243 81 ••• 78 90', role: 'Préfet adjoint', classes: '—', lastSeen: '15 janv. 2027', status: 'active' },
  { id: 'u4', name: 'M. Kabeya', initials: 'MK', phone: '+243 97 ••• 45 67', role: 'Enseignant', classes: 'En attente', lastSeen: 'Jamais', status: 'pending' },
]

const gradeScale = [
  { label: 'Grande distinction', min: 80, color: '#166534' },
  { label: 'Distinction', min: 70, color: '#0369a1' },
  { label: 'Satisfaction', min: 60, color: '#374151' },
  { label: 'Réussite', min: 50, color: '#854d0e' },
  { label: 'Échec', min: 0, color: '#991b1b' },
]

function periodBadgeClass(status: string) {
  if (status === 'locked') return 'badge--neutral'
  if (status === 'open') return 'badge--info'
  return 'badge--neutral'
}

function periodLabel(status: string) {
  if (status === 'locked') return 'Clôturée'
  if (status === 'open') return 'En cours'
  return 'À venir'
}
</script>

<style scoped>
.page { padding: 32px 36px; }
.page-content { max-width: 1400px; }
.eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 700; color: var(--k-navy); margin: 0 0 20px; }

.tabs { display: flex; gap: 4px; border-bottom: 2px solid var(--k-border); margin-bottom: 24px; }
.tab { padding: 9px 16px; background: none; border: none; font-size: 13.5px; font-weight: 500; color: var(--k-text-muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all .15s; }
.tab--active { color: var(--k-navy); font-weight: 700; border-bottom-color: var(--k-navy); }

.invite-banner { background: var(--k-sky); border: 1px solid #c7d9f5; border-radius: var(--k-radius); padding: 16px 20px; display: flex; align-items: center; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
.invite-banner__title { font-size: 14px; font-weight: 600; color: var(--k-navy); margin: 0 0 2px; }
.invite-banner__sub { font-size: 12px; color: var(--k-text-muted); margin: 0; }
.invite-banner__form { display: flex; gap: 8px; align-items: center; flex: 1; min-width: 280px; }
.invite-input { flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 7px; font-size: 13px; }
.invite-select { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 7px; font-size: 13px; background: #fff; }

.btn { padding: 8px 16px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; white-space: nowrap; }
.btn--yellow { background: var(--k-yellow); color: #1a1a2e; }

.card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); padding: 20px; }
.card__title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0 0 16px; }
.card__note { font-size: 11.5px; color: var(--k-text-muted); margin: 12px 0 0; }

.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th { text-align: left; font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--k-text-muted); padding: 0 12px 10px; border-bottom: 1px solid var(--k-border); }
.table td { padding: 12px; border-bottom: 1px solid var(--k-border); vertical-align: middle; }
.table tbody tr:last-child td { border-bottom: none; }
.td--muted { color: var(--k-text-muted); font-size: 12.5px; }

.member-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--k-navy); color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.member-name { font-size: 13px; font-weight: 600; color: var(--k-navy); margin: 0 0 2px; }
.member-phone { font-size: 12px; color: var(--k-text-muted); margin: 0; font-family: 'IBM Plex Mono', monospace; }

.badge { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.badge--success { background: #dcfce7; color: #166534; }
.badge--warning { background: #fef9c3; color: #854d0e; }
.badge--neutral { background: #f3f4f6; color: #374151; }
.badge--info { background: var(--k-sky); color: var(--k-navy); }

.link-btn { background: none; border: none; font-size: 13px; font-weight: 600; cursor: pointer; padding: 0; }
.link-btn--muted { color: var(--k-text-muted); }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.period-list { display: flex; flex-direction: column; gap: 10px; }
.period-row { display: grid; grid-template-columns: 1fr 1.4fr 1fr auto; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--k-border); }
.period-row:last-child { border-bottom: none; }
.period-row__label { display: flex; align-items: center; gap: 8px; }
.period-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.period-dot--locked { background: #9ca3af; }
.period-dot--open { background: var(--k-blue); }
.period-dot--upcoming { background: #d1d5db; }
.period-name { font-size: 13px; font-weight: 600; color: var(--k-navy); }

.scale-table { display: flex; flex-direction: column; gap: 0; }
.scale-row { display: grid; grid-template-columns: 1.5fr 1fr 24px; align-items: center; gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--k-border); }
.scale-row:last-child { border-bottom: none; }
.scale-row--head span { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--k-text-muted); }
.scale-label { font-size: 13px; font-weight: 500; color: var(--k-navy); }
.scale-threshold { font-size: 13px; color: var(--k-text-muted); }
.scale-dot { width: 12px; height: 12px; border-radius: 50%; }

.placeholder-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; }
.placeholder-icon { font-size: 40px; margin-bottom: 12px; }
.placeholder-title { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: var(--k-navy); margin: 0 0 6px; }
.placeholder-sub { font-size: 13px; color: var(--k-text-muted); margin: 0; }
</style>

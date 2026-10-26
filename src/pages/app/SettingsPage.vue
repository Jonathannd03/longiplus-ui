<template>
  <div class="page">
    <div class="page-content">
      <p class="eyebrow">ADMINISTRATION</p>
      <h2 class="page-title">Équipe et paramètres</h2>

      <div class="tabs">
        <button
          v-for="t in tabs"
          :key="t.id"
          class="tab"
          :class="{ 'tab--active': activeTab === t.id }"
          @click="activeTab = t.id"
        >{{ t.label }}</button>
      </div>

      <!-- Tab: Équipe -->
      <div v-if="activeTab === 'team'">
        <div class="invite-banner">
          <div>
            <p class="invite-banner__title">Inviter un membre de l'équipe</p>
            <p class="invite-banner__sub">Préfet adjoint, économe, enseignant titulaire de classe…</p>
          </div>
          <div class="invite-banner__form">
            <input v-model="inviteEmail" type="email" placeholder="prenom.nom@ecole.cd" class="invite-input" />
            <select v-model="inviteRole" class="invite-select">
              <option value="teacher">Professeur</option>
              <option value="class_teacher">Titulaire</option>
              <option value="director">Préfet</option>
              <option value="bursar">Économe</option>
              <option value="secretary">Secrétaire</option>
            </select>
            <button class="btn btn--yellow" :disabled="inviting || !inviteEmail" @click="sendInvite">
              {{ inviting ? 'Envoi…' : '+ Inviter' }}
            </button>
          </div>
          <p v-if="inviteError" class="form-error">{{ inviteError }}</p>
        </div>

        <div class="card">
          <table class="table">
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Rôle</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in members" :key="m.id">
                <td>{{ m.email }}</td>
                <td class="td--muted">{{ roleLabel(m.role) }}</td>
                <td>
                  <span class="badge" :class="m.status === 'active' ? 'badge--success' : 'badge--warning'">
                    {{ m.status === 'active' ? 'Actif' : 'Invitation envoyée' }}
                  </span>
                </td>
              </tr>
              <tr v-if="members.length === 0 && !loadingMembers">
                <td colspan="3" class="empty-cell">Aucun membre.</td>
              </tr>
              <tr v-if="loadingMembers">
                <td colspan="3" class="empty-cell">Chargement…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Comptes de paiement -->
      <div v-if="activeTab === 'payout'">
        <!-- Create form -->
        <div class="invite-banner">
          <div>
            <p class="invite-banner__title">Ajouter un compte de paiement</p>
            <p class="invite-banner__sub">Mobile money ou compte bancaire pour recevoir les frais scolaires.</p>
          </div>
          <div class="invite-banner__form">
            <select v-model="newAccount.kind" class="invite-select">
              <option value="mobile_money">Mobile Money</option>
              <option value="bank">Banque</option>
            </select>
            <input
              v-if="newAccount.kind === 'mobile_money'"
              v-model="newAccount.operator"
              class="invite-input"
              placeholder="M-Pesa, Orange, Airtel…"
            />
            <input v-model="newAccount.numberMasked" class="invite-input" placeholder="****1234" />
            <button class="btn btn--yellow" :disabled="creatingAccount || !newAccount.numberMasked" @click="createAccount">
              {{ creatingAccount ? 'Ajout…' : '+ Ajouter' }}
            </button>
          </div>
          <p v-if="createAccountError" class="form-error">{{ createAccountError }}</p>
        </div>

        <div class="card">
          <table class="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Opérateur / Banque</th>
                <th>Numéro</th>
                <th>Statut</th>
                <th>Actif dès</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="acc in accounts" :key="acc.id">
                <td>{{ acc.kind === 'mobile_money' ? 'Mobile Money' : 'Banque' }}</td>
                <td class="td--muted">{{ acc.operator || '—' }}</td>
                <td>{{ acc.numberMasked }}</td>
                <td>
                  <span class="badge" :class="accountBadgeClass(acc.status)">
                    {{ accountStatusLabel(acc.status) }}
                  </span>
                </td>
                <td class="td--muted">{{ acc.activatesAt ? formatDate(acc.activatesAt) : '—' }}</td>
                <td>
                  <button
                    v-if="acc.status === 'pending' && !acc.approvedBy"
                    class="link-btn"
                    :disabled="approvingId === acc.id"
                    @click="approveAccount(acc.id)"
                  >
                    {{ approvingId === acc.id ? '…' : 'Approuver' }}
                  </button>
                </td>
              </tr>
              <tr v-if="accounts.length === 0 && !loadingAccounts">
                <td colspan="6" class="empty-cell">Aucun compte de paiement.</td>
              </tr>
              <tr v-if="loadingAccounts">
                <td colspan="6" class="empty-cell">Chargement…</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="info-box info-box-blue" style="margin-top:16px">
          <span class="info-icon">ℹ</span>
          <span><strong>Règle BR-07</strong> : après approbation, le compte devient actif 24 h plus tard. Cela permet au promoteur de vérifier avant toute transaction.</span>
        </div>
      </div>

      <!-- Tab: Année scolaire -->
      <div v-if="activeTab === 'year'">
        <div class="two-col">
          <div class="card" style="padding:20px">
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

          <div class="card" style="padding:20px">
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

      <!-- Tab: École (placeholder) -->
      <div v-if="activeTab === 'school'">
        <div class="card placeholder-card">
          <p class="placeholder-title">Informations de l'école</p>
          <p class="placeholder-sub">Nom officiel, adresse, province, numéro EPSP — disponible en M3.</p>
        </div>
      </div>

      <!-- Tab: Rôles (placeholder) -->
      <div v-if="activeTab === 'roles'">
        <div class="card placeholder-card">
          <p class="placeholder-title">Gestion des rôles</p>
          <p class="placeholder-sub">Permissions granulaires par rôle — disponible en M7.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSchoolStore } from '@/stores'
import { useSetupApi } from '@/api/setup'
import type { Member, PayoutAccount } from '@/api/setup'

const schoolStore = useSchoolStore()
const api = useSetupApi()

const activeTab = ref('team')

const tabs = [
  { id: 'team', label: 'Équipe' },
  { id: 'payout', label: 'Comptes de paiement' },
  { id: 'year', label: 'Année scolaire' },
  { id: 'school', label: 'École et année' },
  { id: 'roles', label: 'Rôles et droits' },
]

// --- Team tab ---
const members = ref<Member[]>([])
const loadingMembers = ref(false)
const inviteEmail = ref('')
const inviteRole = ref('teacher')
const inviting = ref(false)
const inviteError = ref('')

// --- Payout accounts tab ---
const accounts = ref<PayoutAccount[]>([])
const loadingAccounts = ref(false)
const newAccount = ref({ kind: 'mobile_money' as 'mobile_money' | 'bank', operator: '', numberMasked: '' })
const creatingAccount = ref(false)
const createAccountError = ref('')
const approvingId = ref<string | null>(null)

onMounted(async () => {
  loadingMembers.value = true
  loadingAccounts.value = true
  const [mems, accs] = await Promise.all([
    api.members.list().catch(() => [] as Member[]),
    api.payoutAccounts.list().catch(() => [] as PayoutAccount[]),
  ])
  members.value = mems
  accounts.value = accs
  loadingMembers.value = false
  loadingAccounts.value = false
})

async function sendInvite() {
  if (!inviteEmail.value) return
  inviting.value = true
  inviteError.value = ''
  try {
    const m = await api.members.invite({ email: inviteEmail.value, role: inviteRole.value })
    members.value.push(m)
    inviteEmail.value = ''
  } catch {
    inviteError.value = 'Erreur lors de l\'envoi. Réessayez.'
  } finally {
    inviting.value = false
  }
}

async function createAccount() {
  if (!newAccount.value.numberMasked) return
  creatingAccount.value = true
  createAccountError.value = ''
  try {
    const accountDto: Parameters<typeof api.payoutAccounts.create>[0] = {
      kind: newAccount.value.kind,
      numberMasked: newAccount.value.numberMasked,
    }
    if (newAccount.value.operator) accountDto.operator = newAccount.value.operator
    const created = await api.payoutAccounts.create(accountDto)
    accounts.value.push(created)
    newAccount.value = { kind: 'mobile_money', operator: '', numberMasked: '' }
  } catch {
    createAccountError.value = 'Erreur lors de l\'ajout. Réessayez.'
  } finally {
    creatingAccount.value = false
  }
}

async function approveAccount(id: string) {
  approvingId.value = id
  try {
    const updated = await api.payoutAccounts.approve(id)
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx !== -1) accounts.value[idx] = updated
  } catch { /* ignore */ }
  finally { approvingId.value = null }
}

// --- Helpers ---
const roleLabels: Record<string, string> = {
  owner: 'Promoteur', director: 'Préfet', bursar: 'Économe',
  secretary: 'Secrétaire', teacher: 'Professeur', class_teacher: 'Titulaire',
}
function roleLabel(role: string) { return roleLabels[role] ?? role }

function accountStatusLabel(status: string) {
  if (status === 'active') return 'Actif'
  if (status === 'pending') return 'En attente'
  return 'Suspendu'
}

function accountBadgeClass(status: string) {
  if (status === 'active') return 'badge--success'
  if (status === 'pending') return 'badge--warning'
  return 'badge--neutral'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-CD', { day: 'numeric', month: 'short', year: 'numeric' })
}

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

const gradeScale = [
  { label: 'Grande distinction', min: 80, color: '#166534' },
  { label: 'Distinction', min: 70, color: '#0369a1' },
  { label: 'Satisfaction', min: 60, color: '#374151' },
  { label: 'Réussite', min: 50, color: '#854d0e' },
  { label: 'Échec', min: 0, color: '#991b1b' },
]
</script>

<style scoped>
.page { padding: 32px 36px; }
.page-content { max-width: 1400px; }
.eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--k-orange); margin: 0 0 6px; }
.page-title { font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 700; color: var(--k-navy); margin: 0 0 20px; }

.tabs { display: flex; gap: 4px; border-bottom: 2px solid var(--k-border); margin-bottom: 24px; }
.tab { padding: 9px 16px; background: none; border: none; font-size: 13.5px; font-weight: 500; color: var(--k-text-muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all .15s; }
.tab--active { color: var(--k-navy); font-weight: 700; border-bottom-color: var(--k-navy); }

.invite-banner { background: var(--k-sky); border: 1px solid #c7d9f5; border-radius: var(--k-radius); padding: 16px 20px; margin-bottom: 16px; }
.invite-banner__title { font-size: 14px; font-weight: 600; color: var(--k-navy); margin: 0 0 2px; }
.invite-banner__sub { font-size: 12px; color: var(--k-text-muted); margin: 0 0 10px; }
.invite-banner__form { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.invite-input { flex: 1; min-width: 140px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 7px; font-size: 13px; background: #fff; }
.invite-select { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 7px; font-size: 13px; background: #fff; }
.form-error { font-size: 13px; color: #dc2626; margin: 8px 0 0; }

.btn { padding: 8px 16px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; white-space: nowrap; font-family: inherit; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn--yellow { background: var(--k-yellow); color: #1a1a2e; }

.card { background: #fff; border: 1px solid var(--k-border); border-radius: var(--k-radius); }
.card__title { font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 600; color: var(--k-navy); margin: 0 0 16px; }
.card__note { font-size: 11.5px; color: var(--k-text-muted); margin: 12px 0 0; }

.table { width: 100%; border-collapse: collapse; font-size: 13px; }
.table th { text-align: left; font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--k-text-muted); padding: 12px; border-bottom: 1px solid var(--k-border); }
.table td { padding: 12px; border-bottom: 1px solid var(--k-border); vertical-align: middle; }
.table tbody tr:last-child td { border-bottom: none; }
.td--muted { color: var(--k-text-muted); font-size: 12.5px; }
.empty-cell { color: #9ca3af; font-size: 13px; text-align: center; padding: 24px 12px !important; }

.badge { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.badge--success { background: #dcfce7; color: #166534; }
.badge--warning { background: #fef9c3; color: #854d0e; }
.badge--neutral { background: #f3f4f6; color: #374151; }
.badge--info { background: var(--k-sky); color: var(--k-navy); }

.link-btn { background: none; border: none; font-size: 13px; font-weight: 600; cursor: pointer; padding: 0; color: var(--k-blue); }
.link-btn:disabled { opacity: .5; cursor: not-allowed; }

.info-box { display: flex; gap: 12px; border-radius: 8px; padding: 14px 16px; font-size: 13px; }
.info-box-blue { background: var(--k-sky); color: var(--k-navy); }
.info-icon { font-size: 16px; flex-shrink: 0; }

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

.scale-table { display: flex; flex-direction: column; }
.scale-row { display: grid; grid-template-columns: 1.5fr 1fr 24px; align-items: center; gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--k-border); }
.scale-row:last-child { border-bottom: none; }
.scale-row--head span { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--k-text-muted); }
.scale-label { font-size: 13px; font-weight: 500; color: var(--k-navy); }
.scale-threshold { font-size: 13px; color: var(--k-text-muted); }
.scale-dot { width: 12px; height: 12px; border-radius: 50%; }

.placeholder-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; }
.placeholder-title { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: var(--k-navy); margin: 0 0 6px; }
.placeholder-sub { font-size: 13px; color: var(--k-text-muted); margin: 0; }

h3 { font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: var(--k-navy); margin: 0 0 16px; }
</style>

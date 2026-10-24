<template>
  <div class="landing">

    <!-- ─── NAV ─────────────────────────────────────────────── -->
    <nav class="nav">
      <div class="nav__inner">
        <a href="#" class="nav__brand">
          <img src="/longiplus-logo.svg" alt="LongiPlus" height="32" />
        </a>
        <ul class="nav__links">
          <li><a href="#ecoles">Écoles</a></li>
          <li><a href="#parents">Parents</a></li>
          <li><a href="#securite">Sécurité</a></li>
          <li><a href="#questions">Questions</a></li>
        </ul>
        <div class="nav__right">
          <RouterLink to="/login" class="btn btn--ghost-navy">Se connecter</RouterLink>
          <a href="#pilote" class="btn btn--navy">Rejoindre le pilote</a>
        </div>
      </div>
    </nav>

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero__circle" aria-hidden="true"></div>
      <div class="hero__inner container">
        <div class="hero__content">
          <p class="eyebrow eyebrow--yellow">ÉCOLES PRIVÉES DE LA RDC</p>
          <h1 class="hero__heading">La gestion scolaire et les frais, enfin simples.</h1>
          <p class="hero__sub">
            Élèves, notes, bulletins et collecte des frais au même endroit.
            Les parents paient par M-Pesa, Orange Money ou Airtel Money.
            L'école voit chaque paiement en direct.
          </p>
          <div class="hero__actions">
            <a href="#pilote" class="btn btn--yellow">Rejoindre le pilote 2027</a>
            <a href="#parents" class="btn btn--ghost">Je suis parent</a>
          </div>
        </div>

        <div class="hero__card-wrap">
          <div class="dashboard-card">
            <div class="dashboard-card__header">
              <span class="dashboard-card__day">Aujourd'hui</span>
              <span class="badge badge--live">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="4" fill="#16a34a"/></svg>
                En direct
              </span>
            </div>
            <div class="dashboard-card__amount">
              <span class="amount-number">1 845</span>
              <span class="amount-label">USD encaissés</span>
            </div>
            <ul class="payment-list">
              <li>
                <span class="payment-name"><strong>KABONGO</strong> Grace · M-Pesa</span>
                <span class="payment-value">50,00 USD</span>
              </li>
              <li>
                <span class="payment-name"><strong>BAHATI</strong> Sarah · Orange Money</span>
                <span class="payment-value">75,00 USD</span>
              </li>
              <li>
                <span class="payment-name"><strong>LUZOLO</strong> Daniel · Espèces</span>
                <span class="payment-value">120 000 CDF</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="hero__arcs" aria-hidden="true">
        <span class="hero__arc hero__arc--1"></span>
        <span class="hero__arc hero__arc--2"></span>
      </div>
    </section>

    <!-- ─── PROBLÈME ─────────────────────────────────────────── -->
    <section class="section section--white" id="ecoles">
      <div class="container">
        <p class="eyebrow eyebrow--orange">LE PROBLÈME</p>
        <h2 class="section__heading">L'argent liquide coûte cher aux écoles et aux familles.</h2>
        <div class="cards-grid cards-grid--3">
          <div class="feature-card">
            <div class="feature-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h3>Des caisses à compter</h3>
            <p>Chaque billet passe par plusieurs mains. Les erreurs et les pertes sont difficiles à retrouver.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Des parents qui font la queue</h3>
            <p>Pour payer une tranche, un parent perd souvent une demi-journée de travail.</p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <h3>Des bulletins faits à la main</h3>
            <p>Les enseignants recopient les notes pendant des jours à chaque période.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── PARENTS ───────────────────────────────────────────── -->
    <section class="section section--light" id="parents">
      <div class="container split">
        <div class="split__text">
          <p class="eyebrow eyebrow--yellow">POUR LES PARENTS</p>
          <h2 class="section__heading">Payez en trois étapes, même sans internet.</h2>
          <ol class="steps">
            <li class="step">
              <span class="step__num">1</span>
              <div>
                <h4>Composez *[CODE]#</h4>
                <p>Sur n'importe quel téléphone, avec votre compte mobile money.</p>
              </div>
            </li>
            <li class="step">
              <span class="step__num">2</span>
              <div>
                <h4>Entrez le code élève</h4>
                <p>Le prénom, la classe et le solde s'affichent avant de payer.</p>
              </div>
            </li>
            <li class="step">
              <span class="step__num">3</span>
              <div>
                <h4>Confirmez avec votre PIN</h4>
                <p>Le reçu arrive par SMS. Les bulletins aussi, par lien sécurisé.</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="split__visual">
          <div class="phone-wrap">
            <div class="phone">
              <div class="phone__screen">
                <pre class="ussd">Bienvenue sur LongiPlus
1. Payer les frais
2. Consulter le solde
3. Dernier reçu
4. Résultats scolaires</pre>
              </div>
              <div class="phone__keypad">
                <button>1</button><button>2</button><button>3</button>
                <button>4</button><button>5</button><button>6</button>
              </div>
            </div>
            <div class="sms-thread">
              <div class="sms-bubble">
                <span class="sms-meta">LONGIPLUS · 14:32</span>
                <p>Reçu R-04812 · 50,00 USD pour Grace (4e Scient. A). Solde : 100,00 USD. Prochaine tranche : 15 janv.</p>
                <span class="badge badge--paid">✓ Payé</span>
              </div>
              <div class="sms-bubble">
                <span class="sms-meta">LONGIPLUS · 10 avr.</span>
                <p>Le bulletin de Grace (2e période) est disponible : kls.cd/b/7Q4M</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── ÉCOLES ─────────────────────────────────────────────── -->
    <section class="section section--white">
      <div class="container">
        <p class="eyebrow eyebrow--orange">POUR LES ÉCOLES</p>
        <h2 class="section__heading">Un seul outil pour le préfet, l'économe et les enseignants.</h2>
        <div class="cards-grid cards-grid--3">
          <div class="feature-card feature-card--plain">
            <h3>Paiements en direct</h3>
            <p>Mobile money, banque et caisse dans un même journal, en USD et en CDF.</p>
          </div>
          <div class="feature-card feature-card--plain">
            <h3>Reçus et relances par SMS</h3>
            <p>Un reçu numéroté à chaque paiement. Des rappels polis avant chaque tranche.</p>
          </div>
          <div class="feature-card feature-card--plain">
            <h3>Clôture de caisse</h3>
            <p>Compté contre enregistré, chaque soir. Chaque écart expliqué.</p>
          </div>
          <div class="feature-card feature-card--plain">
            <h3>Notes sur téléphone</h3>
            <p>Les enseignants saisissent les notes en classe, même sans réseau.</p>
          </div>
          <div class="feature-card feature-card--plain">
            <h3>Bulletins en un clic</h3>
            <p>Totaux, pourcentages et rangs calculés. PDF au format de votre école.</p>
          </div>
          <div class="feature-card feature-card--plain">
            <h3>Arriérés sous contrôle</h3>
            <p>Par classe, par famille, par tranche. Le préfet sait qui appeler.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SÉCURITÉ ───────────────────────────────────────────── -->
    <section class="section section--white" id="securite">
      <div class="container split">
        <div class="split__text">
          <p class="eyebrow eyebrow--orange">SÉCURITÉ</p>
          <h2 class="section__heading">L'argent va directement sur le compte de l'école.</h2>
          <p class="section__body">
            LongiPlus ne garde jamais les fonds. Les paiements passent par des opérateurs
            agréés vers le compte marchand ou bancaire de l'école.
            LongiPlus enregistre, rapproche et envoie les reçus.
          </p>
        </div>
        <div class="security-list">
          <div class="security-item">
            <span class="security-item__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <div>
              <h4>Chaque école ne voit que ses données</h4>
              <p>Accès par rôle : promoteur, préfet, économe, enseignant.</p>
            </div>
          </div>
          <div class="security-item">
            <span class="security-item__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <div>
              <h4>Aucun paiement effacé</h4>
              <p>Une annulation demande un motif et l'accord du préfet.</p>
            </div>
          </div>
          <div class="security-item">
            <span class="security-item__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </span>
            <div>
              <h4>Les parents voient seulement leurs enfants</h4>
              <p>Accès par numéro de téléphone et code SMS.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── PILOTE ─────────────────────────────────────────────── -->
    <section class="section section--navy" id="pilote">
      <div class="container split">
        <div class="split__text">
          <p class="eyebrow eyebrow--yellow">PILOTE 2027 · KINSHASA</p>
          <h2 class="section__heading section__heading--white">Faites partie des premières écoles.</h2>
          <p class="section__body section__body--white">
            Nous accompagnons 5 à 10 écoles à partir de mars 2027 :
            installation, import des élèves, formation sur place.
          </p>
        </div>
        <form class="pilot-form" @submit.prevent>
          <div class="form-field">
            <label class="form-label">Nom de l'école</label>
            <input class="form-input" type="text" placeholder="Complexe Scolaire …" />
          </div>
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">Commune</label>
              <input class="form-input" type="text" placeholder="Lingwala" />
            </div>
            <div class="form-field">
              <label class="form-label">Votre rôle</label>
              <input class="form-input" type="text" placeholder="Promoteur, préfet…" />
            </div>
          </div>
          <div class="form-field">
            <label class="form-label">Téléphone</label>
            <input class="form-input" type="tel" placeholder="+243 …" />
          </div>
          <RouterLink to="/register" class="btn btn--blue btn--full">Inscrire mon école</RouterLink>
        </form>
      </div>
    </section>

    <!-- ─── FAQ ───────────────────────────────────────────────── -->
    <section class="section section--white" id="questions">
      <div class="container container--narrow">
        <h2 class="faq__title">Questions fréquentes</h2>
        <div class="faq">
          <details class="faq__item" open>
            <summary>Combien coûte LongiPlus pour l'école ?</summary>
            <p>Pas d'abonnement mensuel. LongiPlus se rémunère par une petite commission sur les paiements. Le taux est fixé avec chaque école : [TAUX].</p>
          </details>
          <details class="faq__item">
            <summary>Les parents ont-ils besoin d'un smartphone ?</summary>
            <p>Non. Le paiement USSD fonctionne sur tout téléphone avec un compte mobile money. Pas d'application à télécharger.</p>
          </details>
          <details class="faq__item">
            <summary>Peut-on encore payer en espèces ?</summary>
            <p>Oui. L'économe enregistre le paiement en caisse directement dans LongiPlus. Le reçu numérique est généré immédiatement.</p>
          </details>
          <details class="faq__item">
            <summary>Et les frais en dollars et en francs ?</summary>
            <p>LongiPlus gère les deux devises. Le taux de conversion est fixé par l'école et s'affiche avant chaque paiement.</p>
          </details>
        </div>
      </div>
    </section>

    <!-- ─── FOOTER ─────────────────────────────────────────────── -->
    <footer class="footer">
      <div class="footer__inner container">
        <img src="/longiplus-logo.svg" alt="LongiPlus" height="36" class="footer__logo" />
        <div class="footer__contact">
          <span>Kinshasa · [ADRESSE]</span>
          <span>[TÉLÉPHONE]</span>
          <span>contact@[DOMAINE]</span>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* ── Reset & layout helpers ───────────────────────────── */
.landing {
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--k-text);
  background: #fff;
}

.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.container--narrow {
  max-width: 720px;
}

/* ── Buttons ──────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: none;
  border: 2px solid transparent;
  transition: opacity 0.15s, background 0.15s;
  white-space: nowrap;
}
.btn:hover { opacity: 0.88; text-decoration: none; }

.btn--navy  { background: var(--k-navy); color: #fff; }
.btn--yellow { background: var(--k-yellow); color: var(--k-navy); }
.btn--ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.6); }
.btn--ghost-navy { background: transparent; color: var(--k-navy); border-color: #d1d5db; }
.btn--blue  { background: var(--k-blue); color: #fff; }
.btn--full  { width: 100%; justify-content: center; }

/* ── Eyebrow labels ───────────────────────────────────── */
.eyebrow {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 0.75rem;
}
.eyebrow--yellow { color: var(--k-yellow); }
.eyebrow--orange { color: var(--k-orange); }

/* ── Section base ─────────────────────────────────────── */
.section { padding: 80px 0; }
.section--white { background: #fff; }
.section--light { background: #f5f7fa; }
.section--sky   { background: var(--k-sky); }
.section--navy  { background: var(--k-navy); }

.section__heading {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  color: var(--k-navy);
  margin: 0 0 2rem;
  max-width: 560px;
}
.section__heading--white { color: #fff; }
.section__body { color: var(--k-text-muted); line-height: 1.7; margin: 0 0 1.5rem; }
.section__body--white { color: rgba(255,255,255,0.8); }

/* ── Split layout ─────────────────────────────────────── */
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}
.split__text { max-width: 480px; }

/* ── Feature cards ────────────────────────────────────── */
.cards-grid {
  display: grid;
  gap: 1.25rem;
}
.cards-grid--3 { grid-template-columns: repeat(3, 1fr); }

.feature-card {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 1.5rem;
}
.feature-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--k-sky);
  color: var(--k-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.feature-card h3 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--k-navy);
  margin: 0 0 0.4rem;
}
.feature-card p {
  font-size: 0.875rem;
  color: var(--k-text-muted);
  margin: 0;
  line-height: 1.6;
}
.feature-card--plain { background: #fafafa; }
.feature-card--plain h3 { margin-bottom: 0.5rem; }

/* ── NAV ──────────────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid var(--k-border);
  height: 64px;
  display: flex;
  align-items: center;
}
.nav__inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
}
.nav__brand img { display: block; }
.nav__right { display: flex; align-items: center; gap: 0.75rem; margin-left: auto; }
.nav__links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.25rem;
  flex: 1;
}
.nav__links a {
  color: var(--k-text);
  font-size: 0.9rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  transition: background 0.15s;
  font-weight: 500;
}
.nav__links a:hover {
  background: var(--k-sky);
  text-decoration: none;
  color: var(--k-navy);
}

/* ── HERO ─────────────────────────────────────────────── */
.hero {
  background: var(--k-navy);
  position: relative;
  overflow: hidden;
  padding: 80px 0 0;
}
.hero__circle {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: var(--k-yellow);
  pointer-events: none;
}
.hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding-bottom: 3rem;
}
.hero__content { position: relative; z-index: 1; }
.hero__heading {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 4vw, 3rem);
  color: #fff;
  line-height: 1.15;
  margin: 0 0 1.25rem;
}
.hero__sub {
  color: rgba(255,255,255,0.78);
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 2rem;
  max-width: 480px;
}
.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.hero__card-wrap {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

/* Dashboard card mockup */
.dashboard-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--k-shadow);
  width: 100%;
  max-width: 360px;
}
.dashboard-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.dashboard-card__day {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--k-text-muted);
}
.amount-number {
  display: block;
  font-family: 'Inter', sans-serif;
  font-variant-numeric: tabular-nums;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--k-navy);
  line-height: 1;
}
.amount-label {
  font-size: 0.875rem;
  color: var(--k-text-muted);
  display: block;
  margin: 0.25rem 0 1.25rem;
}
.payment-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--k-border);
}
.payment-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--k-border);
  gap: 0.5rem;
}
.payment-name {
  font-size: 0.82rem;
  color: var(--k-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.payment-name strong {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.03em;
}
.payment-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--k-navy);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.625rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge--live {
  background: #dcfce7;
  color: #15803d;
}
.badge--paid {
  background: #dcfce7;
  color: #15803d;
}

/* Hero arcs (book-pages motif) */
.hero__arcs {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-top: 1rem;
  height: 64px;
  position: relative;
}
.hero__arc {
  display: block;
  width: 240px;
  height: 120px;
  border-radius: 120px 120px 0 0;
  position: absolute;
  bottom: 0;
}
.hero__arc--1 {
  background: rgba(1, 96, 211, 0.5);
  left: calc(50% - 220px);
  transform: rotate(-8deg);
  transform-origin: bottom center;
}
.hero__arc--2 {
  background: rgba(1, 96, 211, 0.35);
  left: calc(50% - 40px);
  transform: rotate(8deg);
  transform-origin: bottom center;
}

/* ── PARENTS — Phone mockup ───────────────────────────── */
.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.step {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.step__num {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--k-yellow);
  color: var(--k-navy);
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}
.step h4 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--k-navy);
  margin: 0 0 0.2rem;
}
.step p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--k-text-muted);
  line-height: 1.6;
}

.phone-wrap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
.phone {
  background: #1a1f2e;
  border-radius: 20px;
  padding: 1.25rem;
  width: 280px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
.phone__screen {
  background: #c8d5b9;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}
.ussd {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  color: #2d3a1e;
  margin: 0;
  white-space: pre-wrap;
}
.phone__keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}
.phone__keypad button {
  background: #2a3040;
  border: none;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.6rem;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
}

.sms-thread {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.sms-bubble {
  background: #fff;
  border: 1px solid var(--k-border);
  border-radius: 12px;
  padding: 0.875rem 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.sms-meta {
  font-size: 0.72rem;
  color: var(--k-text-muted);
  font-weight: 600;
  display: block;
  margin-bottom: 0.35rem;
}
.sms-bubble p {
  font-size: 0.8rem;
  color: var(--k-text);
  margin: 0 0 0.5rem;
  line-height: 1.5;
}
.sms-bubble p:last-child { margin-bottom: 0; }

/* ── SECURITY ─────────────────────────────────────────── */
.security-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}
.security-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: var(--k-sky);
  border-radius: var(--k-radius);
  padding: 1.125rem 1.25rem;
}
.security-item__icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--k-blue);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.security-item h4 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--k-navy);
  margin: 0 0 0.2rem;
}
.security-item p {
  font-size: 0.8rem;
  color: var(--k-text-muted);
  margin: 0;
  line-height: 1.5;
}

/* ── PILOT FORM ───────────────────────────────────────── */
.pilot-form {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.form-field { display: flex; flex-direction: column; gap: 0.375rem; }
.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--k-text);
}
.form-input {
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  padding: 0.6875rem 0.875rem;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  color: var(--k-text);
  outline: none;
  transition: border-color 0.15s;
}
.form-input:focus { border-color: var(--k-blue); }
.form-input::placeholder { color: #9ca3af; }

/* ── FAQ ──────────────────────────────────────────────── */
.faq__title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0 0 2rem;
}
.faq {
  border-top: 1px solid var(--k-border);
}
.faq__item {
  border-bottom: 1px solid var(--k-border);
  padding: 0;
}
.faq__item summary {
  padding: 1.125rem 0;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--k-navy);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.faq__item summary::after {
  content: '▶';
  font-size: 0.7rem;
  color: var(--k-text-muted);
  flex-shrink: 0;
  transition: transform 0.2s;
}
.faq__item[open] summary::after {
  transform: rotate(90deg);
}
.faq__item p {
  margin: 0 0 1.25rem;
  font-size: 0.875rem;
  color: var(--k-text-muted);
  line-height: 1.7;
}

/* ── FOOTER ───────────────────────────────────────────── */
.footer {
  background: var(--k-navy-dark);
  padding: 2rem 0;
}
.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.footer__logo {
  filter: brightness(0) invert(1);
  height: 32px;
}
.footer__contact {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.55);
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 768px) {
  .hero__inner { grid-template-columns: 1fr; }
  .hero__card-wrap { display: none; }
  .hero__circle { width: 200px; height: 200px; top: -40px; right: -40px; }
  .split { grid-template-columns: 1fr; gap: 2.5rem; }
  .cards-grid--3 { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .nav__links { display: none; }
  .section { padding: 56px 0; }
}
</style>

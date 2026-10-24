<template>
  <div class="teacher-day">
    <div class="page-header">
      <p class="eyebrow">VENDREDI 15 JANVIER · PÉRIODE 2</p>
      <h1 class="page-title">Bonjour, M. Ngoy</h1>
      <p class="page-sub">Titulaire de 4e Scientifique A</p>
    </div>

    <div class="offline-banner">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
      <span><strong>Hors ligne</strong> · 12 notes enregistrées sur le téléphone. Envoi au retour du réseau.</span>
    </div>

    <div class="courses-section">
      <h2 class="section-title">Mes cours aujourd'hui</h2>

      <div class="courses-list">
        <div v-for="course in courses" :key="course.id" class="course-card" :class="{ 'course-card--done': course.status === 'done' }">
          <div class="course-card__time">{{ course.time }}</div>
          <div class="course-card__body">
            <p class="course-card__name">{{ course.subject }} · {{ course.className }}</p>
            <p class="course-card__sub">{{ course.studentCount }} élèves · {{ course.note }}</p>
          </div>
          <div class="course-card__action">
            <RouterLink v-if="course.status === 'enter'" :to="course.link" class="btn btn--navy btn--sm">
              Saisir les notes
            </RouterLink>
            <RouterLink v-else-if="course.status === 'roll'" :to="course.link" class="btn btn--ghost btn--sm">
              Faire l'appel
            </RouterLink>
            <span v-else class="done-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              À jour
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const courses = [
  {
    id: 'c1',
    time: '07:30 · 08:20',
    subject: 'Mathématiques',
    className: '4e Scientifique A',
    studentCount: 38,
    note: 'Interro 3 à saisir',
    status: 'enter' as const,
    link: '/app/teacher/courses/c7/notes',
  },
  {
    id: 'c2',
    time: '10:10 · 11:00',
    subject: 'Physique',
    className: '3e Scientifique',
    studentCount: 34,
    note: 'Appel à faire',
    status: 'roll' as const,
    link: '/app/teacher/courses/cr2/appel',
  },
  {
    id: 'c3',
    time: '13:00 · 13:50',
    subject: 'Mathématiques',
    className: '2e Scientifique',
    studentCount: 30,
    note: 'Toutes les notes saisies',
    status: 'done' as const,
    link: '',
  },
]
</script>

<style scoped>
.teacher-day {
  padding: 32px;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--k-orange);
  margin: 0 0 6px;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--k-navy);
  margin: 0 0 4px;
}

.page-sub { font-size: 13px; color: #6b7280; margin: 0; }

.offline-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  font-size: 13px;
  color: #92400e;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--k-navy);
  margin: 0 0 14px;
}

.courses-list { display: flex; flex-direction: column; gap: 10px; }

.course-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border: 1.5px solid var(--k-border);
  border-radius: var(--k-radius);
  padding: 16px 20px;
}

.course-card--done { opacity: 0.75; }

.course-card__time {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  width: 96px;
  flex-shrink: 0;
}

.course-card__body { flex: 1; }
.course-card__name { font-weight: 600; font-size: 14px; color: #1a1a2e; margin: 0 0 3px; }
.course-card__sub  { font-size: 13px; color: #6b7280; margin: 0; }

.course-card__action { flex-shrink: 0; }

.done-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #16a34a;
  background: #dcfce7;
  padding: 5px 12px;
  border-radius: 6px;
}
</style>

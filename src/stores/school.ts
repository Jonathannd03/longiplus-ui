import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSetupApi } from '@/api/setup'

export interface Period {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'locked' | 'open' | 'upcoming'
  semester: 1 | 2
  type: 'period' | 'exam'
  closingDate?: string
}

export const useSchoolStore = defineStore('school', () => {
  const school = ref({
    id: 's1',
    name: 'C.S. Mwinda',
    commune: 'Lingwala',
    year: '2026-2027',
    levels: ['maternelle', 'primaire', 'secondaire'],
    agentName: 'Mwinda A.',
    agentPhone: '+243 81 ••• 00 12',
  })

  // onboardingChecked: false until syncOnboardingState() has run at least once.
  // AppLayout waits for this before deciding to redirect to /onboarding.
  const onboardingChecked = ref(false)
  const isOnboardingComplete = ref(false)
  const onboardingStep = ref(1)

  const onboardingSteps = ref([
    { id: 1, label: 'Profil de l\'école',          desc: 'Nom, logo, adresse, niveaux enseignés',                                           done: false },
    { id: 2, label: 'Année, périodes et barème',   desc: 'Dates, nombre de semestres, barème RDC',                                          done: false },
    { id: 3, label: 'Classes et cours',            desc: 'Classes créées · matières et maxima configurés · titulaires désignés',            done: false },
    { id: 4, label: 'Importer les élèves',         desc: 'Depuis votre fichier Excel. Les codes élèves sont créés automatiquement.',        done: false },
    { id: 5, label: 'Inviter les enseignants',     desc: 'Par e-mail, avec leurs cours et leurs classes',                                   done: false },
    { id: 6, label: 'Prévenir les parents',        desc: 'Un SMS avec le code élève et le nom de la classe, après votre accord',           done: false },
  ])

  const periods = ref<Period[]>([
    { id: 'p1', name: 'Période 1', startDate: '7 sept.', endDate: '30 oct.', status: 'locked', semester: 1, type: 'period' },
    { id: 'p2', name: 'Période 2', startDate: '2 nov.', endDate: '22 janv.', status: 'open', semester: 1, type: 'period', closingDate: '22 janv.' },
    { id: 'e1', name: 'Examens du 1er semestre', startDate: '25 janv.', endDate: '5 févr.', status: 'upcoming', semester: 1, type: 'exam' },
    { id: 'p3', name: 'Période 3', startDate: '8 févr.', endDate: '2 avr.', status: 'upcoming', semester: 2, type: 'period' },
    { id: 'p4', name: 'Période 4', startDate: '19 avr.', endDate: '4 juin', status: 'upcoming', semester: 2, type: 'period' },
    { id: 'e2', name: 'Examens du 2nd semestre', startDate: '7 juin', endDate: '18 juin', status: 'upcoming', semester: 2, type: 'exam' },
  ])

  const currentPeriod = ref<Period>(periods.value.find(p => p.status === 'open') ?? periods.value[0]!)

  const gradeScale = ref({
    maxExamMultiplier: 2,
    passingPercent: 50,
    rounding: '1 décimale',
    tieBreak: 'Même rang',
  })

  const conductLabels = ['E · Excellent', 'TB · Très bien', 'B · Bien', 'AB · Assez bien', 'M · Médiocre', 'MA · Mauvais']

  const holidays = ref([
    { name: 'Congés de Noël', dates: '21 déc. au 3 janv.' },
    { name: 'Congés de Pâques', dates: '3 au 18 avr.' },
    { name: 'Jours fériés', dates: 'Selon le calendrier national' },
  ])

  async function syncOnboardingState() {
    const api = useSetupApi()

    try {
      // Step 1: school profile — always done once authenticated
      onboardingSteps.value[0]!.done = true

      // Step 2: academic year exists with periods
      let activeYearId = ''
      try {
        const years = await api.academicYears.list()
        const year = years.find(y => y.status === 'active') ?? years[0]
        if (year) {
          const detail = await api.academicYears.get(year.id)
          onboardingSteps.value[1]!.done = detail.periods.length > 0
          activeYearId = year.id
          // Also update the display label
          school.value.year = year.label
        }
      } catch { /* ignore */ }

      // Step 3: classes with subjects exist
      if (activeYearId) {
        try {
          const sections = await api.classSections.list(activeYearId)
          const hasSubjects = sections.some(s => s.subjects.length > 0)
          onboardingSteps.value[2]!.done = sections.length > 0 && hasSubjects
        } catch { /* ignore */ }
      }

      // Step 4: students imported
      if (activeYearId) {
        try {
          const students = await api.students.list({ yearId: activeYearId })
          onboardingSteps.value[3]!.done = students.length > 0
        } catch { /* ignore */ }
      }

      // Step 5: teachers/staff invited (members beyond the director)
      try {
        const members = await api.members.list()
        const nonDirectorRoles = ['teacher', 'class_teacher', 'bursar', 'secretary', 'owner']
        onboardingSteps.value[4]!.done = members.some(m => nonDirectorRoles.includes(m.role))
      } catch { /* ignore */ }

      // Step 6: parents can be reached — done if students exist with phone numbers
      // Proxy: if step 4 (students) is done, parents have codes and can receive SMS
      onboardingSteps.value[5]!.done = onboardingSteps.value[3]!.done

      // Determine the first incomplete step
      const firstPending = onboardingSteps.value.findIndex(s => !s.done)
      onboardingStep.value = firstPending >= 0 ? firstPending + 1 : 6

      isOnboardingComplete.value = onboardingSteps.value.every(s => s.done)
    } catch { /* ignore — keep defaults */ } finally {
      onboardingChecked.value = true
    }
  }

  return {
    school,
    isOnboardingComplete,
    onboardingChecked,
    onboardingStep,
    onboardingSteps,
    periods,
    currentPeriod,
    gradeScale,
    conductLabels,
    holidays,
    syncOnboardingState,
  }
})

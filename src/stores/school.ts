import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  const isOnboardingComplete = ref(false)
  const onboardingStep = ref(4)

  const onboardingSteps = ref([
    { id: 1, label: 'Profil de l\'école', desc: 'Nom, logo, adresse, niveaux : maternelle, primaire, secondaire', done: true },
    { id: 2, label: 'Année, périodes et barème', desc: '2026-2027 · 2 semestres · 4 périodes et 2 examens · barème RDC', done: true },
    { id: 3, label: 'Classes et cours', desc: '12 classes · maxima par cours · titulaires désignés', done: true },
    { id: 4, label: 'Importer les élèves', desc: 'Depuis votre fichier Excel. Les codes élèves sont créés automatiquement.', done: false },
    { id: 5, label: 'Inviter les enseignants', desc: 'Par numéro de téléphone, avec leurs cours et leurs classes', done: false },
    { id: 6, label: 'Prévenir les parents', desc: 'Un SMS avec le code élève et le nom de la classe, après votre accord', done: false },
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

  return { school, isOnboardingComplete, onboardingStep, onboardingSteps, periods, currentPeriod, gradeScale, conductLabels, holidays }
})

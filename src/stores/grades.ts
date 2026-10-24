import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface GradeRow {
  num: string
  studentId: string
  studentName: string
  math?: number
  phys?: number
  chim?: number
  bio?: number
  fr?: number
  angl?: number
  autres: number
  total?: number
  percent?: number
  rank?: number
  conduct: string
  isProvisional?: boolean
}

export interface CorrectionRequest {
  id: string
  studentId: string
  studentName: string
  studentCode: string
  className: string
  subject: string
  period: string
  oldScore: number
  newScore: number
  maxScore: number
  requestedBy: string
  requestDate: string
  reason: string
  attachment?: string
  status: 'pending' | 'approved' | 'refused'
  oldPercent?: number
  newPercent?: number
  oldRank?: string
  newRank?: string
  processedDate?: string
}

export interface BulletinClass {
  classId: string
  className: string
  teacherName: string
  studentCount: number
  notesPercent: number
  status: 'submitted' | 'published' | 'missing_notes' | 'in_progress'
}

export const useGradesStore = defineStore('grades', () => {
  const currentClass = ref({ id: 'c7', name: '4e Scientifique A', period: 'Période 2', teacherName: 'M. Ngoy', studentCount: 38 })

  const gradeSheet = ref<GradeRow[]>([
    { num: '01', studentId: 's4', studentName: 'AMISI Joseph', math: 31, phys: 22, chim: 14, bio: 13, fr: 14, angl: 12, autres: 38, total: 144, percent: 72.0, rank: 6, conduct: 'B' },
    { num: '02', studentId: 's5', studentName: 'BAHATI Esther', math: 36, phys: 26, chim: 17, bio: 16, fr: 16, angl: 15, autres: 43, total: 169, percent: 84.5, rank: 1, conduct: 'TB' },
    { num: '03', studentId: 's1', studentName: 'KABONGO Grace', math: 33, phys: 21, bio: 14, fr: 15, angl: 9, autres: 40, total: 132, conduct: 'TB', isProvisional: true },
    { num: '04', studentId: 's2', studentName: 'LUKUSA Patrick', math: 17, phys: 15, chim: 10, bio: 11, fr: 11, angl: 10, autres: 29, total: 103, percent: 51.5, rank: 31, conduct: 'AB' },
    { num: '05', studentId: 's6', studentName: 'MBUYI Ruth', math: 28, phys: 20, chim: 13, bio: 15, fr: 17, angl: 14, autres: 41, total: 148, percent: 74.0, rank: 4, conduct: 'TB' },
    { num: '06', studentId: 's7', studentName: 'NGALULA Sophie', math: 25, phys: 18, bio: 12, fr: 14, autres: 36, total: 105, conduct: 'B', isProvisional: true },
    { num: '07', studentId: 's8', studentName: 'TSHIBANDA Joël', math: 22, phys: 16, chim: 11, bio: 12, fr: 13, angl: 11, autres: 33, total: 118, percent: 59.0, rank: 22, conduct: 'B' },
    { num: '08', studentId: 's3', studentName: 'WEMBI Christelle', math: 15, phys: 13, chim: 8, bio: 10, fr: 12, angl: 9, autres: 28, total: 95, percent: 47.5, rank: 35, conduct: 'B' },
  ])

  const missingNotesCount = ref(3)
  const classAverage = ref(64)
  const underHalfCount = ref(4)

  const corrections = ref<CorrectionRequest[]>([
    {
      id: 'cor1', studentId: 's1', studentName: 'KABONGO Mujinga Grace', studentCode: '2041 3378 5',
      className: '4e Scientifique A', subject: 'Anglais', period: 'P1', oldScore: 9, newScore: 12, maxScore: 20,
      requestedBy: 'P. Tshala, enseignant', requestDate: '14 janv. 16:20',
      reason: 'L\'interrogation 2 notée 3/5 a été recopiée 0/5. Copie de l\'élève vérifiée.',
      attachment: 'Photo de la copie · 1 image', status: 'pending',
      oldPercent: 72.5, newPercent: 74.0, oldRank: '5e', newRank: '4e',
    },
    {
      id: 'cor2', studentId: 's4', studentName: 'AMISI Joseph', studentCode: '2041 3241 1',
      className: '4e Scientifique A', subject: 'Physique', period: 'P1', oldScore: 22, newScore: 24, maxScore: 30,
      requestedBy: 'M. Ngoy', requestDate: '13 janv.',
      reason: 'Addition incorrecte lors du calcul du total.', status: 'pending',
    },
    {
      id: 'cor3', studentId: 's6', studentName: 'MBUYI Ruth', studentCode: '2041 3355 0',
      className: '4e Scientifique A', subject: 'Français', period: 'P1', oldScore: 14, newScore: 16, maxScore: 20,
      requestedBy: 'Mme Lumbu', requestDate: '20 nov.',
      reason: '', status: 'approved', processedDate: 'approuvée le 20 nov.',
    },
    {
      id: 'cor4', studentId: 's3', studentName: 'WEMBI Christelle', studentCode: '2041 3418 2',
      className: '4e Scientifique A', subject: 'Chimie', period: 'P1', oldScore: 8, newScore: 14, maxScore: 20,
      requestedBy: 'M. Kabeya', requestDate: '18 nov.',
      reason: '', status: 'refused', processedDate: 'refusée le 18 nov.',
    },
  ])

  const bulletinClasses = ref<BulletinClass[]>([
    { classId: 'c7', className: '4e Scientifique A', teacherName: 'M. Ngoy', studentCount: 38, notesPercent: 100, status: 'submitted' },
    { classId: 'c11', className: '3e Commerciale', teacherName: 'M. Kasongo', studentCount: 35, notesPercent: 100, status: 'submitted' },
    { classId: 'c10', className: '2e Pédagogie', teacherName: 'Mme Banza', studentCount: 31, notesPercent: 100, status: 'published' },
    { classId: 'c6', className: '6e Primaire', teacherName: 'Mme Kalala', studentCount: 42, notesPercent: 88, status: 'missing_notes' },
    { classId: 'c9', className: '1re Scientifique', teacherName: 'M. Ilunga', studentCount: 36, notesPercent: 74, status: 'missing_notes' },
  ])

  function approveCorrection(id: string) {
    const cor = corrections.value.find(c => c.id === id)
    if (cor) {
      cor.status = 'approved'
      cor.processedDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }
  }

  function refuseCorrection(id: string) {
    const cor = corrections.value.find(c => c.id === id)
    if (cor) {
      cor.status = 'refused'
      cor.processedDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    }
  }

  const pendingCorrections = ref(2)

  const endOfYearRows = ref([
    { studentName: 'BAHATI Esther', annualAvg: 83.9, failures: 0, proposal: 'Admise', decision: 'Admise avec distinction' },
    { studentName: 'KABONGO Grace', annualAvg: 73.4, failures: 1, proposal: 'Admise', decision: 'Admise' },
    { studentName: 'LUKUSA Patrick', annualAvg: 50.8, failures: 3, proposal: 'Seconde session', decision: 'Seconde session : Math., Anglais, Chimie' },
    { studentName: 'WEMBI Christelle', annualAvg: 46.2, failures: 5, proposal: 'Double', decision: 'Double la 4e' },
    { studentName: 'MBUYI Ruth', annualAvg: 75.0, failures: 0, proposal: 'Admise', decision: 'Admise' },
  ])

  return { currentClass, gradeSheet, missingNotesCount, classAverage, underHalfCount, corrections, bulletinClasses, pendingCorrections, endOfYearRows, approveCorrection, refuseCorrection }
})

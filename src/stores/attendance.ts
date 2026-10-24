import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AbsenceRecord {
  id: string
  studentId: string
  studentName: string
  classId: string
  className: string
  motif?: string
  motifType: 'unjustified_3day' | 'illness' | 'late' | 'family' | 'unjustified'
  monthCount: number
  consecutiveDays?: number
  smsSent?: boolean
  noPhone?: boolean
  time?: string
}

export interface DayAttendance {
  day: string
  date: string
  percent: number
  isCurrent?: boolean
}

export const useAttendanceStore = defineStore('attendance', () => {
  const today = ref({
    date: 'vendredi 15 janvier',
    time: '07:30',
    present: 387,
    total: 412,
    absents: 25,
    justifiedAbsents: 8,
    classesWithoutRoll: 2,
    classesWithoutRollNames: '3e Commerciale, 1re Primaire',
  })

  const weeklyData = ref<DayAttendance[]>([
    { day: 'lun.', date: '11', percent: 95 },
    { day: 'mar.', date: '12', percent: 93 },
    { day: 'mer.', date: '13', percent: 96 },
    { day: 'jeu.', date: '14', percent: 92 },
    { day: 'ven.', date: '15', percent: 94, isCurrent: true },
  ])

  const todayAbsents = ref<AbsenceRecord[]>([
    { id: 'a1', studentId: 's2', studentName: 'LUKUSA Patrick', classId: 'c7', className: '4e Sc. A', motifType: 'unjustified_3day', monthCount: 4, consecutiveDays: 3, smsSent: true },
    { id: 'a2', studentId: 'sa', studentName: 'MPIANA Sarah', classId: 'c11', className: '3e Com.', motif: 'Malade · mot du parent', motifType: 'illness', monthCount: 1 },
    { id: 'a3', studentId: 'sb', studentName: 'KAYEMBE Jonas', classId: 'c5', className: '5e Primaire', motifType: 'unjustified_3day', monthCount: 5, consecutiveDays: 3, smsSent: true },
    { id: 'a4', studentId: 'sc', studentName: 'NSIMBA Grâce', classId: 'c9', className: '1re Sc.', motif: 'Retard · 08:10', motifType: 'late', monthCount: 2, time: '08:10' },
    { id: 'a5', studentId: 'sd', studentName: 'ILUNGA Sarah', classId: 'c6', className: '6e Primaire', motif: 'Deuil familial', motifType: 'family', monthCount: 2 },
  ])

  const threeDayAbsents = ref([
    { name: 'LUKUSA Patrick', className: '4e Sc. A', smsSent: true },
    { name: 'KAYEMBE Jonas', className: '5e Prim.', smsSent: true },
    { name: 'TSHIMANGA Ruth', className: '2e Péda.', smsSent: false, noPhone: true },
    { name: 'MBALA Eric', className: '3e Prim.', smsSent: true },
  ])

  const smsPreview = ref('LongiPlus : Patrick est absent depuis 3 jours (13, 14 et 15 janv.). Merci de contacter l\'école. C.S. Mwinda')

  return { today, weeklyData, todayAbsents, threeDayAbsents, smsPreview }
})

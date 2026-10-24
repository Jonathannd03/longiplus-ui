import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Student {
  id: string
  code: string
  lastName: string
  postName: string
  firstName: string
  initials: string
  sex: 'M' | 'F'
  birthDate: string
  birthPlace: string
  classId: string
  className: string
  guardianId?: string
  guardianName?: string
  guardianPhone?: string
  guardianPhone2?: string
  attendancePercent: number
  averageP1?: number
  status: 'normal' | 'new' | 'absent_often' | 'no_phone'
  enrolledSince?: number
  isNew?: boolean
}

export interface Guardian {
  id: string
  name: string
  phone: string
  studentIds: string[]
}

export const useStudentsStore = defineStore('students', () => {
  const students = ref<Student[]>([
    { id: 's1', code: '2041 3378 5', lastName: 'KABONGO', postName: 'Mujinga', firstName: 'Grace', initials: 'GK', sex: 'F', birthDate: '12 mars 2011', birthPlace: 'Kinshasa', classId: 'c7', className: '4e Scient. A', guardianId: 'g1', guardianName: 'T. Kabongo', guardianPhone: '+243 81 ••• 56 78', attendancePercent: 96, averageP1: 72.5, status: 'normal', enrolledSince: 2021 },
    { id: 's2', code: '2041 3402 9', lastName: 'LUKUSA', postName: 'Mbaya', firstName: 'Patrick', initials: 'PL', sex: 'M', birthDate: '3 juin 2010', birthPlace: 'Kinshasa', classId: 'c7', className: '4e Scient. A', guardianId: 'g2', guardianName: 'J. Lukusa', guardianPhone: '+243 82 ••• 77 31', attendancePercent: 78, averageP1: 51.5, status: 'absent_often', enrolledSince: 2021 },
    { id: 's3', code: '2041 3418 2', lastName: 'WEMBI', postName: 'Okito', firstName: 'Christelle', initials: 'CW', sex: 'F', birthDate: '7 avr. 2011', birthPlace: 'Kinshasa', classId: 'c7', className: '4e Scient. A', guardianId: 'g3', guardianName: 'L. Wembi', attendancePercent: 91, averageP1: 47.5, status: 'no_phone', enrolledSince: 2022 },
    { id: 's4', code: '2041 3241 1', lastName: 'AMISI', postName: 'Bahati', firstName: 'Joseph', initials: 'JA', sex: 'M', birthDate: '15 jan. 2011', birthPlace: 'Goma', classId: 'c7', className: '4e Scient. A', guardianId: 'g4', guardianName: 'R. Amisi', guardianPhone: '+243 97 ••• 18 40', attendancePercent: 98, averageP1: 72.0, status: 'normal', enrolledSince: 2020 },
    { id: 's5', code: '2041 3247 8', lastName: 'BAHATI', postName: 'Neema', firstName: 'Esther', initials: 'EB', sex: 'F', birthDate: '22 oct. 2010', birthPlace: 'Kinshasa', classId: 'c7', className: '4e Scient. A', guardianId: 'g1', guardianName: 'P. Bahati', guardianPhone: '+243 81 ••• 92 15', attendancePercent: 100, averageP1: 84.5, status: 'normal', enrolledSince: 2020 },
    { id: 's6', code: '2041 3355 0', lastName: 'MBUYI', postName: 'Ngalula', firstName: 'Ruth', initials: 'RM', sex: 'F', birthDate: '5 mai 2011', birthPlace: 'Kinshasa', classId: 'c7', className: '4e Scient. A', guardianId: 'g5', guardianName: 'A. Mbuyi', guardianPhone: '+243 81 ••• 09 88', attendancePercent: 97, averageP1: 74.0, status: 'normal', enrolledSince: 2021 },
    { id: 's7', code: '2041 3360 3', lastName: 'NGALULA', postName: 'Mbombo', firstName: 'Sophie', initials: 'SN', sex: 'F', birthDate: '11 janv. 2011', birthPlace: 'Kinshasa', classId: 'c7', className: '4e Scient. A', guardianId: 'g6', guardianName: 'D. Ngalula', guardianPhone: '+243 85 ••• 61 27', attendancePercent: 94, status: 'new', isNew: true, enrolledSince: 2024 },
    { id: 's8', code: '2041 3429 1', lastName: 'TSHIBANDA', postName: 'Nkulu', firstName: 'Joël', initials: 'TJ', sex: 'M', birthDate: '28 févr. 2010', birthPlace: 'Lubumbashi', classId: 'c7', className: '4e Scient. A', guardianId: 'g7', guardianName: 'K. Tshibanda', guardianPhone: '+243 99 ••• 44 21', attendancePercent: 89, averageP1: 59.0, status: 'normal', enrolledSince: 2022 },
  ])

  const guardians = ref<Guardian[]>([
    { id: 'g1', name: 'KABONGO Mujinga Thérèse', phone: '+243 81 234 5678', studentIds: ['s1', 's5'] },
    { id: 'g2', name: 'LUKUSA Jean', phone: '+243 82 345 6789', studentIds: ['s2'] },
    { id: 'g3', name: 'WEMBI Lucie', phone: '', studentIds: ['s3'] },
    { id: 'g4', name: 'AMISI Robert', phone: '+243 97 456 7890', studentIds: ['s4'] },
    { id: 'g5', name: 'MBUYI Albert', phone: '+243 81 567 8901', studentIds: ['s6'] },
    { id: 'g6', name: 'NGALULA David', phone: '+243 85 678 9012', studentIds: ['s7'] },
    { id: 'g7', name: 'TSHIBANDA Kombe', phone: '+243 99 789 0123', studentIds: ['s8'] },
    { id: 'g8', name: 'KABONGO André', phone: '+243 99 ••• 40 11', studentIds: ['s1'] },
  ])

  const totalStudents = computed(() => 412)
  const totalFamilies = computed(() => 268)
  const totalClasses = computed(() => 12)

  function getStudentById(id: string) {
    return students.value.find(s => s.id === id)
  }

  function getStudentsByClass(classId: string) {
    return students.value.filter(s => s.classId === classId)
  }

  return { students, guardians, totalStudents, totalFamilies, totalClasses, getStudentById, getStudentsByClass }
})

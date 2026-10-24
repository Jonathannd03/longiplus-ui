import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Teacher {
  id: string
  name: string
  initials: string
  shortName: string
  phone: string
  courses: string[]
  classIds: string[]
  hoursPerWeek: number
  status: 'active' | 'pending'
  headOfClassId?: string
}

export interface Course {
  id: string
  classId: string
  name: string
  maxPeriod: number
  maxExam: number
  hoursPerWeek: number
  teacherId?: string
  teacherStatus?: 'active' | 'pending'
}

export interface ClassRoom {
  id: string
  name: string
  level: 'primaire' | 'secondaire'
  option?: string
  headTeacherId?: string
  room?: string
  studentCount: number
  group?: string
}

export const useClassesStore = defineStore('classes', () => {
  const classes = ref<ClassRoom[]>([
    { id: 'c1', name: '1re Primaire', level: 'primaire', studentCount: 31, headTeacherId: 't7' },
    { id: 'c2', name: '2e Primaire', level: 'primaire', studentCount: 34, headTeacherId: 't8' },
    { id: 'c3', name: '3e Primaire', level: 'primaire', studentCount: 28, headTeacherId: 't9', group: '3 classes' },
    { id: 'c4', name: '4e Primaire', level: 'primaire', studentCount: 29, headTeacherId: 't10', group: '3 classes' },
    { id: 'c5', name: '5e Primaire', level: 'primaire', studentCount: 27, headTeacherId: 't11', group: '3 classes' },
    { id: 'c6', name: '6e Primaire', level: 'primaire', studentCount: 42, headTeacherId: 't6' },
    { id: 'c7', name: '4e Scientifique A', level: 'secondaire', option: 'Scientifique', headTeacherId: 't1', room: 'Bloc B · salle 4', studentCount: 38 },
    { id: 'c8', name: '4e Scientifique B', level: 'secondaire', option: 'Scientifique', headTeacherId: 't2', studentCount: 33 },
    { id: 'c9', name: '1re Scientifique', level: 'secondaire', option: 'Scientifique', headTeacherId: 't2', studentCount: 36 },
    { id: 'c10', name: '2e Pédagogie', level: 'secondaire', option: 'Pédagogie', headTeacherId: 't3', studentCount: 31 },
    { id: 'c11', name: '3e Commerciale', level: 'secondaire', option: 'Commerciale', headTeacherId: 't4', studentCount: 35 },
    { id: 'c12', name: '1re Commerciale', level: 'secondaire', option: 'Commerciale', headTeacherId: 't5', studentCount: 35 },
  ])

  const teachers = ref<Teacher[]>([
    { id: 't1', name: 'F. Ngoy', shortName: 'M. F. Ngoy', initials: 'FN', phone: '+243 85 ••• 20 47', courses: ['Mathématiques', 'Physique'], classIds: ['c7', 'c11', 'c9'], hoursPerWeek: 24, status: 'active', headOfClassId: 'c7' },
    { id: 't2', name: 'L. Lumbu', shortName: 'L. Lumbu', initials: 'LL', phone: '+243 81 ••• 11 22', courses: ['Français'], classIds: ['c7', 'c8', 'c9', 'c10', 'c11'], hoursPerWeek: 20, status: 'active', headOfClassId: 'c9' },
    { id: 't3', name: 'P. Tshala', shortName: 'M. Tshala', initials: 'PT', phone: '+243 97 ••• 33 44', courses: ['Anglais'], classIds: ['c7', 'c8', 'c9', 'c10', 'c11', 'c11'], hoursPerWeek: 12, status: 'active' },
    { id: 't4', name: 'C. Mwamba', shortName: 'Mme Mwamba', initials: 'CM', phone: '+243 81 ••• 55 66', courses: ['Biologie'], classIds: ['c7', 'c8', 'c9', 'c10'], hoursPerWeek: 12, status: 'active' },
    { id: 't5', name: 'M. Kabeya', shortName: 'M. Kabeya', initials: 'MK', phone: '+243 99 ••• 77 88', courses: ['Chimie'], classIds: ['c7', 'c8', 'c9'], hoursPerWeek: 9, status: 'pending' },
    { id: 't6', name: 'A. Kalala', shortName: 'Mme Kalala', initials: 'AK', phone: '+243 81 ••• 99 00', courses: ['Toutes les branches'], classIds: ['c6'], hoursPerWeek: 30, status: 'active', headOfClassId: 'c6' },
    { id: 't7', name: 'Mme Mbala', shortName: 'Mme Mbala', initials: 'MM', phone: '+243 82 ••• 11 22', courses: ['Toutes les branches'], classIds: ['c1'], hoursPerWeek: 28, status: 'active', headOfClassId: 'c1' },
    { id: 't8', name: 'M. Banza', shortName: 'M. Banza', initials: 'MB', phone: '+243 99 ••• 33 44', courses: ['Toutes les branches'], classIds: ['c2'], hoursPerWeek: 28, status: 'active', headOfClassId: 'c2' },
    { id: 't9', name: 'Mme Banza', shortName: 'Mme Banza', initials: 'MB2', phone: '+243 81 ••• 55 66', courses: ['Toutes les branches'], classIds: ['c10'], hoursPerWeek: 28, status: 'active', headOfClassId: 'c10' },
    { id: 't10', name: 'M. Kasongo', shortName: 'M. Kasongo', initials: 'MK2', phone: '+243 85 ••• 77 88', courses: ['Toutes les branches'], classIds: ['c11'], hoursPerWeek: 28, status: 'active', headOfClassId: 'c11' },
  ])

  const courses = ref<Course[]>([
    { id: 'cr1', classId: 'c7', name: 'Mathématiques', maxPeriod: 40, maxExam: 80, hoursPerWeek: 7, teacherId: 't1', teacherStatus: 'active' },
    { id: 'cr2', classId: 'c7', name: 'Physique', maxPeriod: 30, maxExam: 60, hoursPerWeek: 4, teacherId: 't1', teacherStatus: 'active' },
    { id: 'cr3', classId: 'c7', name: 'Chimie', maxPeriod: 20, maxExam: 40, hoursPerWeek: 3, teacherId: 't5', teacherStatus: 'pending' },
    { id: 'cr4', classId: 'c7', name: 'Biologie', maxPeriod: 20, maxExam: 40, hoursPerWeek: 3, teacherId: 't4', teacherStatus: 'active' },
    { id: 'cr5', classId: 'c7', name: 'Français', maxPeriod: 20, maxExam: 40, hoursPerWeek: 4, teacherId: 't2', teacherStatus: 'active' },
    { id: 'cr6', classId: 'c7', name: 'Anglais', maxPeriod: 20, maxExam: 40, hoursPerWeek: 2, teacherId: 't3', teacherStatus: 'active' },
  ])

  function getClassById(id: string) {
    return classes.value.find(c => c.id === id)
  }

  function getCoursesByClass(classId: string) {
    return courses.value.filter(c => c.classId === classId)
  }

  function getTeacherById(id: string) {
    return teachers.value.find(t => t.id === id)
  }

  return { classes, teachers, courses, getClassById, getCoursesByClass, getTeacherById }
})

import { createPinia } from 'pinia'

export const pinia = createPinia()

export { useAuthStore } from './auth'
export { useSchoolStore } from './school'
export { useStudentsStore } from './students'
export { useClassesStore } from './classes'
export { useAttendanceStore } from './attendance'
export { useGradesStore } from './grades'
export { useMessagesStore } from './messages'

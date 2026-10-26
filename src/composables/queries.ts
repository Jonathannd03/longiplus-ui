import { computed, type ComputedRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useSetupApi } from '@/api/setup'

const STALE = 5 * 60 * 1000

export function useAcademicYears() {
  const api = useSetupApi()
  return useQuery({
    queryKey: ['academic-years'],
    queryFn: () => api.academicYears.list(),
    staleTime: STALE,
  })
}

export function useAcademicYear(yearId: ComputedRef<string>) {
  const api = useSetupApi()
  return useQuery({
    queryKey: computed(() => ['academic-year', yearId.value]),
    queryFn: () => api.academicYears.get(yearId.value),
    enabled: computed(() => !!yearId.value),
    staleTime: STALE,
  })
}

export function useClassSections(yearId: ComputedRef<string>) {
  const api = useSetupApi()
  return useQuery({
    queryKey: computed(() => ['class-sections', yearId.value]),
    queryFn: () => api.classSections.list(yearId.value),
    enabled: computed(() => !!yearId.value),
    staleTime: STALE,
  })
}

export function useStudents(yearId: ComputedRef<string>) {
  const api = useSetupApi()
  return useQuery({
    queryKey: computed(() => ['students', yearId.value]),
    queryFn: () => api.students.list({ yearId: yearId.value }),
    enabled: computed(() => !!yearId.value),
    staleTime: STALE,
  })
}

export function useDashboard(yearId: ComputedRef<string>) {
  const api = useSetupApi()
  return useQuery({
    queryKey: computed(() => ['dashboard', yearId.value]),
    queryFn: () => api.dashboard.get(yearId.value),
    enabled: computed(() => !!yearId.value),
    staleTime: 60 * 1000,
  })
}

export function useBulletinStatus(yearId: ComputedRef<string>) {
  const api = useSetupApi()
  return useQuery({
    queryKey: computed(() => ['bulletin-status', yearId.value]),
    queryFn: () => api.bulletins.status(yearId.value),
    enabled: computed(() => !!yearId.value),
    staleTime: 2 * 60 * 1000,
  })
}

export function useAttendanceDailyStatus(yearId: ComputedRef<string>) {
  const api = useSetupApi()
  return useQuery({
    queryKey: computed(() => ['attendance-daily', yearId.value]),
    queryFn: () => api.attendance.dailyStatus(yearId.value),
    enabled: computed(() => !!yearId.value),
    staleTime: 60 * 1000,
  })
}

export function useMembers() {
  const api = useSetupApi()
  return useQuery({
    queryKey: ['members'],
    queryFn: () => api.members.list(),
    staleTime: STALE,
  })
}

import { createApiClient, publicFetch } from './http';
import { useAuthStore } from '@/stores/auth';

export interface AcademicYear {
  id: string;
  label: string;
  startsOn: string;
  endsOn: string;
  gradingType: 'primary' | 'secondary';
  status: 'draft' | 'active' | 'closed';
}

export interface Period {
  id: string;
  kind: 'period' | 'exam';
  sequence: number;
  semesterOrTrimester: number;
  label: string;
  status: 'open' | 'closed' | 'locked';
}

export interface AcademicYearDetail extends AcademicYear {
  periods: Period[];
}

export interface ClassSection {
  id: string;
  level: string;
  option?: string;
  name: string;
  classTeacherId?: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  maxPeriod: number;
  maxExam?: number;
  teacherId?: string;
}

export interface Member {
  id: string;
  email: string;
  role: string;
  status: string;
  keycloakUserId: string;
}

export interface StudentListItem {
  id: string;
  studentCode: string;
  lastName: string;
  postName: string;
  firstName: string;
  sex: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  className: string | null;
  createdAt: string;
}

export interface StudentDetail {
  id: string;
  schoolId: string;
  studentCode: string;
  lastName: string;
  postName: string;
  firstName: string;
  sex: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  photoRef?: string;
  importBatchId?: string;
  createdAt: string;
}

export interface GuardianItem {
  id: string;
  fullName: string;
  phoneE164: string;
  relationship: string;
}

export interface EnrollResult {
  id: string;
  studentCode: string;
  duplicate: { id: string; studentCode: string } | null;
}

export interface ImportPreviewRow {
  line: number;
  lastName: string;
  postName: string;
  firstName: string;
  sex: string;
  birthDate: string;
  birthPlace: string;
  guardianPhone: string;
  className: string;
  errors: string[];
  warnings: string[];
}

export interface ImportPreview {
  rows: ImportPreviewRow[];
  stats: { ok: number; warnings: number; errors: number };
}

export interface ImportResult {
  batchId: string;
  inserted: number;
  skipped: number;
}

export interface SiblingItem {
  id: string;
  studentCode: string;
  lastName: string;
  postName: string;
  firstName: string;
  sex: 'M' | 'F';
  className: string | null;
}

export interface AttendanceEntry {
  id: string;
  classSectionId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  recordedBy: string;
  createdAt: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  presenceRate: number | null;
}

export interface AttendanceSheetRow {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface DailyStatusRow {
  classSectionId: string;
  name: string;
  level: string;
  rollDone: boolean;
  present: number;
  absent: number;
  late: number;
  total: number;
}

export interface MarkRow {
  studentId: string;
  score: number | null;
  updatedAt: string;
}

export interface SubjectMarks {
  subject: Subject;
  period: Period;
  maxScore: number;
  marks: MarkRow[];
}

export interface StudentSubjectScore {
  subjectId: string;
  subjectName: string;
  max: number;
  score: number | null;
}

export interface PeriodResultRow {
  student: { id: string; lastName: string; postName: string; firstName: string };
  subjectScores: StudentSubjectScore[];
  total: number;
  totalMax: number;
  pct: number;
  missing: boolean;
  rank: number | null;
}

export interface PeriodResults {
  period: Period;
  subjects: Subject[];
  totalMax: number;
  rows: PeriodResultRow[];
}

export interface StudentMark {
  markId: string;
  score: number | null;
  updatedAt: string;
  subjectId: string;
  periodId: string;
  subjectName: string;
  maxPeriod: number;
  maxExam: number | null;
  periodLabel: string;
  periodKind: 'period' | 'exam';
  periodSeq: number;
}

export interface CorrectionRequest {
  id: string;
  markId: string;
  requestedBy: string;
  reason: string;
  newScore: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
  currentScore: number | null;
  subjectName: string;
  periodId: string;
  periodLabel: string;
  studentLastName: string;
  studentFirstName: string;
}

export interface PayoutAccount {
  id: string;
  kind: 'mobile_money' | 'bank';
  operator?: string;
  numberMasked: string;
  status: 'pending' | 'active' | 'suspended';
  approvedBy?: string;
  approvedAt?: string;
  activatesAt?: string;
}

export interface DashboardData {
  studentCount: number;
  presentToday: number;
  missingRollCount: number;
  pendingCorrections: number;
  pendingInvites: number;
  marksPercent: number;
  marksFilled: number;
  marksTotal: number;
  activePeriod: { id: string; label: string; status: string } | null;
}

export interface Announcement {
  id: string;
  authorId: string;
  message: string;
  audience: 'all' | 'section';
  classSectionId: string | null;
  sentAt: string | null;
  recipientCount: number;
  createdAt: string;
}

export interface BulletinSectionStatus {
  id: string;
  name: string;
  notesPercent: number;
  status: 'missing_notes' | 'in_progress' | 'ready' | 'published';
  bulletinCount: number;
  periodId: string;
}

export interface RegisterApplyDto {
  schoolName: string;
  province: string;
  city: string;
  address?: string;
  directorName: string;
  directorPhone: string;
  email?: string;
  estimatedStudents?: number;
}

export function useSetupApi() {
  const authStore = useAuthStore();
  const api = createApiClient(authStore);

  return {
    school: {
      get: () => api<Record<string, unknown>>('/school'),
      update: (dto: Record<string, unknown>) =>
        api<Record<string, unknown>>('/school', { method: 'PATCH', body: JSON.stringify(dto) }),
    },

    academicYears: {
      list: () => api<AcademicYear[]>('/academic-years'),
      create: (dto: { label: string; startsOn: string; endsOn: string; gradingType: 'primary' | 'secondary' }) =>
        api<AcademicYear>('/academic-years', { method: 'POST', body: JSON.stringify(dto) }),
      get: (id: string) => api<AcademicYearDetail>(`/academic-years/${id}`),
      periods: (yearId: string) => api<Period[]>(`/academic-years/${yearId}/periods`),
    },

    periods: {
      close: (id: string) => api<Period>(`/periods/${id}/close`, { method: 'PATCH' }),
      lock: (id: string) => api<Period>(`/periods/${id}/lock`, { method: 'PATCH' }),
    },

    classSections: {
      list: (yearId: string) => api<ClassSection[]>(`/academic-years/${yearId}/class-sections`),
      create: (yearId: string, dto: { level: string; option?: string; name: string; classTeacherId?: string }) =>
        api<ClassSection>(`/academic-years/${yearId}/class-sections`, { method: 'POST', body: JSON.stringify(dto) }),
    },

    subjects: {
      create: (sectionId: string, dto: { name: string; maxPeriod?: number; maxExam?: number; teacherId?: string }) =>
        api<Subject>(`/class-sections/${sectionId}/subjects`, { method: 'POST', body: JSON.stringify(dto) }),
      update: (id: string, dto: { name?: string; maxPeriod?: number; maxExam?: number; teacherId?: string }) =>
        api<Subject>(`/subjects/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    },

    members: {
      list: () => api<Member[]>('/memberships'),
      invite: (dto: { email: string; role: string }) =>
        api<Member>('/memberships/invite', { method: 'POST', body: JSON.stringify(dto) }),
      phoneInvite: (dto: { phone: string; role: 'teacher' | 'class_teacher' | 'secretary' }) =>
        api<{ id: string }>('/memberships/phone-invite', { method: 'POST', body: JSON.stringify(dto) }),
    },

    students: {
      list: (opts: { q?: string; classSectionId?: string; yearId?: string } = {}) => {
        const p = new URLSearchParams();
        if (opts.q) p.set('q', opts.q);
        if (opts.classSectionId) p.set('classSectionId', opts.classSectionId);
        if (opts.yearId) p.set('yearId', opts.yearId);
        const qs = p.toString();
        return api<StudentListItem[]>(`/students${qs ? '?' + qs : ''}`);
      },
      get: (id: string) => api<StudentDetail>(`/students/${id}`),
      enroll: (dto: {
        lastName: string; postName: string; firstName: string;
        sex: 'M' | 'F'; birthDate: string; birthPlace: string;
        classSectionId: string; yearId: string;
        guardianPhone?: string; guardianName?: string;
      }) => api<EnrollResult>('/students', { method: 'POST', body: JSON.stringify(dto) }),
      update: (id: string, dto: Partial<{ lastName: string; postName: string; firstName: string; sex: 'M' | 'F'; birthDate: string; birthPlace: string }>) =>
        api<StudentDetail>(`/students/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
      siblings: (id: string) => api<SiblingItem[]>(`/students/${id}/siblings`),
      guardians: (id: string) => api<GuardianItem[]>(`/students/${id}/guardians`),
      addGuardian: (id: string, dto: { phoneE164: string; fullName?: string; relationship?: string }) =>
        api<GuardianItem>(`/students/${id}/guardians`, { method: 'POST', body: JSON.stringify(dto) }),
      attendance: {
        list: (id: string) => api<AttendanceEntry[]>(`/students/${id}/attendance`),
        stats: (id: string) => api<AttendanceStats>(`/students/${id}/attendance/stats`),
      },
      import: {
        preview: (yearId: string, file: File) => {
          const form = new FormData();
          form.append('file', file);
          return api<ImportPreview>(`/students/import/preview?yearId=${encodeURIComponent(yearId)}`, { method: 'POST', body: form });
        },
        commit: (yearId: string, file: File) => {
          const form = new FormData();
          form.append('file', file);
          return api<ImportResult>(`/students/import/commit?yearId=${encodeURIComponent(yearId)}`, { method: 'POST', body: form });
        },
        undo: (batchId: string) =>
          api<{ deleted: number }>(`/students/import/${batchId}`, { method: 'DELETE' }),
      },
    },

    attendance: {
      record: (dto: { classSectionId: string; date: string; records: Array<{ studentId: string; status: 'present' | 'absent' | 'late' | 'excused' }> }) =>
        api<number>('/attendance', { method: 'POST', body: JSON.stringify(dto) }),
      sheet: (classSectionId: string, date: string) =>
        api<AttendanceSheetRow[]>(`/attendance?classSectionId=${encodeURIComponent(classSectionId)}&date=${encodeURIComponent(date)}`),
      dailyStatus: (yearId: string, date?: string) => {
        const qs = date ? `yearId=${encodeURIComponent(yearId)}&date=${encodeURIComponent(date)}` : `yearId=${encodeURIComponent(yearId)}`;
        return api<DailyStatusRow[]>(`/attendance/daily-status?${qs}`);
      },
    },

    marks: {
      listBySubject: (subjectId: string, periodId: string) =>
        api<SubjectMarks>(`/subjects/${subjectId}/marks?periodId=${encodeURIComponent(periodId)}`),
      batchSave: (subjectId: string, dto: { periodId: string; records: Array<{ studentId: string; score: number | null }> }) =>
        api<MarkRow[]>(`/subjects/${subjectId}/marks/batch`, { method: 'PUT', body: JSON.stringify(dto) }),
      results: (classSectionId: string, periodId: string) =>
        api<PeriodResults>(`/class-sections/${classSectionId}/results?periodId=${encodeURIComponent(periodId)}`),
      byStudent: (studentId: string, yearId: string) =>
        api<StudentMark[]>(`/students/${studentId}/marks?yearId=${encodeURIComponent(yearId)}`),
    },

    corrections: {
      list: (filters: { status?: string; classSectionId?: string } = {}) => {
        const p = new URLSearchParams();
        if (filters.status) p.set('status', filters.status);
        if (filters.classSectionId) p.set('classSectionId', filters.classSectionId);
        const qs = p.toString();
        return api<CorrectionRequest[]>(`/corrections${qs ? '?' + qs : ''}`);
      },
      create: (dto: { markId: string; reason: string; newScore: number }) =>
        api<CorrectionRequest>('/corrections', { method: 'POST', body: JSON.stringify(dto) }),
      approve: (id: string) =>
        api<{ id: string; status: string }>(`/corrections/${id}/approve`, { method: 'PATCH' }),
      reject: (id: string, note: string) =>
        api<{ id: string; status: string }>(`/corrections/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ note }) }),
    },

    enrollments: {
      reenroll: (dto: { fromYearId: string; toYearId: string; decisions: Array<{ studentId: string; toSectionId: string | null }> }) =>
        api<{ reEnrolled: number; withdrawn: number }>('/enrollments/reenroll', { method: 'POST', body: JSON.stringify(dto) }),
      withdraw: (studentId: string, reason: string) =>
        api<{ id: string; status: string }>(`/students/${studentId}/withdraw`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
    },

    announcements: {
      list: () => api<Announcement[]>('/announcements'),
      send: (dto: { message: string; audience: 'all' | 'section'; classSectionId?: string; yearId: string }) =>
        api<Announcement>('/announcements', { method: 'POST', body: JSON.stringify(dto) }),
    },

    dashboard: {
      get: (yearId: string) => api<DashboardData>(`/dashboard?yearId=${encodeURIComponent(yearId)}`),
    },

    reports: {
      studentsCSV: (yearId: string) => `/reports/students.csv?yearId=${encodeURIComponent(yearId)}`,
      attendanceCSV: (yearId: string) => `/reports/attendance.csv?yearId=${encodeURIComponent(yearId)}`,
      marksCSV: (periodId: string) => `/reports/marks.csv?periodId=${encodeURIComponent(periodId)}`,
    },

    bulletins: {
      status: (yearId: string) => api<BulletinSectionStatus[]>(`/bulletins/status?yearId=${encodeURIComponent(yearId)}`),
      generate: (dto: { classSectionId: string; periodId: string; yearId: string }) =>
        api<{ generated: number }>('/bulletins/generate', { method: 'POST', body: JSON.stringify(dto) }),
    },

    payoutAccounts: {
      list: () => api<PayoutAccount[]>('/payout-accounts'),
      create: (dto: { kind: 'mobile_money' | 'bank'; operator?: string; numberMasked: string }) =>
        api<PayoutAccount>('/payout-accounts', { method: 'POST', body: JSON.stringify(dto) }),
      approve: (id: string) =>
        api<PayoutAccount>(`/payout-accounts/${id}/approve`, { method: 'POST' }),
    },
  };
}

export const publicApi = {
  register: {
    apply: (dto: RegisterApplyDto) =>
      publicFetch<{ id: string; status: string }>('/register', { method: 'POST', body: JSON.stringify(dto) }),
  },
  memberships: {
    verifyInvite: (dto: { phone: string; code: string }) =>
      publicFetch<{ id: string; role: string; schoolId: string; status: string }>(
        '/memberships/verify-invite',
        { method: 'POST', body: JSON.stringify(dto) },
      ),
  },
};

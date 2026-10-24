import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/pages/LandingPage.vue') },
    { path: '/login', component: () => import('@/pages/LoginPage.vue') },
    { path: '/register', component: () => import('@/pages/RegisterPage.vue') },
    { path: '/console', component: () => import('@/pages/ConsolePage.vue') },
    { path: '/login/code', component: () => import('@/pages/SmsCodePage.vue') },
    { path: '/forgot-password', component: () => import('@/pages/ForgotPasswordPage.vue') },
    {
      path: '/app',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/app/dashboard' },
        { path: 'dashboard', component: () => import('@/pages/app/DashboardPage.vue') },
        { path: 'onboarding', component: () => import('@/pages/app/OnboardingPage.vue') },
        { path: 'onboarding/profile', component: () => import('@/pages/app/onboarding/ProfileStepPage.vue') },
        { path: 'onboarding/year', component: () => import('@/pages/app/onboarding/YearStepPage.vue') },
        { path: 'onboarding/teachers', component: () => import('@/pages/app/onboarding/TeachersStepPage.vue') },
        { path: 'onboarding/parents', component: () => import('@/pages/app/onboarding/ParentsStepPage.vue') },
        { path: 'students', component: () => import('@/pages/app/StudentsListPage.vue') },
        { path: 'students/new', component: () => import('@/pages/app/EnrollStudentPage.vue') },
        { path: 'students/import', component: () => import('@/pages/app/ImportStudentsPage.vue') },
        { path: 'students/:id', component: () => import('@/pages/app/StudentProfilePage.vue') },
        { path: 'classes', component: () => import('@/pages/app/ClassesPage.vue') },
        { path: 'classes/:id/list', component: () => import('@/pages/app/PrintableListPage.vue') },
        { path: 'attendance', component: () => import('@/pages/app/AttendancePage.vue') },
        { path: 'grades', component: () => import('@/pages/app/GradesPage.vue') },
        { path: 'grades/corrections', component: () => import('@/pages/app/CorrectionsPage.vue') },
        { path: 'bulletins', component: () => import('@/pages/app/BulletinsPage.vue') },
        { path: 'messages', component: () => import('@/pages/app/MessagesPage.vue') },
        { path: 'reports', component: () => import('@/pages/app/ReportsPage.vue') },
        { path: 'settings', component: () => import('@/pages/app/SettingsPage.vue') },
        { path: 'settings/year', component: () => import('@/pages/app/onboarding/YearStepPage.vue') },
        { path: 'end-of-year', component: () => import('@/pages/app/EndOfYearPage.vue') },
        { path: 'teacher/day', component: () => import('@/pages/app/TeacherDayPage.vue') },
        { path: 'teacher/courses/:id/appel', component: () => import('@/pages/app/RollCallPage.vue') },
        { path: 'grades/review', component: () => import('@/pages/app/ClassReviewPage.vue') },
        { path: 'teacher/courses/:id/notes', component: () => import('@/pages/app/TeacherGradesPage.vue') },
        { path: ':pathMatch(.*)*', component: () => import('@/pages/app/NotFoundPage.vue') },
      ],
    },
    { path: '/b/:token', component: () => import('@/pages/BulletinPublicPage.vue') },
    { path: '/activate/:token', component: () => import('@/pages/ActivationPage.vue') },
  ],
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta['requiresAuth'] && !auth.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && auth.isAuthenticated) {
    next('/app/dashboard');
  } else {
    next();
  }
});

export default router;

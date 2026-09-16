import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth routes (no sidebar)
    {
      path: '/login',
      component: AuthLayout,
      children: [
        { path: '', name: 'login', component: () => import('@/views/LoginView.vue') },
      ],
    },
    {
      path: '/signup',
      component: AuthLayout,
      children: [
        { path: '', name: 'signup', component: () => import('@/views/SignupView.vue') },
      ],
    },
    // Main routes (with sidebar + header)
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', redirect: '/sermons' },
        { path: 'sermons', name: 'sermonList', component: () => import('@/views/SermonListView.vue') },
        { path: 'sermons/:id', name: 'sermonDetail', component: () => import('@/views/SermonDetailView.vue') },
        { path: 'qts', name: 'qtList', component: () => import('@/views/QtListView.vue') },
        { path: 'qts/:id', name: 'qtDetail', component: () => import('@/views/QtDetailView.vue') },
        { path: 'pbs', name: 'pbsList', component: () => import('@/views/PbsListView.vue') },
        { path: 'pbs/:id', name: 'pbsDetail', component: () => import('@/views/PbsDetailView.vue') },
        { path: 'readings', name: 'readingList', component: () => import('@/views/ReadingListView.vue') },
        { path: 'readings/:id', name: 'readingDetail', component: () => import('@/views/ReadingDetailView.vue') },
        // System routes
        { path: 'system/users', name: 'systemUsers', component: () => import('@/views/system/UserListView.vue') },
        { path: 'system/menus', name: 'systemMenus', component: () => import('@/views/system/MenuListView.vue') },
        { path: 'system/permissions', name: 'systemPermissions', component: () => import('@/views/system/PermissionListView.vue') },
        { path: 'system/common-codes', name: 'systemCommonCodes', component: () => import('@/views/system/CommonCodeView.vue') },
      ],
    },
  ],
})

export default router
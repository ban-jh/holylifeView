import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue'),
    },
    {
      path: '/sermons',
      name: 'sermonList',
      component: () => import('@/views/SermonListView.vue'),
    },
    {
      path: '/sermons/:id',
      name: 'sermonDetail',
      component: () => import('@/views/SermonDetailView.vue'),
    },
    {
      path: '/qts',
      name: 'qtList',
      component: () => import('@/views/QtListView.vue'),
    },
    {
      path: '/qts/:id',
      name: 'qtDetail',
      component: () => import('@/views/QtDetailView.vue'),
    },
    {
      path: '/pbs',
      name: 'pbsList',
      component: () => import('@/views/PbsListView.vue'),
    },
    {
      path: '/pbs/:id',
      name: 'pbsDetail',
      component: () => import('@/views/PbsDetailView.vue'),
    },
    {
      path: '/readings',
      name: 'readingList',
      component: () => import('@/views/ReadingListView.vue'),
    },
    {
      path: '/readings/:id',
      name: 'readingDetail',
      component: () => import('@/views/ReadingDetailView.vue'),
    },
  ],
})

export default router
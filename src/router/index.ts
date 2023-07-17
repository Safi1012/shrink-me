import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/privacy',
      name: 'privacy',
      // route level code-splitting
      // this generates a separate chunk (Privacy.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/PrivacyView.vue')
    },
    {
      path: '/legal',
      name: 'legal',
      component: () => import('@/views/LegalView.vue')
    },
    {
      path: '/credits',
      name: 'credits',
      component: () => import('@/views/CreditsView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue')
    }
  ]
})

export default router

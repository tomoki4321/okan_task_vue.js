import { createRouter, createWebHistory } from 'vue-router'
import LoginVue from '@/views/login/Login.vue'
import SinupVue from '@/views/login/Sinup.vue'
import AppTop from '@/views/AppTop.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'top',
      component: AppTop
    },
    {
      path: '/login',
      name: 'login',
      component: LoginVue
    },
    {
      path: '/sinup',
      name: 'sinup',
      component: SinupVue
    }
  ]
})

export default router

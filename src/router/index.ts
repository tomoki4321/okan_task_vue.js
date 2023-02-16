import { createRouter, createWebHistory } from 'vue-router'
import LoginVue from '@/views/login/Login.vue'
import SinupVue from '@/views/login/Sinup.vue'
import AppTop from '@/views/AppTop.vue'
import PostTodoVue from '@/views/todo/PostTodo.vue'
import ListTodo from '@/views/todo/ListTodo.vue'
import DetailTodoVue from '@/views/todo/DetailTodo.vue'
import EditTodoVue from '@/views/todo/EditTodo.vue'


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
    },
    {
      path: '/todo/post',
      name: 'post',
      component: PostTodoVue
    },
    {
      path: '/todo/index',
      name: 'index',
      component: ListTodo
    },
    {
      path: '/todo/:id',
      name: 'show',
      component:()=>{
        return import("../views/todo/DetailTodo.vue");
      },
      props: (routes) => {
        const idNum = Number(routes.params.id);
        return {
          id: idNum,
        };
      },
    },
    {
      path: '/todo/edit/:id',
      name: 'edit',
      component:()=>{
        return import("../views/todo/EditTodo.vue");
      },
      props: (routes) => {
        const idNum = Number(routes.params.id);
        return {
          id: idNum,
        };
      },
    },
  ]
})

export default router

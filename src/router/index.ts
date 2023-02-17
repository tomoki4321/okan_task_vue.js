import { createRouter, createWebHistory } from 'vue-router'
import LoginVue from '@/views/login/Login.vue'
import SinupVue from '@/views/login/Sinup.vue'
import AppTop from '@/views/AppTop.vue'
import PostTodoVue from '@/views/todo/PostTodo.vue'
import ListTodo from '@/views/todo/ListTodo.vue'
import DetailTodo from '@/views/todo/DetailTodo.vue'
import EditTodo from '@/views/todo/EditTodo.vue'
import ListUser from '@/views/user/ListUser.vue'
import EditUser from '@/views/user/EditUser.vue'
import NotFound from '@/views/error/NotFound.vue'
import { useAuthStore } from '@/stores/auth'



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
    {
      path: '/user/index',
      name: "user_index",
      component: ListUser
    },
    {
      path: "/user/edit/:id",
      name: "user_edit",
      component: () => {
        return import("../views/user/EditUser.vue");
      },
      props: (routes) => {
        const idNum = Number(routes.params.id);
        return {
          id: idNum,
        };
      },
    },
    {
      path: "/:pathMathch(.*)*",
      name: "404NotFound",
      component: NotFound
    },
  ]
});

//ログインしていない状態でタスク投稿に飛ぶとログイン画面に戻される
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "post" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});
//ログインしていない状態でタスク一覧に飛ぶとログイン画面に戻される
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "index" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});
//ログインしていない状態でタスク詳細に飛ぶとログイン画面に戻される
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "show" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});
//ログインしていない状態でタスク編集に飛ぶとログイン画面に戻される
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "edit" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});
//ログインしていない状態でユーザー一覧に飛ぶとログイン画面に戻される
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "user_index" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});
//ログインしていない状態でユーザー編集に飛ぶとログイン画面に戻される
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "user_edit" && !authStore.isAuthencated())
    next({ name: "login" });
  else next();
});
//ログインしている状態でトップに飛ぶとタスク一覧に戻される
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "top" && authStore.isAuthencated())
    next({ name: "index" });
  else next();
});
//ログインしている状態でログイン画面に飛ぶとタスク一覧に戻される
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "login" && authStore.isAuthencated())
    next({ name: "index" });
  else next();
});
//ログインしている状態で新規登録画面に飛ぶとタスク一覧に戻される
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "sinup" && authStore.isAuthencated())
    next({ name: "index" });
  else next();
});
//ユーザー管理画面には管理者しか入れない
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "user_index" && !authStore.isAdmin())
    next({ name: "index" });
  else next();
});
//ユーザー編集画面には管理者しか入れない
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name == "user_edit" && !authStore.isAdmin())
    next({ name: "index" });
  else next();
});

export default router

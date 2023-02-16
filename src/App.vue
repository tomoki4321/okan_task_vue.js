<script setup lang="ts">
import { RouterLink,RouterView,useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useFlashMessageStore } from "@/stores/flash-message";

const messageStore = useFlashMessageStore();

const authStore=useAuthStore();
const router = useRouter();
const onLogout = (): void => {
  const authStore = useAuthStore();
  authStore.logout();
  localStorage.removeItem("access-token");
  localStorage.removeItem("uid");
  localStorage.removeItem("client");
  router.push({ name: "top" });
  messageStore.flash("ログアウトしました！");
};

// !authStore.isAuthencated()

</script>


<template>
  <header>
    <nav>
      <ul>
        <template v-if="authStore.client == null">
          <li><RouterLink to="/sinup">新規登録</RouterLink></li>
          <li><RouterLink to="/login">ログイン</RouterLink></li>
          <li><RouterLink to="/">TOP</RouterLink></li>
        </template>
        <template v-else>
          <li><RouterLink to="/todo/post">新規タスク作成</RouterLink></li>
          <li><RouterLink to="/todo/index">タスク一覧</RouterLink></li>
          <li><a href="" @click="onLogout">ログアウト</a></li>
        </template>
      </ul>
    </nav>
  </header>
  <main>
    {{ messageStore.text }}
    <RouterView/>
  </main>
</template>



<style>
header {
  background-color: purple;
  max-height: 100%;
  width: 100%;
  height:100px;
}

nav ul {
  margin: 0;
  padding: 0;
}

nav ul li {
  list-style: none;
}

*{
  margin:0;
}
</style>
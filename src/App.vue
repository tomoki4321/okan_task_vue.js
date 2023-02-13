<script setup lang="ts">
import { RouterLink,RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth';

const authStore=useAuthStore();
const onLogout = (): void => {
  const authStore = useAuthStore();
  authStore.logout();
  localStorage.removeItem("access-token");
  localStorage.removeItem("uid");
  localStorage.removeItem("client");
};

</script>


<template>
  <header>
    <nav>
      <ul>
        <template v-if="!authStore.isAuthencated()">
          <li><RouterLink to="/sinup">新規登録</RouterLink></li>
          <li><RouterLink to="/login">ログイン</RouterLink></li>
          <li><RouterLink to="/">TOP</RouterLink></li>
        </template>
        <template v-else>
          <li>テスト</li>
          <li><li><a href="" @click="onLogout">ログアウト</a></li></li>
        </template>
      </ul>
    </nav>
  </header>
  <main>
    <RouterView/>
  </main>
</template>



<style>

header {
  background-color: purple;
  max-height: 100%;
  height:100px;
}

nav ul {
  margin: 0;
  padding: 0;
}

nav ul li {
  list-style: none;
  
  
}
</style>
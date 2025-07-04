<script setup lang="ts">
import { RouterLink,RouterView,useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useFlashMessageStore } from "@/stores/flash-message";
import IST from "@/assets/IST.png";


const messageStore = useFlashMessageStore();

const authStore=useAuthStore();
const router = useRouter();
const onLogout = (): void => {
  const authStore = useAuthStore();
  authStore.logout();
  localStorage.removeItem("access-token");
  localStorage.removeItem("uid");
  localStorage.removeItem("client");
  localStorage.removeItem("admin");
  router.push({ name: "top" });
  messageStore.flash("ログアウトしました！");
};


// !authStore.isAuthencated()

</script>


<template>
    <v-app>
      <header>
    <ul class="title">
      <h1>IST</h1>
      <!-- <v-img :src="IST" height="60px"></v-img> -->
    </ul>
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
        <li v-if="authStore.admin !== null"><RouterLink to="/user/index">ユーザー一覧</RouterLink></li>
      </template>
    </ul>
  </header>
  <v-main>
    {{ messageStore.text }}
    <RouterView/>
  </v-main>
      <v-footer class="footer" >
        <v-row justify="center">
          <v-col class="text-center" cols="12">
            <p>
              &copy; 2023 IST
            </p>
          </v-col>
        </v-row>
      </v-footer>
    </v-app>
</template>



<style scoped>

.title{
  float:left;
  padding-left:20px;
}

header {
  background-color: #47b0dc;
  max-height: 100%;
  width: 100%;
  height:50px;
  top:0;
}
.footer {
  background-color: aqua;
  width: 100%;
  max-height:80px;
  bottom: 0;
}


ul {
  margin: 0;
  padding: 0;
  float:right;
}

ul li {
  list-style: none;
  float:left;
  padding: 20px;
}
main{
  
}


*{
  margin:0;
}
</style>
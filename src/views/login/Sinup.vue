<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const user = reactive({
  name:"",
  email: "",
  password: "",
  password_confirmation: ""
});

const onSignup = (): void => {
  const authStore = useAuthStore();
  const name = user.name;
  const email = user.email;
  const password = user.password;
  const password_confirmation = user.password_confirmation;
  authStore.signup(name,email, password, password_confirmation);
};
</script>


<template>
  <div>
    <div>
      <label for="name"> 名前 </label>
      <input v-model="user.name" id="name" type="text"/>
    </div>
    <div>
      <label for="email"> メールアドレス </label>
      <input v-model="user.email" id="email" type="text"/>
    </div>
    <div>
      <label for="password"> パスワード</label>
      <input v-model="user.password" id="password" type="password" placeholder="******************"/>
    </div>
    <div>
      <label for="password_confirmation"> 確認用パスワード </label>
      <input v-model="user.password_confirmation" id="password_confirmation" type="password" placeholder="******************"/>
    </div>
    <button v-on:click="onSignup">新規登録</button>
  </div>
</template>

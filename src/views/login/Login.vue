<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const user = reactive({
  email: "",
  password: "",
});

const onLogin = (): void => {
  const authStore = useAuthStore();
  const email = user.email;
  const password = user.password;
  authStore.login(email, password);
};
</script>
<template>
  <div>
    <div>
      <label for="email"> Email </label>
      <input v-model="user.email" id="Email" type="text" placeholder="Email" />
    </div>
    <div>
      <label for="password"> Password </label>
      <input
        v-model="user.password"
        id="password"
        type="password"
        placeholder="******************"
      />
    </div>
    <button v-on:click="onLogin">ログイン</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { emailRules,passwordRules } from "@/stores/validationRules";


const authStore = useAuthStore();

const user = reactive({
  email: "",
  password: "",
});

//バリデーション
const form = ref();

const onLogin = async (): Promise<void> => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  const authStore = useAuthStore();
  const email = user.email;
  const password = user.password;
  authStore.login(email, password);
};
const guestLogin = (): void => {
  authStore.guest_login();
};
const adminLogin = (): void => {
  authStore.admin_login();
};
</script>
<template>
  <div class="login">
      <v-card class="mx-auto mt-5" width="800px">
      <v-card-title>
        <h1>ログイン</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field label="メールアドレス" v-model="user.email" :rules="emailRules"/>
          <v-text-field label="パスワード" v-model="user.password" :rules="passwordRules" placeholder="******************"/>
          <v-row class="justify-center mb-3 mt-3">
            <v-btn v-on:click="onLogin" class="mr-4" color="secondary">ログイン</v-btn>
            <v-btn @click="guestLogin" class="mr-4" color="secondary">ゲストログイン</v-btn>
            <v-btn @click="adminLogin" color="secondary">管理者ログイン</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>


<style scoped>
.login{
  margin:auto;
  padding-top:80px;
}
h1{
  text-align: center;
  padding-bottom: 20px;
}
</style>
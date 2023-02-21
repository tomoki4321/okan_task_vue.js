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
  <div class="sinup">
      <v-card class="mx-auto mt-5" width="800px">
      <v-card-title>
        <h1>新規登録</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="名前" v-model="user.name"/>
          <v-text-field label="メールアドレス" v-model="user.email"/>
          <v-text-field label="パスワード" v-model="user.password" placeholder="******************"/>
          <v-text-field label="確認パスワード" v-model="user.password_confirmation" placeholder="******************"/>
          <v-row class="justify-center mb-3">
            <v-btn @click="onSignup" class="mr-4" color="secondary">新規登録</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>


<style scoped>
.sinup{
  margin:auto;
  padding-top:80px;
}
h1{
  text-align: center;
  padding-bottom: 20px;
}
</style>
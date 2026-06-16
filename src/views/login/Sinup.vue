<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { emailRules,passwordRules } from "@/stores/validationRules";

const authStore = useAuthStore();

const user = reactive({
  name:"",
  email: "",
  password: "",
  password_confirmation: ""
});

//バリデーション
const form = ref();

const userNameRules = [
  (v: string) => !!v || "名前を入力してください",
];

const passwordConfirmationRules = [
  (v: string) => !!v || "確認用パスワードを入力してください",
  (v: string) => v === user.password || "パスワードが一致しません",
];

const onSignup = async (): Promise<void> => {
  const { valid } = await form.value.validate();
  if (!valid) return;

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
        <v-form ref="form">
          <v-text-field label="名前" v-model="user.name" :rules="userNameRules"/>
          <v-text-field label="メールアドレス" v-model="user.email" :rules="emailRules"/>
          <v-text-field label="パスワード" v-model="user.password" :rules="passwordRules" type="password" placeholder="******************"/>
          <v-text-field label="確認パスワード" v-model="user.password_confirmation" :rules="passwordConfirmationRules" type="password" placeholder="******************"/>
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
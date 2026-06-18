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

// パスワードの表示・非表示
const showPassword = ref(false);
const showConfirm = ref(false);

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
  <div style="max-width: 480px; margin: 0 auto; padding: 32px 16px;">
    <v-card rounded="xl" variant="outlined" class="pa-2">
      <v-card-title>
        <div style="display: flex; align-items: center; gap: 16px; padding-top: 12px;">
          <v-avatar rounded="lg" color="blue-lighten-4" size="40" style="flex-shrink: 0;">
            <v-icon icon="mdi-account-plus" color="blue-darken-2" />
          </v-avatar>
          <div>
            <div class="text-h6">新規登録</div>
            <div class="text-body-2 text-medium-emphasis">アカウントを作成します</div>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form">
          <!-- 名前 -->
          <v-text-field
            v-model="user.name"
            :rules="userNameRules"
            label="名前"
            placeholder="例：山田太郎"
            variant="outlined"
            :rounded="'xl'"
            class="mb-2"
          />

          <!-- メールアドレス -->
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="メールアドレス"
            placeholder="例：taro@example.com"
            type="email"
            variant="outlined"
            :rounded="'xl'"
            class="mb-2"
          />

          <!-- パスワード -->
          <v-text-field
            v-model="user.password"
            :rules="passwordRules"
            label="パスワード"
            placeholder="6文字以上"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            :rounded="'xl'"
            class="mb-2"
          />

          <!-- パスワード（確認） -->
          <v-text-field
            v-model="user.password_confirmation"
            :rules="passwordConfirmationRules"
            label="パスワード（確認）"
            placeholder="もう一度入力"
            :type="showConfirm ? 'text' : 'password'"
            :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirm = !showConfirm"
            variant="outlined"
            :rounded="'xl'"
            class="mb-4"
          />

          <!-- 登録ボタン -->
          <v-btn
            @click="onSignup"
            block
            rounded="pill"
            color="blue-darken-2"
            size="large"
            class="mb-3"
          >登録する</v-btn>

          <!-- ログインへの導線 -->
          <div class="text-center text-body-2 text-medium-emphasis">
            すでにアカウントをお持ちの方は
            <RouterLink to="/login" class="text-blue-darken-2">ログイン</RouterLink>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>
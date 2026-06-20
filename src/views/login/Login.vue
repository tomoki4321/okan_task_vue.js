<script setup lang="ts">
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { emailRules,passwordRules } from "@/stores/validationRules";


const authStore = useAuthStore();

const user = reactive({
  email: "",
  password: "",
});

// パスワードの表示・非表示
const showPassword = ref(false);

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
  <div style="max-width: 480px; margin: 0 auto; padding: 32px 16px;">
    <v-card rounded="xl" elevation="3" class="pa-2">
      <v-card-title>
        <div style="display: flex; align-items: center; gap: 16px; padding-top: 12px;">
          <v-avatar rounded="lg" color="blue-lighten-4" size="40" style="flex-shrink: 0;">
            <v-icon icon="mdi-login-variant" color="blue-darken-2" />
          </v-avatar>
          <div>
            <div class="text-h6">ログイン</div>
            <div class="text-body-2 text-medium-emphasis">ISTにログインします</div>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form">
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
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            :rounded="'xl'"
            class="mb-4"
          />

          <!-- ログインボタン -->
          <v-btn
            @click="onLogin"
            block
            rounded="pill"
            color="blue-darken-2"
            size="large"
            class="mb-4"
          >ログイン</v-btn>

          <!-- 区切り -->
          <div class="d-flex align-center mb-4" style="gap: 12px;">
            <v-divider />
            <span class="text-caption text-medium-emphasis">または</span>
            <v-divider />
          </div>

          <!-- ゲスト・管理者ログイン -->
          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            <v-btn
              @click="guestLogin"
              rounded="pill"
              variant="outlined"
              color="blue-darken-2"
              prepend-icon="mdi-account-outline"
              style="flex: 1 1 0;"
            >ゲスト</v-btn>
            <v-btn
              @click="adminLogin"
              rounded="pill"
              variant="outlined"
              color="amber-darken-2"
              prepend-icon="mdi-shield-account-outline"
              style="flex: 1 1 0;"
            >管理者</v-btn>
          </div>

          <!-- 新規登録への導線 -->
          <div class="text-center text-body-2 text-medium-emphasis">
            アカウントをお持ちでない方は
            <RouterLink to="/sinup" class="text-blue-darken-2">新規登録</RouterLink>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>
<script setup lang="ts">
import {ref,reactive} from 'vue';
import axios,{type AxiosResponse} from 'axios';
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';
import { useFlashMessageStore } from "@/stores/flash-message";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore =useAuthStore();
const messageStore = useFlashMessageStore();
const router = useRouter();

ReceiveUser();

// 変更可能な項目
const userData = reactive({
  name: "",
  email: "",
  password: "",
});

// 表示専用（変更不可）
const userAdmin = ref(false);

// パスワードの表示・非表示
const showPassword = ref(false);

async function ReceiveUser(): Promise<void> {
  await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/users/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      userData.name=response.data.user.name;
      userData.email=response.data.user.email;
      userAdmin.value = response.data.user.admin;
      console.log(response.data);
    });
}

async function UpdateUser(): Promise<void> {
  const data = {
    user: {
      name: userData.name,
      email: userData.email,
      password: userData.password
    }
  };
  const config = {
    headers: {
      uid: authStore.uid,
      "access-token": authStore.access_token,
      client: authStore.client,
    },
  };
  await axios
    .put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/users/${props.id}`, data,config)
    .then((response) => {
      console.log(response.data);
      messageStore.flash("更新しました！")
      router.push({ path: "/user/index" });
    })
    .catch((error) => {
      messageStore.flash("必要項目を記述してください");
    });
}

const ReturnListUser = ():void=> {
  router.push({ path: "/user/index" });
};
</script>

<template>
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 16px;">
    <v-card rounded="xl" elevation="3" class="pa-2">
      <v-card-title>
        <div style="display: flex; align-items: center; gap: 16px; padding-top: 8px;">
          <v-avatar rounded="lg" color="blue-lighten-4" size="40" style="flex-shrink: 0;">
            <v-icon icon="mdi-account-edit" color="blue-darken-2" />
          </v-avatar>
          <span class="text-h6">ユーザー編集</span>
        </div>
      </v-card-title>
      <v-card-text>
        <!-- 権限（表示専用） -->
        <div class="d-flex align-center mb-4" style="gap: 8px;">
          <span class="text-body-2 text-medium-emphasis">権限</span>
          <v-chip :color="userAdmin ? 'amber' : 'blue-grey'" size="small" variant="tonal" label>
            {{ userAdmin ? "管理者" : "一般" }}
          </v-chip>
        </div>

        <!-- 名前 -->
        <v-text-field
          v-model="userData.name"
          label="名前"
          variant="outlined"
          :rounded="'xl'"
          class="mb-3"
        />

        <!-- メールアドレス -->
        <v-text-field
          v-model="userData.email"
          label="メールアドレス"
          type="email"
          variant="outlined"
          :rounded="'xl'"
          class="mb-3"
        />

        <!-- 区切り -->
        <div style="border-top: 1px solid rgba(0,0,0,0.08); margin: 8px 0 20px;"></div>
        <div class="text-body-2 text-medium-emphasis mb-3">
          パスワードを変更する場合は入力してください
        </div>

        <!-- パスワード（目アイコンで表示切替） -->
        <v-text-field
          v-model="userData.password"
          label="新しいパスワード"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          variant="outlined"
          :rounded="'xl'"
          class="mb-6"
        />

        <!-- ボタン -->
        <div style="display: flex; justify-content: center; gap: 20px;">
          <v-btn @click="UpdateUser" rounded="pill" color="blue-darken-2" size="large" style="flex: 1 1 0;">更新する</v-btn>
          <v-btn @click="ReturnListUser" rounded="pill" variant="outlined" color="blue-darken-2" size="large" style="flex: 1 1 0;">戻る</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>


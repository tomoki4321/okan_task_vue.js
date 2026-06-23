<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosResponse } from "axios";
import { useRouter } from "vue-router";
import { useFlashMessageStore } from "@/stores/flash-message";

const authStore = useAuthStore();
const router =useRouter();
const messageStore = useFlashMessageStore();
const index:any = reactive({
  users: [],
});
userListUp();
async function userListUp(): Promise<void> {
  await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/users`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.users = response.data;
      console.log(response.data);
    });
}

async function DestroyUser(id:number): Promise<void> {
  await axios
    .delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/users/${id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then(() => {
      messageStore.flash("削除しました");
      router.go(0);
    });
}

// アバター用のイニシャル（名前の先頭2文字を大文字に）
const initials = (name?: string) =>
  (name ?? "").slice(0, 2).toUpperCase();

// アバターの色
const avatarColors = ["indigo-lighten-4", "pink-lighten-4", "amber-lighten-4", "teal-lighten-4", "blue-lighten-4"];
const avatarColor = (name?: string) => {
  const n = (name ?? "").charCodeAt(0) || 0;
  return avatarColors[n % avatarColors.length];
};
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 32px 16px;">
    <!-- 大きな枠カード（ヘッダー＋ユーザーカード一覧をまとめる） -->
    <v-card rounded="xl" class="pa-4 okan-card-style">
      <!-- ヘッダー -->
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
        <v-avatar rounded="lg" color="blue-lighten-4" size="48" style="flex-shrink: 0;">
          <v-icon icon="mdi-account-group" color="blue-darken-2" />
        </v-avatar>
      <div>
        <div class="text-h5 font-weight-bold">ユーザー一覧</div>
        <div class="text-body-2 text-medium-emphasis">全 {{ index.users.length }} 名のユーザー</div>
      </div>
      </div>

    <!-- ユーザーカードリスト -->
      <v-card
        v-for="user in index.users"
        :key="user.id"
        rounded="xl"
        elevation="3"
        class="mb-3 pa-3"
      >
        <div style="display: flex; align-items: center; gap: 16px;">
          <v-avatar :color="avatarColor(user.name)" size="48" style="flex-shrink: 0;">
            <span class="text-subtitle-2 font-weight-bold">{{ initials(user.name) }}</span>
          </v-avatar>
          <div style="flex: 1 1 0; min-width: 0;">
            <div class="text-subtitle-1 font-weight-bold text-truncate">{{ user.name }}</div>
            <div class="text-body-2 text-medium-emphasis text-truncate">{{ user.email }}</div>
          </div>
          <v-chip
            :color="user.admin ? 'amber' : 'blue-grey'"
            size="small"
            variant="tonal"
            label
            style="flex-shrink: 0;"
          >
            {{ user.admin ? "管理者" : "一般" }}
          </v-chip>
          <div style="display: flex; gap: 4px; flex-shrink: 0;">
            <v-btn :to="{ name: 'user_edit', params: { id: user.id } }" icon="mdi-pencil-outline" variant="text" color="blue-darken-2" size="small" />
            <v-btn @click="DestroyUser(user.id)" icon="mdi-trash-can-outline" variant="text" color="error" size="small" />
          </div>
        </div>
      </v-card>
    </v-card>
  </div>
</template>

<style scoped></style>
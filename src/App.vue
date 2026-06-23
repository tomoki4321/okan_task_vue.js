<script setup lang="ts">
import { ref } from "vue";
import { RouterLink,RouterView,useRouter } from 'vue-router';
import { useDisplay, useTheme } from "vuetify";
import { useAuthStore } from './stores/auth';
import { useFlashMessageStore } from "@/stores/flash-message";
import OKAN_LOGO_FULL from "@/assets/OKAN_LOGO_FULL.png";




const messageStore = useFlashMessageStore();

const authStore=useAuthStore();

const router = useRouter();

// 画面幅でモバイル判定（ハンバーガー表示の切替）
const { mobile } = useDisplay();
// モバイル用ドロワーの開閉
const drawer = ref(false);

// ダークモード切り替え
const theme = useTheme();
const isDark = ref(theme.global.name.value === "dark");
const toggleTheme = () => {
  theme.global.name.value = isDark.value ? "dark" : "light";
  localStorage.setItem("theme", theme.global.name.value);
};

const onLogout = async():Promise<void> => {
  await authStore.logout();
  localStorage.removeItem("access-token");
  localStorage.removeItem("uid");
  localStorage.removeItem("client");
  localStorage.removeItem("admin");
  router.push({ name: "top" });
  messageStore.flash("ログアウトしました！");
};
</script>

<template>
  <v-app>
    <!-- ヘッダー：濃いオレンジ -->
    <v-app-bar flat color="okan-cream" height="68">
      <!-- モバイル時だけハンバーガー -->
      <v-app-bar-nav-icon
        v-if="mobile"
        @click="drawer = !drawer"
        color="white"
      />

      <!-- ロゴ（クリックでトップへ） -->
      <RouterLink to="/" class="d-flex align-center ml-2" style="text-decoration: none;">
        <v-img :src="OKAN_LOGO_FULL" width="86" height="62" alt="おかんタスク" />
      </RouterLink>

      <v-spacer />

      <!-- ダークモードスイッチ -->
      <v-switch
        v-model="isDark"
        @change="toggleTheme"
        hide-details
        color="white"
        density="compact"
        class="mr-2"
        style="flex-grow: 0;"
      >
        <template v-slot:prepend>
          <v-icon :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'" size="20" color="white" />
        </template>
      </v-switch>

      <!-- PC時だけ横並びナビ -->
      <template v-if="!mobile">
        <template v-if="authStore.client == null">
          <v-btn to="/sinup" variant="text" color="white">新規登録</v-btn>
          <v-btn to="/login" variant="text" color="white">ログイン</v-btn>
          <v-btn to="/" variant="text" color="white">TOP</v-btn>
        </template>
        <template v-else>
          <v-btn to="/todo/post" variant="text" color="white">新規タスク作成</v-btn>
          <v-btn to="/todo/index" variant="text" color="white">タスク一覧</v-btn>
          <v-btn
            v-if="authStore.admin !== null"
            to="/user/index"
            variant="text"
            color="white"
          >ユーザー一覧</v-btn>
          <v-btn
            @click="onLogout"
            rounded="pill"
            color="okan-orange"
            variant="flat"
            class="ml-2"
          >ログアウト</v-btn>
        </template>
      </template>
    </v-app-bar>

    <!-- モバイル用ドロワー -->
    <v-navigation-drawer v-model="drawer" temporary location="left">
      <v-list>
        <template v-if="authStore.client == null">
          <v-list-item to="/sinup" prepend-icon="mdi-account-plus" title="新規登録" />
          <v-list-item to="/login" prepend-icon="mdi-login-variant" title="ログイン" />
          <v-list-item to="/" prepend-icon="mdi-home" title="TOP" />
        </template>
        <template v-else>
          <v-list-item to="/todo/post" prepend-icon="mdi-plus-box-outline" title="新規タスク作成" />
          <v-list-item to="/todo/index" prepend-icon="mdi-format-list-checks" title="タスク一覧" />
          <v-list-item
            v-if="authStore.admin !== null"
            to="/user/index"
            prepend-icon="mdi-account-group"
            title="ユーザー一覧"
          />
          <v-divider class="my-2" />
          <v-list-item @click="onLogout" prepend-icon="mdi-logout" title="ログアウト" base-color="okan-orange" />
        </template>
      </v-list>
    </v-navigation-drawer>
    <!-- 本体 -->
    <v-main class="app-main">
      <!-- フラッシュメッセージ -->
      <v-slide-y-transition>
        <v-alert
          v-if="messageStore.text"
          variant="flat"
          rounded="lg"
          class="ma-4 okan-alert"
        >{{ messageStore.text }}</v-alert>
      </v-slide-y-transition>
      <RouterView />
    </v-main>

    <!-- フッター：濃いオレンジ -->
    <v-footer color="okan-cream" class="d-flex justify-center py-4">
      <span class="text-caption d-inline-flex align-center" style="gap: 6px; color: #ffffff;">
        <v-icon icon="mdi-eye-check-outline" size="16" color="white" />
        © 2023 おかんタスク
      </span>
    </v-footer>
  </v-app>
</template>


<style scoped>
.app-main {
  min-height: calc(100vh - 68px);
}

.okan-alert {
  background-color: #2e7d32 !important;
  color: #ffffff !important;
  font-weight: bold;
}

</style>
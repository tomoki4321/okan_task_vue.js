<script setup lang="ts">
import { ref } from "vue";
import { RouterLink,RouterView,useRouter } from 'vue-router';
import { useDisplay } from "vuetify";
import { useAuthStore } from './stores/auth';
import { useFlashMessageStore } from "@/stores/flash-message";
import IST from "@/assets/IST.png";


const messageStore = useFlashMessageStore();

const authStore=useAuthStore();

const router = useRouter();

// 画面幅でモバイル判定（ハンバーガー表示の切替）
const { mobile } = useDisplay();
// モバイル用ドロワーの開閉
const drawer = ref(false);

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
    <!-- ヘッダー：白地＋下に薄い境界線 -->
    <v-app-bar flat color="white" border="b" height="68">
      <!-- モバイル時だけハンバーガー -->
      <v-app-bar-nav-icon
        v-if="mobile"
        @click="drawer = !drawer"
        color="blue-darken-2"
      />

      <!-- ロゴ（クリックでトップへ） -->
      <RouterLink to="/" class="d-flex align-center ml-2" style="text-decoration: none;">
        <v-img :src="IST" width="96" height="48" alt="IST ロゴ" />
      </RouterLink>

      <v-spacer />

      <!-- PC時だけ横並びナビ -->
      <template v-if="!mobile">
        <template v-if="authStore.client == null">
          <v-btn to="/sinup" variant="text" color="blue-darken-2" class="text-blue-darken-2">新規登録</v-btn>
          <v-btn to="/login" variant="text" color="blue-darken-2" class="text-blue-darken-2">ログイン</v-btn>
          <v-btn to="/" variant="text" color="blue-darken-2" class="text-blue-darken-2">TOP</v-btn>
        </template>
        <template v-else>
          <v-btn to="/todo/post" variant="text" color="blue-darken-2" class="text-blue-darken-2">新規タスク作成</v-btn>
          <v-btn to="/todo/index" variant="text" color="blue-darken-2" class="text-blue-darken-2">タスク一覧</v-btn>
          <v-btn
            v-if="authStore.admin !== null"
            to="/user/index"
            variant="text"
            color="blue-darken-2"
            class="text-blue-darken-2"
          >ユーザー一覧</v-btn>
          <v-btn
            @click="onLogout"
            rounded="pill"
            color="blue-darken-2"
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
          <v-list-item @click="onLogout" prepend-icon="mdi-logout" title="ログアウト" base-color="blue-darken-2" />
        </template>
      </v-list>
    </v-navigation-drawer>
    <!-- 本体 -->
    <v-main class="app-main">
      <!-- フラッシュメッセージ -->
      <v-slide-y-transition>
        <v-alert
          v-if="messageStore.text"
          type="info"
          variant="tonal"
          rounded="lg"
          class="ma-4"
        >{{ messageStore.text }}</v-alert>
      </v-slide-y-transition>
      <RouterView />
    </v-main>

    <!-- フッター：白地＋上に薄い境界線 -->
    <v-footer color="white" border="t" class="d-flex justify-center py-4">
      <span class="text-caption text-medium-emphasis d-inline-flex align-center" style="gap: 6px;">
        <v-icon icon="mdi-eye-check-outline" size="16" color="blue-darken-2" />
        © 2023 IST
      </span>
    </v-footer>
  </v-app>
</template>

<style scoped>
.app-main {
  background-color: #e9eaec;
  min-height: calc(100vh - 68px);
}
</style>
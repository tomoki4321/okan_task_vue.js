<script setup lang="ts">
import { useRouter } from 'vue-router';
import IST from "@/assets/IST.png";
</script>

<!-- <template>
<div>
  <v-card class="mx-auto mt-5" width="800px">
    <v-card-title>
      <h1>ISTとは</h1>
      </v-card-title>
      <v-card-text>
        ISTはI see taskの略で、タスクの進捗が見える(see)ことで今どれだけタスクが進んでいるのかがわかる(see)アプリです。タスクの進捗具合が一覧にて一目でわかることが出来ます。
      </v-card-text>
      <v-divider></v-divider>
      <v-card-title>
        <h3>タスク作成機能</h3>
      </v-card-title>
      <v-card-text>
        ・名前、内容、期限、優先度、ステータス、進行度を記載することができます。
      </v-card-text>
      <v-card-text>
        ・タスク一覧画面の編集からカテゴリを追加することができます。
      </v-card-text>
      <v-divider></v-divider>
      <v-card-title>
        <h3>リアルタイム検索機能</h3>
      </v-card-title>
      <v-card-text>
        ・タスク一覧画面上部の検索窓からタスク名、優先度、ステータスにて検索が可能です。
      </v-card-text>
      <v-card-text>
        ※今現在複数検索ができないため、一つの項目にて検索後、お手数ですが各項目のリセットボタンを押してください。
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>

</style> -->

<template>
  <div style="max-width: 640px; margin: 0 auto; padding: 32px 16px;">
    <!-- ヒーロー：IST とは -->
    <v-card rounded="xl" variant="outlined" class="pa-2 mb-4">
      <v-card-text>
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
          <v-avatar rounded="lg" size="56" style="flex-shrink: 0;">
            <v-img :src="IST" alt="IST ロゴ" />
          </v-avatar>
          <div>
            <div class="text-h5 font-weight-medium">IST とは</div>
            <div class="text-body-2 text-medium-emphasis">I see task</div>
          </div>
        </div>
        <p class="text-body-1 text-medium-emphasis" style="line-height: 1.8;">
          IST は I see task の略で、タスクの進捗が見える（see）ことで、今どれだけ進んでいるのかがわかる（see）アプリです。一覧で進捗具合が一目でわかります。
        </p>
      </v-card-text>
    </v-card>

    <!-- 3機能カード -->
    <div class="feature-grid mb-4">
      <v-card rounded="lg" variant="outlined" class="pa-4">
        <v-icon icon="mdi-plus-box-outline" color="blue-darken-2" size="28" />
        <div class="text-subtitle-1 font-weight-medium mt-2 mb-1">タスク作成</div>
        <div class="text-body-2 text-medium-emphasis">名前・内容・期限・優先度・ステータス・進行度を登録。編集からカテゴリも追加できます。</div>
      </v-card>
      <v-card rounded="lg" variant="outlined" class="pa-4">
        <v-icon icon="mdi-magnify" color="blue-darken-2" size="28" />
        <div class="text-subtitle-1 font-weight-medium mt-2 mb-1">リアルタイム検索</div>
        <div class="text-body-2 text-medium-emphasis">タスク名・優先度・ステータスで一覧をその場で絞り込めます。</div>
      </v-card>
      <v-card rounded="lg" variant="outlined" class="pa-4">
        <v-icon icon="mdi-chart-bar" color="blue-darken-2" size="28" />
        <div class="text-subtitle-1 font-weight-medium mt-2 mb-1">進捗の可視化</div>
        <div class="text-body-2 text-medium-emphasis">進行度バーで、各タスクの達成度を一目で把握できます。</div>
      </v-card>
    </div>

    <!-- 導線 -->
    <v-card rounded="xl" variant="outlined" class="pa-6 text-center">
      <div class="text-subtitle-1 font-weight-medium mb-4">さっそく始めましょう</div>
      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <v-btn :to="{ name: 'sinup' }" rounded="pill" color="blue-darken-2" size="large">新規登録</v-btn>
        <v-btn :to="{ name: 'login' }" rounded="pill" variant="outlined" color="blue-darken-2" size="large">ログイン</v-btn>
      </div>
      <div class="text-caption text-medium-emphasis mt-4">
        ※ 現在は複数項目での同時検索ができないため、1項目で検索後、各リセットボタンを押してください。
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
</style>
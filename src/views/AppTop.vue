<script setup lang="ts">
import { useRouter } from 'vue-router';
import OKAN_LOGO_FULL from "@/assets/OKAN_LOGO_FULL.png";

</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 32px 16px;">

    <!-- ヒーロー：吹き出し風メインビジュアル -->
    <div class="okan-hero mb-6">
      <div class="okan-hero-text">
        <div class="okan-eyebrow">おかんの愛あるガミガミで</div>
        <div class="text-h5 font-weight-bold mb-3" style="color: #5a3a1a;">
          あなたのタスクを終わらせる！
        </div>

        <ul class="okan-points mb-4">
          <li>「まだやってないの？」</li>
          <li>「後でやるは信用ならん！」</li>
          <li>「あんた何回同じことするん？」</li>
        </ul>

        <p class="text-body-2" style="color: #8a6a4a;">
          期限が近づくと、おかんがLINEでガミガミ催促してくるタスク管理アプリです。
          そんな愛のある圧力で、あなたの先延ばしを防ぎます。
        </p>
      </div>

      <div class="okan-hero-image">
        <v-img :src="OKAN_LOGO_FULL" alt="おかんタスク" class="okan-hero-img" />
      </div>
    </div>

    <!-- 機能カード（吹き出し風の太枠） -->
    <div class="feature-grid mb-6">
      <div class="okan-card">
        <v-icon icon="mdi-plus-box-outline" color="okan-orange" size="30" />
        <div class="text-subtitle-1 font-weight-bold mt-2 mb-1">タスク作成</div>
        <div class="text-body-2" style="color: #8a6a4a;">
          名前・内容・期限・優先度・ステータス・進行度を登録。編集からカテゴリも追加できます。
        </div>
      </div>
      <div class="okan-card">
        <v-icon icon="mdi-magnify" color="okan-orange" size="30" />
        <div class="text-subtitle-1 font-weight-bold mt-2 mb-1">リアルタイム検索</div>
        <div class="text-body-2" style="color: #8a6a4a;">
          タスク名・優先度・ステータスで一覧をその場で絞り込めます。
        </div>
      </div>
      <div class="okan-card">
        <v-icon icon="mdi-chart-bar" color="okan-orange" size="30" />
        <div class="text-subtitle-1 font-weight-bold mt-2 mb-1">進捗の可視化</div>
        <div class="text-body-2" style="color: #8a6a4a;">
          進行度バーで、各タスクの達成度を一目で把握できます。
        </div>
      </div>
      <div class="okan-card">
        <v-icon icon="mdi-message-alert-outline" color="okan-orange" size="30" />
        <div class="text-subtitle-1 font-weight-bold mt-2 mb-1">おかんLINE通知</div>
        <div class="text-body-2" style="color: #8a6a4a;">
          期限の3日前になると、LINEに「おかん」からの催促メッセージが届きます。
        </div>
      </div>
    </div>

    <!-- 導線 -->
    <div class="okan-cta">
      <div class="text-subtitle-1 font-weight-bold mb-4" style="color: #5a3a1a;">
        さっそく始めましょう
      </div>
      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <v-btn :to="{ name: 'sinup' }" rounded="lg" color="okan-orange" variant="flat" size="large">新規登録</v-btn>
        <v-btn :to="{ name: 'login' }" rounded="lg" variant="outlined" color="okan-orange" size="large">ログイン</v-btn>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ヒーロー全体 */
.okan-hero {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #ffffff;
  border: 3px solid #f4a627;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 0 #f4a627;
  flex-wrap: wrap;
  overflow: hidden;
}
.okan-hero-text {
  flex: 1 1 280px;
  min-width: 0;
}
.okan-eyebrow {
  color: #e8632c;
  font-weight: bold;
  font-size: 0.85rem;
  margin-bottom: 4px;
}
.okan-points {
  list-style: none;
  padding: 0;
  margin: 0;
}
.okan-points li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 6px;
  font-weight: bold;
  color: #5a3a1a;
}
.okan-points li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #e8632c;
  font-weight: bold;
}

/* キャラクター画像＋吹き出し */
.okan-hero-image {
  flex: 0 0 160px;
  width: 160px;
  max-width: 160px;
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 36px;
}
.okan-hero-img {
  width: 140px !important;
  max-width: 140px !important;
  height: auto !important;
  flex: none !important;
}
.okan-speech-bubble {
  position: absolute;
  top: -36px;
  right: -4px;
  background: #fff;
  border: 2px solid #e8632c;
  border-radius: 16px;
  padding: 6px 10px;
  font-size: 0.7rem;
  font-weight: bold;
  color: #e8632c;
  text-align: center;
  box-shadow: 0 2px 0 #f4a627;
  max-width: 130px;
  white-space: nowrap;
}

/* 機能カード */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.okan-card {
  background: #ffffff;
  border: 2px solid #f4a627;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 3px 0 #f4a627;
}

/* 導線エリア */
.okan-cta {
  background: #ffffff;
  border: 3px solid #f4a627;
  border-radius: 24px;
  padding: 28px;
  text-align: center;
  box-shadow: 0 4px 0 #f4a627;
}

/* スマホ幅で1列に */
@media (max-width: 480px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .okan-hero {
    flex-direction: column-reverse;
  }
  .okan-hero-image {
    margin-top: 0;
  }
}
</style>
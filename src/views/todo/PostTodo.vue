<script setup lang="ts">
import {ref,reactive} from 'vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';
import { useFlashMessageStore } from "@/stores/flash-message";
import { nameRules, contentRules, limitRules } from "@/stores/validationRules";

const authStore =useAuthStore();
const router = useRouter();
const progressCounter=ref(0);
const taskData = reactive({
  name:"",
  content:"",
  limit: "",
  priority:2,
  status:2,
  progress:0,
});

const messageStore = useFlashMessageStore();

// 優先度・ステータスの選択チップ定義
const priorityItems = [
  { value: 1, label: "高", color: "red" },
  { value: 2, label: "中", color: "indigo" },
  { value: 3, label: "低", color: "green" },
];
const statusItems = [
  { value: 1, label: "未着手", color: "blue-grey" },
  { value: 2, label: "未完了", color: "amber" },
  { value: 3, label: "完了", color: "teal" },
];
const priorityOptions = [
  { value: 1, label: "高" },
  { value: 2, label: "中" },
  { value: 3, label: "低" },
];
// 進捗バーの色
const progressColor = (p?: number) => ((p ?? 0) >= 100 ? "teal" : "blue");

//バリデーション
const form = ref();

async function postTask(): Promise<void> {
  // フォーム全体のバリデーションを実行
  const { valid } = await form.value.validate();
  if (!valid) {
    messageStore.flash("入力内容を確認してください");
    return;
  }
  const data = {
    task: {
      name: taskData.name,
      content: taskData.content,
      limit: taskData.limit,
      priority: taskData.priority,
      status: taskData.status,
      progress:taskData.progress,
    },
  };
  const config = {
    headers: {
      uid: authStore.uid,
      "access-token": authStore.access_token,
      client: authStore.client,
    },
  };
  await axios
    .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks`, data,config)
    .then((response) => {
      console.log(response.data);
      router.push({ path: "/todo/index" });
      messageStore.flash("タスクを作成しました");
    })
    .catch((error) => {
      console.log(error.response);
      messageStore.flash("登録に失敗しました。入力内容を確認してください");
    });
}

const ReturnListTodo = ():void=> {
  router.push({ path: "/todo/index" });
};
</script>

<template>
  <div style="max-width: 640px; margin: 0 auto; padding: 32px 16px;">
    <v-card rounded="xl" variant="outlined" class="pa-2">
      <v-card-title>
        <div style="display: flex; align-items: center; gap: 16px; padding-top: 8px;">
          <v-avatar rounded="lg" color="blue-lighten-4" size="40" style="flex-shrink: 0;">
            <v-icon icon="mdi-plus-box-outline" color="blue-darken-2" />
          </v-avatar>
          <span class="text-h6">新規タスク作成</span>
        </div>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form">
          <v-text-field
            v-model="taskData.name"
            :rules="nameRules"
            label="タスク名"
            placeholder="例：企画書を仕上げる"
            variant="outlined"
            :rounded="'xl'"
            class="mb-3"
          />
          <v-textarea
            v-model="taskData.content"
            :rules="contentRules"
            label="内容"
            placeholder="例：来週の定例までに初稿を完成させる"
            variant="outlined"
            :rounded="'xl'"
            class="mb-3"
          />
          <div class="d-flex flex-wrap" style="gap: 12px;">
            <v-text-field
              v-model="taskData.limit"
              :rules="limitRules"
              label="期日"
              type="date"
              variant="outlined"
              :rounded="'xl'"
              style="flex: 1 1 220px;"
            />
            <v-select
              v-model="taskData.priority"
              :items="priorityOptions"
              item-title="label"
              item-value="value"
              label="優先度"
              variant="outlined"
              :rounded="'xl'"
              style="flex: 1 1 220px;"
            />
          </div>

          <div class="text-body-2 text-medium-emphasis mb-2">ステータス</div>
          <div class="d-flex flex-wrap mb-4" style="gap: 8px;">
            <v-chip
              v-for="s in statusItems"
              :key="s.value"
              :color="taskData.status === s.value ? s.color : undefined"
              :variant="taskData.status === s.value ? 'flat' : 'tonal'"
              label
              @click="taskData.status = s.value"
            >
              {{ s.label }}
            </v-chip>
          </div>

          <div class="text-body-2 text-medium-emphasis mb-2">進行度</div>
          <v-progress-linear
            :model-value="Number(taskData.progress)"
            :color="progressColor(taskData.progress)"
            height="10"
            rounded
          />
          <div style="text-align: right; margin-top: 6px; margin-bottom: 24px;">
            <span class="text-h6 font-weight-medium">{{ taskData.progress || 0 }}%</span>
          </div>

          <v-text-field
            v-model="taskData.progress"
            label="進行度(%)"
            type="number"
            variant="outlined"
            :rounded="'xl'"
            hide-details
            class="mb-6"
          />

          <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            <v-btn @click="postTask" rounded="pill" color="blue-darken-2" size="large" style="flex: 1 1 220px; min-width: 0;">タスク登録</v-btn>
            <v-btn @click="ReturnListTodo" rounded="pill" variant="outlined" color="blue-darken-2" size="large" style="flex: 1 1 120px; min-width: 0;">戻る</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>
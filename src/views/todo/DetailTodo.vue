<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosResponse } from "axios";
import moment from "moment";
import { useRouter } from "vue-router";



interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const taskName = ref("");
const taskContent =ref("");
const taskLimit = ref("");
const taskStatus = ref();
const taskPriority =ref();
const taskProgress = ref();
const taskCategory =ref();
const propsNumber= props.id as never;

setShow();

async function setShow(): Promise<void> {
  await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      taskName.value = response.data.task.name;
      taskContent.value = response.data.task.content;
      taskLimit.value = response.data.task.limit;
      taskStatus.value = response.data.task.status;
      taskPriority.value = response.data.task.priority;
      taskProgress.value = response.data.task.progress;
    });
}

async function setLavel(): Promise<void> {
  await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/${props.id}/label_find`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },

    })
    .then((response: AxiosResponse<any>) => {
      taskCategory.value=response.data.category.category_id;
      console.log(response.data.category.category_id);
    });
}

const router = useRouter();
const changeDate = (date:any) => {
  return moment(date).format("YYYY年MM月DD日");
};

const ReturnListTodo = ():void=> {
  router.push({ path: "/todo/index" });
};

const labelPossible = computed(()=>{
  if(authStore.labels.includes(propsNumber) == true){
    setLavel();
    return true
  }else{
    return false
  }
});

// 表示用ラベル・色マッピング（ListTodoと同じ）
const priorityLabel = (p?: number) => (p === 1 ? "高" : p === 2 ? "中" : "低");
const priorityColor = (p?: number) => (p === 1 ? "red" : p === 2 ? "indigo" : "green");
const statusLabel = (s?: number) => (s === 1 ? "未着手" : s === 2 ? "未完了" : "完了");
const statusColor = (s?: number) => (s === 1 ? "blue-grey" : s === 2 ? "amber" : "teal");
const categoryLabel = (c?: number) =>
  ({ 1: "仕事", 2: "趣味", 3: "買い物", 4: "アイデア", 5: "その他" }[c ?? 0] ?? "");
const progressColor = (p?: number) => ((p ?? 0) >= 100 ? "teal" : "blue");
</script>

<!-- <template>
  <div class="show">
      <v-card class="mx-auto mt-5" width="800px">
      <v-card-title>
        <h1>タスク詳細</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <table>
            <tr>
              <td>タスク名</td>
              <td>{{ taskName }}</td>
            </tr>
            <tr>
              <td>タスク内容</td>
              <td>{{ taskContent }}</td>
            </tr>
            <tr>
              <td>期日</td>
              <td>{{ changeDate(taskLimit) }}</td>
            </tr>
            <tr>
              <td>優先度</td>
              <td v-if="taskPriority == 1">
                高
              </td>
              <td v-if="taskPriority == 2">
                中
              </td>
              <td v-if="taskPriority == 3">
                低
              </td>
            </tr>
            <tr>
              <td>ステータス</td>
              <td v-if="taskStatus == 1">
                未着手
              </td>
              <td v-if="taskStatus == 2">
                未完了
              </td>
              <td v-if="taskStatus == 3">
                完了
              </td>
            </tr>
            <tr>
              <td>進行度</td>
              <td>{{taskProgress }}%<progress id="progress" max="100" v-bind:value="taskProgress"></progress></td>
            </tr>
            <tr v-if="labelPossible == true" >
              <td>カテゴリ</td>
              <td v-if="taskCategory == 1" >
                仕事
              </td>
              <td v-if="taskCategory == 2" >
                趣味
              </td>
              <td v-if="taskCategory == 3" >
                買い物
              </td>
              <td v-if="taskCategory == 4" >
                アイデア
              </td>
              <td v-if="taskCategory == 5" >
                その他
              </td>
            </tr>
          </table>
          <v-row class="justify-center mt-3">
            <v-btn @click="ReturnListTodo" color="secondary">一覧に戻る</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.show{
  padding-top:80px;
}
h1{
  text-align: center;
  padding-bottom: 20px;
}
</style> -->
<template>
  <div style="max-width: 640px; margin: 0 auto; padding: 32px 16px;">
    <v-card rounded="xl" variant="outlined" class="pa-2">
      <v-card-title class="d-flex align-center ga-3 pt-4">
        <v-avatar rounded="lg" color="blue-lighten-4" size="40">
          <v-icon icon="mdi-file-document-outline" color="blue-darken-2" />
        </v-avatar>
        <span class="text-h6">タスク詳細</span>
      </v-card-title>
      <v-card-text>
        <!-- タスク名＋バッジ -->
        <div class="text-h5 font-weight-medium mb-2">{{ taskName }}</div>
        <div class="d-flex ga-2 mb-6 flex-wrap">
          <v-chip :color="priorityColor(taskPriority)" size="small" variant="tonal">
            優先度 {{ priorityLabel(taskPriority) }}
          </v-chip>
          <v-chip :color="statusColor(taskStatus)" size="small" variant="tonal">
            {{ statusLabel(taskStatus) }}
          </v-chip>
          <v-chip v-if="labelPossible" color="deep-purple" size="small" variant="tonal">
            {{ categoryLabel(taskCategory) }}
          </v-chip>
        </div>

        <!-- 内容・期日の行リスト -->
        <div class="detail-row">
          <span class="text-medium-emphasis d-inline-flex align-center ga-2">
            <v-icon icon="mdi-text" size="18" />内容
          </span>
          <span class="text-right">{{ taskContent }}</span>
        </div>
        <div class="detail-row">
          <span class="text-medium-emphasis d-inline-flex align-center ga-2">
            <v-icon icon="mdi-calendar" size="18" />期日
          </span>
          <span>{{ changeDate(taskLimit) }}</span>
        </div>

        <!-- 進捗の強調ブロック -->
        <div class="progress-box mt-4 mb-6">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2 text-medium-emphasis">進行度</span>
            <span class="text-h6 font-weight-medium">{{ taskProgress || 0 }}%</span>
          </div>
          <v-progress-linear :model-value="Number(taskProgress) || 0"
            :color="progressColor(taskProgress)" height="10" rounded />
        </div>

        <!-- ボタン -->
        <div style="display: flex; justify-content: center; gap: 20px;">
          <v-btn :to="{ name: 'edit', params: { id: props.id } }"
            rounded="pill" variant="outlined" color="blue-darken-2" size="large"
            prepend-icon="mdi-pencil" style="flex: 1 1 0;">編集する</v-btn>
          <v-btn @click="ReturnListTodo" rounded="pill" color="blue-darken-2"
            size="large" style="flex: 1 1 0;">一覧に戻る</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
.progress-box {
  background: rgba(0,0,0,0.03);
  border-radius: 16px;
  padding: 16px 20px;
}
</style>
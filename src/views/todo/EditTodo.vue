<script setup lang="ts">
import {reactive,computed,ref} from 'vue';
import axios,{type AxiosResponse} from 'axios';
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';
import { useFlashMessageStore } from "@/stores/flash-message";
import { nameRules, contentRules, limitRules } from "@/stores/validationRules";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore =useAuthStore();
const router = useRouter();
const messageStore = useFlashMessageStore();
const taskData = reactive({
  name:"",
  content:"",
  limit: "",
  priority:2,
  status:2,
  progress:0,
  category_id:1,
  task_id:props.id,
});
ReceiveTask();

// 優先度プルダウンの選択肢
const priorityOptions = [
  { value: 1, label: "高" },
  { value: 2, label: "中" },
  { value: 3, label: "低" },
];
// ステータスチップの定義
const statusItems = [
  { value: 1, label: "未着手", color: "blue-grey" },
  { value: 2, label: "未完了", color: "amber" },
  { value: 3, label: "完了", color: "teal" },
];
// カテゴリプルダウンの選択肢
const categoryOptions = [
  { value: 1, label: "仕事" },
  { value: 2, label: "趣味" },
  { value: 3, label: "買い物" },
  { value: 4, label: "アイデア" },
  { value: 5, label: "その他" },
];
// 進捗バーの色
const progressColor = (p?: number) => ((p ?? 0) >= 100 ? "teal" : "blue");

const propsNumber= props.id as never;

//バリデーション
const form = ref();


async function ReceiveTask(): Promise<void> {
  await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      taskData.name=response.data.task.name;
      taskData.content = response.data.task.content;
      taskData.limit = response.data.task.limit;
      taskData.status = response.data.task.status;
      taskData.priority = response.data.task.priority;
      taskData.progress = response.data.task.progress;
      console.log(response.data);
    });
}

async function labeladd(): Promise<void> {
  const data = {
    task_category: {
      task_id:taskData.task_id,
      category_id:taskData.category_id
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
    .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/label_add`, data,config)
    .then((response) => {
      console.log(response.data);
      messageStore.flash("カテゴリを追加しました。");
      authStore.labels.push(propsNumber);
      console.log(authStore.labels);
    });
}

async function UpdateTask(): Promise<void> {
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
    .patch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/${props.id}`, data,config)
    .then((response) => {
      console.log(response.data);
      router.push({ path: "/todo/index" });
      messageStore.flash("タスクを編集しました");
    })
    .catch((error) => {
      messageStore.flash("更新に失敗しました。入力内容を確認してください");
    });
}

const ReturnListTodo = ():void=> {
  router.push({ path: "/todo/index" });
};

const labelPossible = computed(()=>{
  if(authStore.labels.includes(propsNumber) == true){
    return true
  }else{
    return false
  }
});
</script>

<template>
  <div style="max-width: 640px; margin: 0 auto; padding: 32px 16px;">
    <v-card rounded="xl" elevation="3" class="pa-2">
      <v-card-title>
        <div style="display: flex; align-items: center; gap: 16px; padding-top: 8px;">
          <v-avatar rounded="lg" color="blue-lighten-4" size="40" style="flex-shrink: 0;">
            <v-icon icon="mdi-pencil" color="blue-darken-2" />
          </v-avatar>
          <span class="text-h6">タスク編集</span>
        </div>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-form ref="form">
          <v-text-field
            v-model="taskData.name"
            :rules="nameRules"
            label="タスク名"
            variant="outlined"
            :rounded="'xl'"
            class="mb-3"
          />
          <v-textarea
            v-model="taskData.content"
            :rules="contentRules"
            label="内容"
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
            class="mb-4"
          />

          <!-- カテゴリ追加（未追加時のみ） -->
          <div
            v-if="labelPossible === false"
            style="border-top: 1px solid rgba(0,0,0,0.08); margin: 8px 0 20px; padding-top: 20px;"
          >
            <div class="text-body-2 text-medium-emphasis mb-2">カテゴリを追加</div>
            <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
              <v-select
                v-model="taskData.category_id"
                :items="categoryOptions"
                item-title="label"
                item-value="value"
                label="カテゴリ"
                variant="outlined"
                :rounded="'xl'"
                hide-details
                style="flex: 1 1 220px;"
              />
              <v-btn
                @click.once="labeladd"
                rounded="pill"
                color="deep-purple"
                size="large"
                prepend-icon="mdi-tag-plus"
                style="flex-shrink: 0;"
              >カテゴリ追加</v-btn>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            <v-btn @click="UpdateTask" rounded="pill" color="blue-darken-2" size="large" style="flex: 1 1 220px; min-width: 0;">更新する</v-btn>
            <v-btn @click="ReturnListTodo" rounded="pill" variant="outlined" color="blue-darken-2" size="large" style="flex: 1 1 120px; min-width: 0;">戻る</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>
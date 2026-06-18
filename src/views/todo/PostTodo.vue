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
// const priorityItems =["",1,2,3];
// const statusItems =["",1,2,3];
// const messageStore = useFlashMessageStore();

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

// const todayDate =()=>{
//   let todaySet = new Date();
//   let YYYY = todaySet.getFullYear();
//   let MM = ('00'+(todaySet.getMonth()+1)).slice(-2);
//   let DD =('00'+ todaySet.getDate()).slice(-2);
//   let today = YYYY + '-' + MM + '-' + DD;
//   return today;
// }
</script>


<!-- <template>
  <div class="post">
      <v-card class="mx-auto mt-5" width="800px">
      <v-card-title>
        <h1>新規タスク作成</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field label="タスク名" v-model="taskData.name" :rules="nameRules"/>
          <v-textarea label="内容" v-model="taskData.content" :rules="contentRules"></v-textarea>
          <v-text-field label="期日" v-model="taskData.limit" type="date" :rules="limitRules"/>
          <v-select  v-model="taskData.priority" label="優先度" :items="priorityItems"></v-select>
          <label for="priority">1:高 2:中 3:低</label>
          <v-select  v-model="taskData.status" label="ステータス" :items="statusItems"></v-select>
          <label for="priority">1:未着手 2:未完了 3:完了</label>
          <v-row class="justify-center mt-3">
            <label for="progress" class="mt-3">進行度</label>
            <progress id="progress" max="100" v-bind:value="progressCounter" class="mt-3"></progress>
            <v-text-field label="進行度(%)" v-model="taskData.progress"/>
          </v-row>
          <v-row class="justify-center mb-3">
            <v-btn @click="postTask" class="mr-4" color="secondary">タスク登録</v-btn>
            <v-btn @click="ReturnListTodo" class="mr-4" color="secondary">一覧に戻る</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template> -->


<template>
  <div style="max-width: 640px; margin: 0 auto; padding: 32px 16px;">
    <v-card rounded="xl" variant="outlined" class="pa-2">
      <v-card-title class="d-flex align-center ga-3 pt-4">
        <v-avatar rounded="lg" color="blue-lighten-4" size="40">
          <v-icon icon="mdi-pencil-plus" color="blue-darken-2" />
        </v-avatar>
        <span class="text-h6">新規タスク作成</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="taskData.name" label="タスク名"
            placeholder="例：企画書を仕上げる"
            :rules="nameRules" variant="outlined" :rounded="'xl'" class="mb-3" />
          <v-textarea v-model="taskData.content" label="内容"
            placeholder="例：来週の定例までに初稿を完成させる"
            :rules="contentRules" variant="outlined" :rounded="'xl'" class="mb-3"></v-textarea>

          <div class="d-flex ga-3 flex-wrap">
            <v-text-field v-model="taskData.limit" label="期日" type="date"
              :rules="limitRules" variant="outlined" :rounded="'xl'" style="flex: 1 1 240px;" />
            <v-select v-model="taskData.priority" label="優先度"
              :items="priorityOptions" item-title="label" item-value="value"
              variant="outlined" :rounded="'xl'" style="flex: 1 1 200px;" />
          </div>

          <div class="text-body-2 text-medium-emphasis mb-2 mt-2">ステータス</div>
          <div class="d-flex ga-2 mb-6 flex-wrap">
            <v-chip v-for="s in statusItems" :key="s.value"
              :color="taskData.status === s.value ? s.color : undefined"
              :variant="taskData.status === s.value ? 'flat' : 'tonal'"
              @click="taskData.status = s.value">{{ s.label }}</v-chip>
          </div>

          <div class="text-body-2 text-medium-emphasis mb-2">進行度</div>
          <v-progress-linear :model-value="Number(taskData.progress)"
            :color="progressColor(Number(taskData.progress))" height="8" rounded />
          <div style="text-align: right; margin-top: 6px; margin-bottom: 24px;">
            <span class="text-body-1 font-weight-medium">{{ taskData.progress || 0 }}%</span>
          </div>
          <v-text-field v-model="taskData.progress" label="進行度(%)"
            placeholder="0〜100 の数字を入力"
            type="number" variant="outlined" :rounded="'xl'" hide-details
            style="margin-bottom: 24px;" />

          <div style="display: flex; justify-content: center; gap: 20px;">
            <v-btn @click="postTask" rounded="pill" color="blue-darken-2"
              size="large" style="min-width: 280px;">タスク登録</v-btn>
            <v-btn @click="ReturnListTodo" rounded="pill" variant="outlined"
              size="large">戻る</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<style scoped>
/* .post{
  padding-top:10px;
  padding-bottom:10px;
}
h1{
  text-align: center;
  padding-bottom: 20px;
} */
</style>
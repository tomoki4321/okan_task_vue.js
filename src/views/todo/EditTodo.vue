<script setup lang="ts">
import {reactive,computed} from 'vue';
import axios,{type AxiosResponse} from 'axios';
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';
import { useFlashMessageStore } from "@/stores/flash-message";

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

const priorityItems =["",1,2,3];
const statusItems =["",1,2,3];
const categoryItems =[1,2,3,4,5];

async function ReceiveTask(): Promise<void> {
  await axios
    .get(`http://localhost:3000/api/v1/tasks/${props.id}`, {
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
    .post("http://localhost:3000/api/v1/tasks/label_add", data,config)
    .then((response) => {
      console.log(response.data);
      messageStore.flash("カテゴリを追加しました。");
      authStore.labels.push(props.id);
      console.log(authStore.labels);
    });
}

async function UpdateTask(): Promise<void> {
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
    .patch(`http://localhost:3000/api/v1/tasks/${props.id}`, data,config)
    .then((response) => {
      console.log(response.data);
      router.push({ path: "/todo/index" });
    });
}

const ReturnListTodo = ():void=> {
  router.push({ path: "/todo/index" });
};

const labelPossible = computed(()=>{
  if(authStore.labels.includes(props.id) == true){
    return true
  }else{
    return false
  }
});
</script>


<template>
  <div class="edit">
      <v-card class="mx-auto mt-5" width="800px">
      <v-card-title>
        <h1>タスク編集</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="タスク名" v-model="taskData.name"/>
          <v-textarea label="内容" v-model="taskData.content"></v-textarea>
          <v-text-field label="期日" v-model="taskData.limit" type="date"/>
          <v-select  v-model="taskData.priority" label="優先度" :items="priorityItems"></v-select>
          <label for="priority">1:高 2:中 3:低</label>
          <v-select  v-model="taskData.status" label="ステータス" :items="statusItems"></v-select>
          <label for="priority">1:未着手 2:未完了 3:完了</label>
          <v-row class="justify-center mt-3">
            <label for="progress" class="mt-3">進行度</label>
            <progress id="progress" max="100" v-bind:value="taskData.progress" class="mt-3"></progress>
            <v-text-field label="進行度(%)" v-model="taskData.progress"/>
          </v-row>
          <v-row v-if="labelPossible == false">
            <v-select  v-model="taskData.category_id" label="カテゴリ" :items="categoryItems"></v-select>
            <label for="priority" class="mt-3">1:仕事 2:趣味 3:買い物 4:アイデア 5:その他</label>
            <v-btn @click.once="labeladd" class="mr-4" color="blue">カテゴリ追加</v-btn>
          </v-row>
          <v-row class="justify-center mb-3">
            <v-btn @click="UpdateTask" class="mr-4" color="secondary">タスク更新</v-btn>
            <v-btn @click="ReturnListTodo" class="mr-4" color="secondary">一覧に戻る</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.edit{
  padding-top:80px;
}
h1{
  text-align: center;
  padding-bottom: 20px;
}
</style>
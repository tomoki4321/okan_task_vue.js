<script setup lang="ts">
import {reactive} from 'vue';
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
      messageStore.flash("カテゴリを追加しました。")
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
</script>


<template>
  <div>
    <div>
      <label for="name">タスク名</label>
      <input type="text" id="name" v-model="taskData.name" >
    </div>
    <div>
      <label for="content">内容</label>
      <textarea name="content" id="content" cols="30" rows="5" v-model="taskData.content"></textarea>
    </div>
    <div>
      <label for="limit">期日</label>
      <input type="date" id="limit" v-model="taskData.limit">
    </div>
    <div>
      <label for="priority">優先度</label>
      <select name="priority" id="priority" v-model="taskData.priority">
        <option value="1">高</option>
        <option value="2">中</option>
        <option value="3">低</option>
      </select>
    </div>
    <div>
      <label for="status">ステータス</label>
      <select name="status" id="status" v-model="taskData.status">
        <option value="1">未着手</option>
        <option value="2">未完了</option>
        <option value="3">完了</option>
      </select>
    </div>
    <div>
      <label for="progress">進行度</label>
      <progress id="progress" max="100" v-bind:value="taskData.progress"></progress>
      <input type="text" v-model="taskData.progress">%
    </div>
    <div>
      <label for="label">カテゴリ</label>
       <select name="label" id="label" v-model="taskData.category_id">
        <option value="1">仕事</option>
        <option value="2">趣味</option>
        <option value="3">その他</option>
      </select>
      <button @click.once="labeladd">ラベル追加</button>
    </div>
    <button @click="UpdateTask">タスク更新</button>
    <button @click="ReturnListTodo">一覧に戻る</button>
  </div>
</template>
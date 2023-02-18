<script setup lang="ts">
import {ref,reactive} from 'vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';



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



async function postTask(): Promise<void> {
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
    .post("http://localhost:3000/api/v1/tasks", data,config)
    .then((response) => {
      console.log(response.data);
      router.push({ path: "/todo/index" });
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
      <progress id="progress" max="100" v-bind:value="progressCounter"></progress>
      <input type="text" v-model="taskData.progress">%
    </div>
    <button @click="postTask">タスク登録</button>
    <button @click="ReturnListTodo">一覧に戻る</button>
  </div>
</template>
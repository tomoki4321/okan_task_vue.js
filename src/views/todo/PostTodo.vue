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
const priorityItems =["",1,2,3];
const statusItems =["",1,2,3];



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
  <div class="post">
      <v-card class="mx-auto mt-5" width="800px">
      <v-card-title>
        <h1>新規タスク作成</h1>
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
</template>

<style scoped>
.post{
  padding-top:80px;
}
h1{
  text-align: center;
  padding-bottom: 20px;
}
</style>
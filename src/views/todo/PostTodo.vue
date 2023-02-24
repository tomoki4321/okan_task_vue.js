<script setup lang="ts">
import {ref,reactive} from 'vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';
import { useFlashMessageStore } from "@/stores/flash-message";


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
const messageStore = useFlashMessageStore();




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
    .post("http://18.181.5.22/api/v1/tasks", data,config)
    .then((response) => {
      console.log(response.data);
      router.push({ path: "/todo/index" });
    })
    .catch((error) => {
      console.log(error.response);
      messageStore.flash("必須項目を入力して下さい");
      if(taskData.name == "" && taskData.content == "" && taskData.limit ==""){
        messageStore.flash("タスク名とタスク内容と期限を入力してください");
      }else if(taskData.name == "" && taskData.content == ""){
        messageStore.flash("タスク名とタスク内容を入力してください");
      }else if(taskData.name == "" && taskData.limit == ""){
        messageStore.flash("タスク名と期限を入力してください");
      }else if(taskData.content == "" && taskData.limit == ""){
        messageStore.flash("タスク内容と期限を入力してください");
      }else if(taskData.name == ""){
        messageStore.flash("タスク名を入力してください");
      }else if(taskData.content == ""){
        messageStore.flash("タスク内容を入力してください");
      }else if(taskData.limit ==""){
        messageStore.flash("期限を入力してください");
      }
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
<script setup lang="ts">
import { reactive,computed,ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosResponse } from "axios";
import { useRouter } from "vue-router";
import moment from "moment";

const router =useRouter();
const authStore = useAuthStore();
const index:any = reactive({
  todos: [],
});
const prioritySelectChoise =["","高","中","低"];
const statusSelectChoise =["","未着手","未完了","完了"];
TodoListUp();
async function TodoListUp(): Promise<void> {
  await axios
    .get("http://35.75.39.248/api/v1/tasks", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.todos = response.data;
      console.log(response.data);
    });
}

async function DestroyTodo(id:number): Promise<void> {
  await axios
    .delete(`http://35.75.39.248/api/v1/tasks/${id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      console.log(response.status);
      //再描写
      router.go(0);
    });
}

const changeDate = (date:any) => {
  return moment(date).format("YYYY年MM月DD日");
};

const resetName = ()=>{
  return searchName.value = "";
};

const resetPriority = ()=>{
  return searchPriority.value = "";
};

const resetStatus = ()=>{
  return searchStatus.value = "";
};



const searchName =ref("");
const searchPriority = ref("");
const searchStatus = ref("");

const searchTodoName = computed(()=>{
  let todos:any =[];
  for(let i in index.todos){
    let todo = index.todos[i];
    if(searchName.value !== ""){
      if((todo.name.indexOf(searchName.value) !== -1)){
        todos.push(todo);
      }
    }else{
      return index.todos;
    }
  }
  return todos;
});


const searchTodoPriority = computed(()=>{
  let todos =[];
  for(let i in index.todos){
    let todo = index.todos[i];
    if(searchPriority.value == ""){
      return index.todos;
    }else if(searchPriority.value == "高"){
      if(todo.priority == 1){
        todos.push(todo);
      }
    }else if(searchPriority.value == "中"){
      if(todo.priority == 2){
        todos.push(todo);
      }
    }else{
      if(todo.priority == 3){
        todos.push(todo);
      }
    }
  }
  return todos;
});

const searchTodoStatus = computed(()=>{
  let todos =[];
  for(let i in index.todos){
    let todo = index.todos[i];
    if(searchStatus.value == ""){
      return index.todos;
    }else if(searchStatus.value == "未着手"){
      if(todo.status == 1){
        todos.push(todo);
      }
      // break;
    }else if(searchStatus.value == "未完了"){
      if(todo.status == 2){
        todos.push(todo);
      }
      // break;
    }else{
      if(todo.status == 3){
        todos.push(todo);
      }
      // break;
    }
  }
  return todos;
});

</script>

<template>
  <v-card width="800px" class="mx-auto mt-5">
    <v-card-title>
      <h2>検索</h2>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field v-model="searchName" label="名前で検索"></v-text-field>
        <v-row class="justify-center mb-3" >
          <v-btn color="blue" @click="resetName">名前リセット</v-btn>
        </v-row>
        <v-select name="search_priority" id="search_priority" v-model="searchPriority" :items="prioritySelectChoise" label="優先度で検索"></v-select>
        <v-row class="justify-center mb-3" >
          <v-btn color="blue" @click="resetPriority">優先度リセット</v-btn>
        </v-row>
        <v-select name="search_status" id="search_status" v-model="searchStatus" :items="statusSelectChoise" label="ステータスで検索"></v-select>
        <v-row class="justify-center mb-3">
          <v-btn color="blue"  @click="resetStatus">ステータスリセット</v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
  <h1>タスク一覧</h1>
  <div class="box">
    <table>
      <th>タスク名</th>
      <th>ステータス</th>
      <th>優先度</th>
      <th>期日</th>
      <th>進捗</th>
      <th>詳細</th>
      <th>編集</th>
      <th>削除</th>
      <th>投稿日</th>
      <tr v-for="todo in searchTodoName" :key="todo.id" v-if="searchName !==''">
        <td>
          {{ todo.name }}
        </td>
        <td v-if="todo.status == 1">
          未着手
        </td>
        <td v-if="todo.status == 2">
          未完了
        </td>
        <td v-if="todo.status == 3">
          完了
        </td>
        <td v-if="todo.priority == 1">
          高
        </td>
        <td v-if="todo.priority == 2">
          中
        </td>
        <td v-if="todo.priority == 3">
          低
        </td>
        <td>
          {{ changeDate(todo.limit) }}
        </td>
        <td>
          <progress id="progress" max="100" v-bind:value="todo.progress"></progress>
          <p>{{ todo.progress }}%</p>
        </td>
        <td>
          <RouterLink v-bind:to="{ name: 'show', params: { id: todo.id } }">
            詳細
          </RouterLink>
        </td>
        <td>
          <RouterLink v-bind:to="{ name: 'edit', params: { id: todo.id } }">
            編集
          </RouterLink>
        </td>
        <td>
          <a href="#" @click="DestroyTodo(todo.id)">削除</a>
        </td>
        <td>
          {{ changeDate(todo.created_at) }}
        </td>
      </tr>
      <tr v-for="todo in searchTodoPriority" :key="todo.id" v-else-if="searchPriority !== ''">
        <td>
          {{ todo.name }}
        </td>
        <td v-if="todo.status == 1">
          未着手
        </td>
        <td v-if="todo.status == 2">
          未完了
        </td>
        <td v-if="todo.status == 3">
          完了
        </td>
        <td v-if="todo.priority == 1">
          高
        </td>
        <td v-if="todo.priority == 2">
          中
        </td>
        <td v-if="todo.priority == 3">
          低
        </td>
        <td>
          {{ changeDate(todo.limit) }}
        </td>
        <td>
          <progress id="progress" max="100" v-bind:value="todo.progress"></progress>
          <p>{{ todo.progress }}%</p>
        </td>
        <td>
          <RouterLink v-bind:to="{ name: 'show', params: { id: todo.id } }">
            詳細
          </RouterLink>
        </td>
        <td>
          <RouterLink v-bind:to="{ name: 'edit', params: { id: todo.id } }">
            編集
          </RouterLink>
        </td>
        <td>
          <a href="#" @click="DestroyTodo(todo.id)">削除</a>
        </td>
        <td>
          {{ changeDate(todo.created_at) }}
        </td>
      </tr>
      <tr v-for="todo in searchTodoStatus" :key="todo.id" v-else-if="searchStatus !== ''">
        <td>
          {{ todo.name }}
        </td>
        <td v-if="todo.status == 1">
          未着手
        </td>
        <td v-if="todo.status == 2">
          未完了
        </td>
        <td v-if="todo.status == 3">
          完了
        </td>
        <td v-if="todo.priority == 1">
          高
        </td>
        <td v-if="todo.priority == 2">
          中
        </td>
        <td v-if="todo.priority == 3">
          低
        </td>
        <td>
          {{ changeDate(todo.limit) }}
        </td>
        <td>
          <progress id="progress" max="100" v-bind:value="todo.progress"></progress>
          <p>{{ todo.progress }}%</p>
        </td>
        <td>
          <RouterLink v-bind:to="{ name: 'show', params: { id: todo.id } }">
            詳細
          </RouterLink>
        </td>
        <td>
          <RouterLink v-bind:to="{ name: 'edit', params: { id: todo.id } }">
            編集
          </RouterLink>
        </td>
        <td>
          <a href="#" @click="DestroyTodo(todo.id)">削除</a>
        </td>
        <td>
          {{ changeDate(todo.created_at) }}
        </td>
      </tr>
      <tr v-for="todo in index.todos" :key="todo.id" v-else>
        <td>
          {{ todo.name }}
        </td>
        <td v-if="todo.status == 1">
          未着手
        </td>
        <td v-if="todo.status == 2">
          未完了
        </td>
        <td v-if="todo.status == 3">
          完了
        </td>
        <td v-if="todo.priority == 1">
          高
        </td>
        <td v-if="todo.priority == 2">
          中
        </td>
        <td v-if="todo.priority == 3">
          低
        </td>
        <td>
          {{ changeDate(todo.limit) }}
        </td>
        <td>
          <progress id="progress" max="100" v-bind:value="todo.progress"></progress>
          <p>{{ todo.progress }}%</p>
        </td>
        <td>
          <RouterLink v-bind:to="{ name: 'show', params: { id: todo.id } }">
            詳細
          </RouterLink>
        </td>
        <td>
          <RouterLink v-bind:to="{ name: 'edit', params: { id: todo.id } }">
            編集
          </RouterLink>
        </td>
        <td>
          <a href="#" @click="DestroyTodo(todo.id)">削除</a>
        </td>
        <td>
          {{ changeDate(todo.created_at) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
h1{
  text-align:center;
  margin: 20px;
}
h2{
  text-align: center;
}
table{
  text-align:center;
  border:solid 1px #c0c0c0;
  margin: auto;
}
tr{
  text-align:center;
}
th {
  text-align:center;
  border:solid 1px #c0c0c0;
}
td {
  text-align:center;
  padding:0 40px;
  border:solid 1px #c0c0c0;
}
.box{
  margin:0,auto;
  padding-bottom: 60px;
}


</style>
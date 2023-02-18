<script setup lang="ts">
import { reactive,computed,ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosResponse } from "axios";
import { useRouter } from "vue-router";
import moment from "moment";

const router =useRouter();
const authStore = useAuthStore();
const index = reactive({
  todos: [],
});
TodoListUp();
async function TodoListUp(): Promise<void> {
  await axios
    .get("http://localhost:3000/api/v1/tasks", {
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

async function DestroyTodo(id): Promise<void> {
  await axios
    .delete(`http://localhost:3000/api/v1/tasks/${id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      console.log(response.status);
      //再描写
      router.go({ path: "/todo/index" });
    });
}

const changeDate = (date) => {
  return moment(date).format("YYYY年MM月DD日");
};

const resetName = ()=>{
  return searchName.value = "";
};

const resetPriority = ()=>{
  return searchPriority.value = 1;
};

const resetStatus = ()=>{
  return searchStatus.value = 1;
};



const searchName =ref("");
const searchPriority = ref(1);
const searchStatus = ref(1);

const searchTodoName = computed(()=>{
  let todos =[];
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
    if(searchPriority.value == 1){
      return index.todos;
    }else if(searchPriority.value == 2){
      if(todo.priority == 1){
        todos.push(todo);
      }
    }else if(searchPriority.value == 3){
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
    if(searchStatus.value == 1){
      return index.todos;
    }else if(searchStatus.value == 2){
      if(todo.status == 1){
        todos.push(todo);
      }
      break;
    }else if(searchStatus.value == 3){
      if(todo.status == 2){
        todos.push(todo);
      }
      break;
    }else{
      if(todo.status == 3){
        todos.push(todo);
      }
      break;
    }
  }
  return todos;
});

</script>

<template>
  <h1>タスク一覧</h1>
  <div class="search">
    <h2>検索</h2>
    <label for="search_name">名前で検索</label>
    <input type="text" v-model="searchName">
    <button @click="resetName">名前リセット</button>
    <label for="search_priority">優先度で検索</label>
    <select name="search_priority" id="search_priority" v-model="searchPriority">
      <option value="1"></option>
      <option value="2">高</option>
      <option value="3">中</option>
      <option value="4">低</option>
    </select>
    <button @click="resetPriority">優先度リセット</button>
    <label for="search_status">ステータスで検索</label>
    <select name="search_status" id="search_status" v-model="searchStatus">
      <option value="1"></option>
      <option value="2">未着手</option>
      <option value="3">未完了</option>
      <option value="4">完了</option>
    </select>
    <button @click="resetStatus">ステータスリセット</button>
  </div>
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
      <tr v-for="todo in searchTodoPriority" :key="todo.id" v-else-if="searchPriority !== 1">
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
      <tr v-for="todo in searchTodoStatus" :key="todo.id" v-else-if="searchStatus !== 1">
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
}

</style>
<script setup lang="ts">
import { reactive } from "vue";
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

</script>

<template>
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
      <tr v-for="todo in index.todos" :key="todo.id">
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
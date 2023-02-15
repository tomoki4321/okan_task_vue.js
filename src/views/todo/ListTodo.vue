<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosResponse } from "axios";
import { useRouter } from "vue-router";

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
</script>

<template>
  <h1>タスク一覧</h1>
  <div>
    <ul>
      <li v-for="todo in index.todos" :key="todo.id">
        タスク名:{{ todo.name }}
        タスク内容:{{ todo.content }}
        <RouterLink v-bind:to="{ name: 'show', params: { id: todo.id } }">
          詳細
        </RouterLink>
        <button @click="DestroyTodo(todo.id)">削除</button>
        </li>
    </ul>
  </div>
</template>
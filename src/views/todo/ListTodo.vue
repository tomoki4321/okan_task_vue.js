<script setup lang="ts">
import { reactive,computed,ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosResponse } from "axios";
import { useRouter } from "vue-router";
import moment from "moment";
import { filterByName, type Todo} from "@/stores/filterTodos";



const router =useRouter();
const authStore = useAuthStore();
const index = reactive<{ todos: Todo[] }>({
  todos: [],
});
const prioritySelectChoise =["","高","中","低"];
const statusSelectChoise =["","未着手","未完了","完了"];
TodoListUp();
async function TodoListUp(): Promise<void> {
  await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks`, {
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
    .delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/tasks/${id}`, {
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

// 表示するタスクを1つのcomputedに集約
const displayTodos = computed<Todo[]>(() => {
  if (searchName.value !== "") {
    return filterByName(index.todos, searchName.value);
  }
  if (searchPriority.value !== "") {
    const map: Record<string, number> = { 高: 1, 中: 2, 低: 3 };
    return index.todos.filter((t) => t.priority === map[searchPriority.value]);
  }
  if (searchStatus.value !== "") {
    const map: Record<string, number> = { 未着手: 1, 未完了: 2, 完了: 3 };
    return index.todos.filter((t) => t.status === map[searchStatus.value]);
  }
  return index.todos;
});

// 表示用ラベル・色マッピング
const priorityLabel = (p?: number) => (p === 1 ? "高" : p === 2 ? "中" : "低");
const priorityColor = (p?: number) => (p === 1 ? "red" : p === 2 ? "indigo" : "green");
const statusLabel = (s?: number) => (s === 1 ? "未着手" : s === 2 ? "未完了" : "完了");
const statusColor = (s?: number) => (s === 1 ? "blue-grey" : s === 2 ? "amber" : "teal");
const progressColor = (p?: number) => ((p ?? 0) >= 100 ? "teal" : "blue");

</script>

<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 32px 16px;">
    <!-- 検索カード -->
    <v-card rounded="xl" variant="outlined" class="mb-8">
      <v-card-title class="d-flex align-center ga-3 pt-4">
        <v-avatar rounded="lg" color="blue-lighten-4" size="40">
          <v-icon icon="mdi-magnify" color="blue-darken-2" />
        </v-avatar>
        <span class="text-h6">検索</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="searchName"
          label="名前で検索"
          variant="outlined"
          rounded="lg"
          prepend-inner-icon="mdi-magnify"
          density="comfortable"
          hide-details
          class="mb-2"
        />
        <div class="d-flex justify-end mb-4">
          <v-btn rounded="pill" variant="tonal" color="blue" size="small" @click="resetName">名前リセット</v-btn>
        </div>

        <v-select
          v-model="searchPriority"
          :items="prioritySelectChoise"
          label="優先度で検索"
          variant="outlined"
          rounded="lg"
          density="comfortable"
          hide-details
          class="mb-2"
        />
        <div class="d-flex justify-end mb-4">
          <v-btn rounded="pill" variant="tonal" color="blue" size="small" @click="resetPriority">優先度リセット</v-btn>
        </div>

        <v-select
          v-model="searchStatus"
          :items="statusSelectChoise"
          label="ステータスで検索"
          variant="outlined"
          rounded="lg"
          density="comfortable"
          hide-details
          class="mb-2"
        />
        <div class="d-flex justify-end">
          <v-btn rounded="pill" variant="tonal" color="blue" size="small" @click="resetStatus">ステータスリセット</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- 一覧ヘッダー -->
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-2">
      <div class="d-flex align-center ga-3">
        <v-avatar rounded="lg" color="blue-lighten-4" size="40">
          <v-icon icon="mdi-format-list-checks" color="blue-darken-2" />
        </v-avatar>
        <div>
          <div class="text-h6">タスク一覧</div>
          <div class="text-caption text-medium-emphasis">全 {{ displayTodos.length }} 件</div>
        </div>
      </div>
      <v-btn rounded="pill" color="blue-darken-2" prepend-icon="mdi-plus" :to="{ name: 'post' }">新規タスク</v-btn>
    </div>

    <!-- タスクカード一覧 -->
    <v-card
      v-for="todo in displayTodos"
      :key="todo.id"
      rounded="lg"
      variant="outlined"
      class="mb-3"
    >
      <v-card-text>
        <!-- 1行目：タスク名＋バッジ／操作ボタン -->
        <div class="d-flex align-center ga-3">
          <span
            class="text-subtitle-1 font-weight-medium text-truncate"
            style="flex: 1 1 0; min-width: 0;"
          >
            {{ todo.name }}
          </span>
          <div class="d-flex align-center ga-2 flex-shrink-0">
            <v-chip :color="priorityColor(todo.priority)" size="small" variant="tonal" label>
              優先度 {{ priorityLabel(todo.priority) }}
            </v-chip>
            <v-chip :color="statusColor(todo.status)" size="small" variant="tonal" label>
              {{ statusLabel(todo.status) }}
            </v-chip>
          </div>
          <div class="d-flex align-center ga-1 flex-shrink-0">
            <v-btn icon="mdi-eye-outline" variant="text" size="small" :to="{ name: 'show', params: { id: todo.id } }" />
            <v-btn icon="mdi-pencil-outline" variant="text" size="small" :to="{ name: 'edit', params: { id: todo.id } }" />
            <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="DestroyTodo(todo.id!)" />
          </div>
        </div>

        <!-- 2行目：進捗バー（独立した行） -->
        <v-progress-linear
          :model-value="todo.progress ?? 0"
          :color="progressColor(todo.progress)"
          height="8"
          rounded
          class="mt-4"
        />

        <!-- 3行目：％と期日（バーの下に分離） -->
        <div class="d-flex align-center justify-space-between mt-2">
          <span class="text-body-2 font-weight-medium text-medium-emphasis">
            進捗 {{ todo.progress ?? 0 }}%
          </span>
          <span class="text-caption text-medium-emphasis d-inline-flex align-center ga-1">
            <v-icon icon="mdi-calendar" size="14" />{{ changeDate(todo.limit) }}
          </span>
        </div>
      </v-card-text>
    </v-card>

    <!-- タスクが無いとき -->
    <v-card v-if="displayTodos.length === 0" rounded="lg" variant="outlined" class="pa-8 text-center">
      <v-icon icon="mdi-clipboard-text-outline" size="40" color="grey" class="mb-2" />
      <div class="text-medium-emphasis">該当するタスクがありません</div>
    </v-card>
  </div>
</template>

<style scoped>
</style>
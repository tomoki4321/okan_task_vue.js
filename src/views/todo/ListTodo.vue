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
  <div style="max-width: 720px; margin: 0 auto; padding: 32px 16px;">
    <!-- 検索カード -->
    <v-card rounded="xl" variant="outlined" class="pa-2 mb-6">
      <v-card-title>
        <div style="display: flex; align-items: center; gap: 16px; padding-top: 8px;">
          <v-avatar rounded="lg" color="blue-lighten-4" size="40" style="flex-shrink: 0;">
            <v-icon icon="mdi-magnify" color="blue-darken-2" />
          </v-avatar>
          <span class="text-h6">検索</span>
        </div>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-text-field
          v-model="searchName"
          label="名前で検索"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          :rounded="'xl'"
          class="mb-2"
        />
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
          <v-btn variant="text" color="blue-darken-2" size="small" @click="resetName">名前リセット</v-btn>
        </div>

        <v-select
          v-model="searchPriority"
          :items="prioritySelectChoise"
          label="優先度で検索"
          variant="outlined"
          :rounded="'xl'"
          class="mb-2"
        />
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
          <v-btn variant="text" color="blue-darken-2" size="small" @click="resetPriority">優先度リセット</v-btn>
        </div>

        <v-select
          v-model="searchStatus"
          :items="statusSelectChoise"
          label="ステータスで検索"
          variant="outlined"
          :rounded="'xl'"
          class="mb-2"
        />
        <div style="display: flex; justify-content: flex-end;">
          <v-btn variant="text" color="blue-darken-2" size="small" @click="resetStatus">ステータスリセット</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- 一覧ヘッダー -->
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap" style="gap: 8px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <v-avatar rounded="lg" color="blue-lighten-4" size="40" style="flex-shrink: 0;">
          <v-icon icon="mdi-format-list-checks" color="blue-darken-2" />
        </v-avatar>
        <div>
          <div class="text-h6">タスク一覧</div>
          <div class="text-caption text-medium-emphasis">全 {{ displayTodos.length }} 件</div>
        </div>
      </div>
      <v-btn rounded="pill" color="blue-darken-2" prepend-icon="mdi-plus" :to="{ name: 'post' }">新規タスク</v-btn>
    </div>

    <!-- タスクカード -->
    <v-card
      v-for="todo in displayTodos"
      :key="todo.id"
      rounded="xl"
      variant="outlined"
      class="mb-3 pa-3"
    >
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="flex: 1 1 0; min-width: 0;" class="text-subtitle-1 text-truncate">
          {{ todo.name }}
        </span>
        <div style="display: flex; gap: 8px; flex-shrink: 0;">
          <v-chip :color="priorityColor(todo.priority)" size="small" variant="tonal" label>
            優先度 {{ priorityLabel(todo.priority) }}
          </v-chip>
          <v-chip :color="statusColor(todo.status)" size="small" variant="tonal" label>
            {{ statusLabel(todo.status) }}
          </v-chip>
        </div>
        <div style="display: flex; gap: 2px; flex-shrink: 0;">
          <v-btn :to="{ name: 'show', params: { id: todo.id } }" icon="mdi-eye-outline" variant="text" color="blue-darken-2" size="small" />
          <v-btn :to="{ name: 'edit', params: { id: todo.id } }" icon="mdi-pencil-outline" variant="text" color="blue-darken-2" size="small" />
          <v-btn icon="mdi-trash-can-outline" variant="text" color="error" size="small" @click="DestroyTodo(todo.id!)" />
        </div>
      </div>
      <v-progress-linear
        :model-value="Number(todo.progress) || 0"
        :color="progressColor(todo.progress)"
        height="8"
        rounded
        class="mt-3"
      />
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
        <span class="text-body-2 text-medium-emphasis">進捗 {{ todo.progress || 0 }}%</span>
        <span class="text-body-2 text-medium-emphasis d-inline-flex align-center" style="gap: 4px;">
          <v-icon icon="mdi-calendar" size="16" />{{ changeDate(todo.limit) }}
        </span>
      </div>
    </v-card>
  </div>
</template>

<style scoped></style>
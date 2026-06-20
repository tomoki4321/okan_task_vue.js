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

// 検索条件
const searchName = ref("");
const searchPriority = ref("");
const searchStatus = ref("");
const resetName = () => (searchName.value = "");
const resetPriority = () => (searchPriority.value = "");
const resetStatus = () => (searchStatus.value = "");
// すべての条件をリセット
const resetAll = () => {
  resetName();
  resetPriority();
  resetStatus();
};
const prioritySelectChoise = ["", "高", "中", "低"];
const statusSelectChoise = ["", "未着手", "未完了", "完了"];

// ① 並び替え
const sortOrder = ref("created");
const sortOptions = [
  { value: "created", title: "登録順" },
  { value: "limit_asc", title: "期限が近い順" },
  { value: "priority", title: "優先度が高い順" },
];

// ② 期限切れ判定（今日より前 かつ 完了以外）
const isOverdue = (todo: Todo) => {
  // 期限があって完了以外のタスクのみ通す
  if (!todo.limit || todo.status === 3) return false;
  // 今日より前か
  return moment(todo.limit).isBefore(moment(), "day");
};

// ③ 完了タスクのタブ分け（open:未完了 done:完了）
const activeTab = ref("open"); 

// 名前→優先度→ステータスの順で絞り込み
const filteredTodos = computed(() => {
  if (searchName.value !== "") {
    return filterByName(index.todos, searchName.value);
  }
  if (searchPriority.value !== "") {
    const map: any = { 高: 1, 中: 2, 低: 3 };
    return index.todos.filter((t) => t.priority === map[searchPriority.value]);
  }
  if (searchStatus.value !== "") {
    const map: any = { 未着手: 1, 未完了: 2, 完了: 3 };
    return index.todos.filter((t) => t.status === map[searchStatus.value]);
  }
  return index.todos;
});

// タブで未完了／完了をさらに絞り込み
const tabFilteredTodos = computed(() => {
  if (activeTab.value === "done") {
    return filteredTodos.value.filter((t) => t.status === 3);
  }
  return filteredTodos.value.filter((t) => t.status !== 3);
});

// 並び替えを適用した最終表示リスト
const displayTodos = computed(() => {
  // 並び替え用の配列に元配列をコピー
  const todos = [...tabFilteredTodos.value];
  // 期限が近い順のときaとbを比べてどちらが先か
  if (sortOrder.value === "limit_asc") {
    todos.sort((a, b) => moment(a.limit).valueOf() - moment(b.limit).valueOf());
  // 優先度順のときaとbを比べてどちらが先か
  } else if (sortOrder.value === "priority") {
    todos.sort((a, b) => (a.priority ?? 9) - (b.priority ?? 9));
  }
  return todos;
});

// ④ 今週の締切まとめ（今日〜7日以内、完了以外）
const upcomingTodos = computed(() => {
  const today = moment().startOf("day");
  const weekLater = moment().add(7, "days").endOf("day");
  return index.todos
    .filter((t) => t.status !== 3 && t.limit)
    .filter((t) => {
      const d = moment(t.limit);
      // 今日から１週間以内のタスク
      return d.isSameOrAfter(today) && d.isSameOrBefore(weekLater);
    })
    // 並べ替え
    .sort((a, b) => moment(a.limit).valueOf() - moment(b.limit).valueOf());
});

// ⑤統計カード（ステータス別の件数）
const statusCounts = computed(() => {
  return {
    notStarted: index.todos.filter((t) => t.status === 1).length,
    inProgress: index.todos.filter((t) => t.status === 2).length,
    done: index.todos.filter((t) => t.status === 3).length,
  };
});

// タスクカード左端の色バー（ステータス＋期限切れで色分け）
const barColor = (todo: Todo) => {
  if (todo.status === 3) return "#009688"; // 完了：teal
  if (todo.status === 2) return "#FFB300"; // 未完了：amber
  return "#607D8B"; // 未着手：blue-grey
};

const priorityLabel = (p?: number) => (p === 1 ? "高" : p === 2 ? "中" : "低");
const priorityColor = (p?: number) => (p === 1 ? "red" : p === 2 ? "indigo" : "green");
const statusLabel = (s?: number) => (s === 1 ? "未着手" : s === 2 ? "未完了" : "完了");
const statusColor = (s?: number) => (s === 1 ? "blue-grey" : s === 2 ? "amber" : "teal");
const progressColor = (p?: number) => ((p ?? 0) >= 100 ? "teal" : "blue");
</script>

<template>
  <div style="max-width: 1240px; width: 100%; margin: 0 auto; padding: 32px 16px;">
    <div class="two-col-row" style="display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;">

      <!-- 左カラム -->
      <div class="two-col-left" style="width: 340px; flex-shrink: 0;">
        <!-- 検索カード -->
        <v-card rounded="xl" elevation="3" class="pa-4 mb-4">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <v-avatar rounded="lg" color="blue-lighten-4" size="40" style="flex-shrink: 0;">
              <v-icon icon="mdi-magnify" color="blue-darken-2" />
            </v-avatar>
            <span class="text-h6">検索</span>
          </div>

          <!-- 注意書き -->
          <div class="d-flex align-start mb-4" style="gap: 6px; background-color: #E6F1FB; border-radius: 12px; padding: 10px 12px;">
            <v-icon icon="mdi-information-outline" color="blue-darken-2" size="18" style="flex-shrink: 0; margin-top: 1px;" />
            <span class="text-caption" style="color:#185FA5; line-height: 1.5;">
              検索は1項目ずつです。複数の条件を同時に使うことはできません。
            </span>
          </div>

          <!-- 名前で検索 -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="text-body-2 font-weight-medium">名前で検索</span>
            <span class="text-caption" style="color:#185FA5; cursor:pointer;" @click="resetName">リセット</span>
          </div>
          <v-text-field
            v-model="searchName"
            placeholder="名前を入力"
            variant="outlined"
            :rounded="'xl'"
            density="comfortable"
            hide-details
            class="mb-4"
          />

          <!-- 優先度で検索 -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="text-body-2 font-weight-medium">優先度で検索</span>
            <span class="text-caption" style="color:#185FA5; cursor:pointer;" @click="resetPriority">リセット</span>
          </div>
          <v-select
            v-model="searchPriority"
            :items="prioritySelectChoise"
            placeholder="すべて"
            variant="outlined"
            :rounded="'xl'"
            density="comfortable"
            hide-details
            class="mb-4"
          />

          <!-- ステータスで検索 -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="text-body-2 font-weight-medium">ステータスで検索</span>
            <span class="text-caption" style="color:#185FA5; cursor:pointer;" @click="resetStatus">リセット</span>
          </div>
          <v-select
            v-model="searchStatus"
            :items="statusSelectChoise"
            placeholder="すべて"
            variant="outlined"
            :rounded="'xl'"
            density="comfortable"
            hide-details
            class="mb-4"
          />

          <!-- すべての条件をリセット -->
          <v-btn
            block
            variant="outlined"
            color="blue-darken-2"
            rounded="lg"
            prepend-icon="mdi-filter-variant"
            @click="resetAll"
          >すべての条件をリセット</v-btn>
        </v-card>

        <!-- 今週の締切 -->
        <v-card v-if="upcomingTodos.length > 0" rounded="xl" elevation="3" class="pa-4">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
            <v-icon icon="mdi-calendar-alert" color="amber-darken-2" />
            <span class="text-subtitle-1 font-weight-medium" style="color:#BA7517;">今週の締切</span>
          </div>
          <div
            v-for="todo in upcomingTodos"
            :key="todo.id"
            style="display: flex; justify-content: space-between; align-items: center; padding: 7px 0;"
          >
            <span class="text-body-2 text-truncate" style="max-width: 55%;">{{ todo.name }}</span>
            <span class="text-caption font-weight-medium" style="color:#BA7517;">{{ changeDate(todo.limit) }}</span>
          </div>
        </v-card>
      </div>

      <!-- 右カラム -->
      <div class="two-col-right" style="flex: 1 1 0; min-width: 0;">
        <!-- 統計カード（立体的） -->
        <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 20px;">
          <!-- 未着手 -->
          <v-card rounded="xl" elevation="3" color="blue-lighten-5" class="pa-4">
            <div style="display: flex; align-items: center; gap: 14px;">
              <v-avatar color="blue" size="44" style="flex-shrink: 0;">
                <v-icon icon="mdi-timer-sand" color="white" />
              </v-avatar>
              <div>
                <div class="text-body-2 text-medium-emphasis">未着手</div>
                <div class="text-h5 font-weight-medium">{{ statusCounts.notStarted }}</div>
              </div>
            </div>
          </v-card>
          <!-- 未完了 -->
          <v-card rounded="xl" elevation="3" color="amber-lighten-5" class="pa-4">
            <div style="display: flex; align-items: center; gap: 14px;">
              <v-avatar color="amber-darken-1" size="44" style="flex-shrink: 0;">
                <v-icon icon="mdi-progress-clock" color="white" />
              </v-avatar>
              <div>
                <div class="text-body-2" style="color:#BA7517;">未完了</div>
                <div class="text-h5 font-weight-medium" style="color:#BA7517;">{{ statusCounts.inProgress }}</div>
              </div>
            </div>
          </v-card>
          <!-- 完了 -->
          <v-card rounded="xl" elevation="3" color="teal-lighten-5" class="pa-4">
            <div style="display: flex; align-items: center; gap: 14px;">
              <v-avatar color="teal" size="44" style="flex-shrink: 0;">
                <v-icon icon="mdi-check-circle" color="white" />
              </v-avatar>
              <div>
                <div class="text-body-2" style="color:#0F6E56;">完了</div>
                <div class="text-h5 font-weight-medium" style="color:#0F6E56;">{{ statusCounts.done }}</div>
              </div>
            </div>
          </v-card>
        </div>

        <!-- タスク一覧の大きな枠（ヘッダー＋タブ＋並び順＋タスクカードを全部囲む） -->
        <v-card rounded="xl" elevation="3" class="pa-4">
          <!-- ヘッダー -->
          <div class="d-flex align-center justify-space-between flex-wrap" style="gap: 8px;">
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

          <!-- ライン -->>
          <v-divider class="my-4" :thickness="3" color="black" />

          <!-- タブ -->
          <v-tabs v-model="activeTab" color="blue-darken-2" class="mb-4">
            <v-tab value="open">未完了</v-tab>
            <v-tab value="done">完了</v-tab>
          </v-tabs>

          <!-- 並び替え -->
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <span class="text-body-2 text-medium-emphasis" style="flex-shrink: 0;">並び順</span>
            <v-select
              v-model="sortOrder"
              :items="sortOptions"
              item-title="title"
              item-value="value"
              variant="outlined"
              :rounded="'xl'"
              density="compact"
              hide-details
              style="max-width: 200px;"
            />
          </div>

          <!-- タスクカード（大枠の中、各カードは立体的） -->
          <v-card
            v-for="todo in displayTodos"
            :key="todo.id"
            rounded="lg"
            elevation="2"
            :variant="isOverdue(todo) ? 'tonal' : undefined"
            :color="isOverdue(todo) ? 'red' : undefined"
            class="mb-5"
            style="overflow: hidden;"
          >
            <div style="display: flex;">
              <!-- 左端の色バー（ステータス色） -->
              <div :style="{ width: '5px', flexShrink: 0, backgroundColor: barColor(todo) }"></div>

              <div style="flex: 1 1 0; min-width: 0; padding: 16px 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <v-icon v-if="isOverdue(todo)" icon="mdi-alert-circle" color="red" size="20" style="flex-shrink: 0;" />
                  <span style="flex: 1 1 0; min-width: 0;" class="text-subtitle-1 font-weight-medium text-truncate">
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
                  <span
                    class="text-body-2 d-inline-flex align-center"
                    :class="isOverdue(todo) ? 'text-red font-weight-bold' : 'text-medium-emphasis'"
                    style="gap: 4px;"
                  >
                    <v-icon icon="mdi-calendar" size="16" />{{ changeDate(todo.limit) }}
                  </span>
                </div>
              </div>
            </div>
          </v-card>

          <div v-if="displayTodos.length === 0" class="text-center text-medium-emphasis py-8">
            タスクがありません
          </div>
        </v-card>
        <!-- タスク一覧の大きな枠 終わり -->
      </div>
      <!-- 右カラム終わり -->

    </div>
  </div>
</template>

<style scoped>
@media (max-width: 960px) {
  .two-col-row {
    flex-direction: column !important;
  }
  .two-col-left {
    width: 100% !important;
  }
  .two-col-right {
    width: 100% !important;
  }
}
</style>
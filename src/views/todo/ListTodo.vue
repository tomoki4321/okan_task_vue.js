<script setup lang="ts">
import { reactive,computed,ref, watch } from "vue";
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
      router.go(0); //再描写
    });
}

const changeDate = (date:any) => {
  return moment(date).format("YYYY年MM月DD日");
};

// 検索条件
const searchName = ref("");
const searchPriority = ref("");
const resetName = () => (searchName.value = "");
const resetPriority = () => (searchPriority.value = "");
// すべての条件をリセット
const resetAll = () => {
  resetName();
  resetPriority();
};
const prioritySelectChoise = ["", "高", "中", "低"];

// 並び替え
const sortOrder = ref("created");
const sortOptions = [
  { value: "created", title: "登録順" },
  { value: "limit_asc", title: "期限が近い順" },
  { value: "priority", title: "優先度が高い順" },
];

// 期限切れ判定（今日より前 かつ 完了以外）
const isOverdue = (todo: Todo) => {
  if (!todo.limit || todo.status === 3) return false; // 期限があって完了以外のタスクのみ通す
  return moment(todo.limit).isBefore(moment(), "day"); // 今日より前か
};

// 完了タスクのタブ分け（not_started:未着手 open:未完了 done:完了）
// 直前に選んでいたタブを sessionStorage から復元し、画面を離れても保持する
const activeTab = ref(sessionStorage.getItem("todoActiveTab") || "not_started");

// タブが変わるたびに sessionStorage に保存する
watch(activeTab, (newTab) => {
  sessionStorage.setItem("todoActiveTab", newTab);
});

// 検索（AND）：名前→優先度の順に、入力されている項目だけ絞り込む
const filteredTodos = computed(() => {
  let result = index.todos;

  if (searchName.value !== "") {
    result = filterByName(result, searchName.value);
  }
  if (searchPriority.value !== "") {
    const map: any = { 高: 1, 中: 2, 低: 3 };
    result = result.filter((t) => t.priority === map[searchPriority.value]);
  }
  // カレンダーで日付が選ばれていたら、その日が期日のタスクだけに絞る
  if (selectedDate.value !== null) {
    result = result.filter((t) => t.limit && moment(t.limit).format("YYYY-MM-DD") === selectedDate.value);
  }
  return result;
});

// タブでステータスを絞り込み
const tabFilteredTodos = computed(() => {
  const map: any = { not_started: 1, open: 2, done: 3 };
  const targetStatus = map[activeTab.value];
  return filteredTodos.value.filter((t) => t.status === targetStatus);
});

// 並び替えを適用した最終表示リスト
const displayTodos = computed(() => {
  const todos = [...tabFilteredTodos.value]; // 並び替え用の配列に元配列をコピー
  // 期限が近い順のときaとbを比べてどちらが先か
  if (sortOrder.value === "limit_asc") {
    todos.sort((a, b) => moment(a.limit).valueOf() - moment(b.limit).valueOf());
  // 優先度順のときaとbを比べてどちらが先か
  } else if (sortOrder.value === "priority") {
    todos.sort((a, b) => (a.priority ?? 9) - (b.priority ?? 9));
  }
  return todos;
});

// 今週の締切まとめ（今日〜7日以内、完了以外）
const upcomingTodos = computed(() => {
  const today = moment().startOf("day");
  const weekLater = moment().add(7, "days").endOf("day");
  return index.todos
    .filter((t) => t.status !== 3 && t.limit)
    .filter((t) => {
      const d = moment(t.limit);
      return d.isSameOrAfter(today) && d.isSameOrBefore(weekLater); // 今日から１週間以内のタスク
    })
    .sort((a, b) => moment(a.limit).valueOf() - moment(b.limit).valueOf()); // 並べ替え
});

// 今日の日付（曜日は日本語で表示）
const weekDayLabelsForDate = ["日", "月", "火", "水", "木", "金", "土"];
const todayDate = computed(() => {
  const now = moment();
  return `${now.format("YYYY年MM月DD日")}（${weekDayLabelsForDate[now.day()]}）`;
});

// 統計カード（ステータス別の件数）
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
  return "#E3F2FD"; // 未着手：blue
};

const priorityLabel = (p?: number) => (p === 1 ? "高" : p === 2 ? "中" : "低");
const priorityColor = (p?: number) => (p === 1 ? "red" : p === 2 ? "indigo" : "green");
const statusLabel = (s?: number) => (s === 1 ? "未着手" : s === 2 ? "未完了" : "完了");
const statusColor = (s?: number) => (s === 1 ? "blue-grey" : s === 2 ? "amber" : "teal");
const progressColor = (p?: number) => ((p ?? 0) >= 100 ? "teal" : "blue");

// カレンダー（タスクの期日 limit を基準に表示）
type CalendarCell = { date: moment.Moment; inMonth: boolean; todos: Todo[] };

const calendarMonth = ref(moment().startOf("month")); // 今カレンダーで表示している月

const calendarWeeks = computed(() => {
  const startOfMonth = calendarMonth.value.clone().startOf("month"); //今月の始まり
  const endOfMonth = calendarMonth.value.clone().endOf("month"); //今月の終わり
  const startDate = startOfMonth.clone().startOf("week"); // 月初の週の日曜
  const endDate = endOfMonth.clone().endOf("week"); // 月末の週の土曜

  // 日付文字列 → その日が期日のタスク一覧、の対応表を先に作る
  const todosByDate: Record<string, Todo[]> = {};
  index.todos.forEach((t) => {
    if (!t.limit) return; //期日が設定されていないタスクは無視
    const key = moment(t.limit).format("YYYY-MM-DD"); //
    if (!todosByDate[key]) todosByDate[key] = [];
    todosByDate[key].push(t);
  });

  const weeks: CalendarCell[][] = [];
  let cursor = startDate.clone(); //今どの日付を見ているか
  //日曜から土曜まで繰り返す
  while (cursor.isSameOrBefore(endDate)) {
    const week: CalendarCell[] = [];
    for (let i = 0; i < 7; i++) {
      const key = cursor.format("YYYY-MM-DD");
      week.push({
        date: cursor.clone(),
        inMonth: cursor.month() === calendarMonth.value.month(),
        todos: todosByDate[key] || [],
      });
      cursor.add(1, "day");
    }
    weeks.push(week);
  }
  return weeks;
});

const calendarMonthLabel = computed(() => calendarMonth.value.format("YYYY年MM月"));
const goPrevMonth = () => (calendarMonth.value = calendarMonth.value.clone().subtract(1, "month")); //次の月へ
const goNextMonth = () => (calendarMonth.value = calendarMonth.value.clone().add(1, "month")); //前の月へ
const isToday = (d: moment.Moment) => d.isSame(moment(), "day"); //今日と同じ日か

// カレンダー内のタスク名の色判定（期限切れなら赤、それ以外は青）
const calendarTaskColor = (todo: Todo) => {
  if (todo.status === 3) return "#1D9E75"; // 完了は緑系のままにする場合
  if (moment(todo.limit).isBefore(moment(), "day")) return "#E24B4A"; // 期限切れは赤
  return "#185FA5"; // 通常は青
};

// カレンダーから選んだ日付での絞り込み
const selectedDate = ref<string | null>(null);
const selectDateFilter = (d: moment.Moment) => {
  const key = d.format("YYYY-MM-DD");
  // 同じ日をもう一度クリックしたら絞り込み解除
  selectedDate.value = selectedDate.value === key ? null : key;
};
const clearDateFilter = () => (selectedDate.value = null);
</script>

<template>
  <div style="max-width: 1240px; width: 100%; margin: 0 auto; padding: 32px 16px;">

    <!-- 月間カレンダー（全幅） -->
    <v-card rounded="xl" elevation="3" class="pa-4 mb-6">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <v-btn icon="mdi-chevron-left" variant="text" @click="goPrevMonth" />
        <div style="display: flex; align-items: center; gap: 10px;">
          <v-icon icon="mdi-calendar-month" color="blue-darken-2" />
          <span class="text-h6">{{ calendarMonthLabel }}</span>
        </div>
        <v-btn icon="mdi-chevron-right" variant="text" @click="goNextMonth" />
      </div>

      <!-- 曜日ヘッダー -->
      <div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr));">
        <div
        v-for="(label, i) in weekDayLabelsForDate"
        :key="label"
        class="text-center text-caption font-weight-medium pb-2"
        :style="{ color: i === 0 ? '#E24B4A' : i === 6 ? '#185FA5' : undefined }"
        >{{ label }}</div>
      </div>

      <!-- 日付グリッド -->
      <div v-for="(week, wi) in calendarWeeks" :key="wi" style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr));">
        <div
          v-for="(cell, ci) in week"
          :key="ci"
          style="min-height: 92px; padding: 6px; border-top: 1px solid #ECECEC; border-left: 1px solid #ECECEC; cursor: pointer;"
          :style="{ backgroundColor: selectedDate === cell.date.format('YYYY-MM-DD') ? '#D6E8FB' : isToday(cell.date) ? '#FFF3D6' : undefined }"
          @click="selectDateFilter(cell.date)"
        >
          <div
            class="text-caption"
            :style="{ color: cell.inMonth ? (isToday(cell.date) ? '#185FA5' : undefined) : '#C7C7C7', fontWeight: isToday(cell.date) ? 700 : 400 }"
          >{{ cell.date.date() }}</div>
          <div
            v-for="todo in cell.todos.slice(0, 3)"
            :key="todo.id"
            class="text-caption text-truncate"
            :style="{ color: calendarTaskColor(todo) }"
          >・{{ todo.name }}</div>
          <div v-if="cell.todos.length > 3" class="text-caption" style="color:#999;">
            他 {{ cell.todos.length - 3 }} 件
          </div>
        </div>
      </div>
    </v-card>

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
        <v-card v-if="upcomingTodos.length > 0" rounded="xl" elevation="3" class="pa-4 mb-4">
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

        <!-- 今日の日付 -->
        <v-card rounded="xl" elevation="3" class="pa-4">
          <div style="display: flex; align-items: center; gap: 14px;">
            <v-avatar color="blue-lighten-4" size="44" style="flex-shrink: 0;">
              <v-icon icon="mdi-calendar-today" color="blue-darken-2" />
            </v-avatar>
            <div>
              <div class="text-caption text-medium-emphasis">今日</div>
              <div class="text-subtitle-1 font-weight-medium">{{ todayDate }}</div>
            </div>
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
          <div v-if="selectedDate" class="d-flex align-center justify-space-between mb-4" style="gap: 8px; background-color: #D6E8FB; border-radius: 12px; padding: 10px 14px;">
            <span class="text-body-2">{{ moment(selectedDate).format("YYYY年MM月DD日") }} のタスクのみ表示中</span>
            <v-btn size="small" variant="text" color="blue-darken-2" @click="clearDateFilter">解除</v-btn>
          </div>
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

          <v-divider class="my-4" :thickness="2" color="blue-darken-2" style="opacity: 0.5;" />

          <!-- タブ -->
          <v-tabs v-model="activeTab" color="blue-darken-2" class="mb-4">
            <v-tab value="not_started">未着手</v-tab>
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
                  <v-tooltip v-if="isOverdue(todo)" text="このタスクは期限切れです" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        icon="mdi-alert-circle"
                        color="red"
                        size="20"
                        style="flex-shrink: 0; cursor: help;"
                      />
                    </template>
                  </v-tooltip>
                  <span style="flex: 1 1 0; min-width: 0;" class="text-subtitle-1 font-weight-medium text-truncate">
                    {{ todo.name }}
                  </span>
                  <div style="display: flex; gap: 8px; flex-shrink: 0;">
                    <v-chip :color="priorityColor(todo.priority)" size="small" variant="tonal" label>
                      優先度 {{ priorityLabel(todo.priority) }}
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
<script setup lang="ts">
import { ref, reactive, resolveComponent } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosResponse } from "axios";
import moment from "moment";
import { useRouter } from "vue-router";



interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const taskName = ref("");
const taskContent =ref("");
const taskLimit = ref("");
const taskStatus = ref();
const taskPriority =ref();
const taskProgress = ref();

setShow();
async function setShow(): Promise<void> {
  await axios
    .get(`http://localhost:3000/api/v1/tasks/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      taskName.value = response.data.task.name;
      taskContent.value = response.data.task.content;
      taskLimit.value = response.data.task.limit;
      taskStatus.value = response.data.task.status;
      taskPriority.value = response.data.task.priority;
      taskProgress.value = response.data.task.progress;
    });
}

const router = useRouter();
const changeDate = (date) => {
  return moment(date).format("YYYY年MM月DD日");
};

const ReturnListTodo = ():void=> {
  router.push({ path: "/todo/index" });
};
</script>

<template>
    <div>
      <table>
        <tr>
          <td>タスク名</td>
          <td>{{ taskName }}</td>
        </tr>
        <tr>
          <td>タスク内容</td>
          <td>{{ taskContent }}</td>
        </tr>
        <tr>
          <td>期日</td>
          <td>{{ changeDate(taskLimit) }}</td>
        </tr>
        <tr>
          <td>優先度</td>
          <td v-if="taskPriority == 1">
            高
          </td>
          <td v-if="taskPriority == 2">
            中
          </td>
          <td v-if="taskPriority == 3">
            低
          </td>
        </tr>
        <tr>
          <td>ステータス</td>
          <td v-if="taskStatus == 1">
            未着手
          </td>
          <td v-if="taskStatus == 2">
            未完了
          </td>
          <td v-if="taskStatus == 3">
            完了
          </td>
        </tr>
        <tr>
          <td>進行度</td>
          <td>{{taskProgress }}%<progress id="progress" max="100" v-bind:value="taskProgress"></progress></td>
        </tr>
      </table>
      <button @click="ReturnListTodo">一覧に戻る</button>
  </div>
</template>
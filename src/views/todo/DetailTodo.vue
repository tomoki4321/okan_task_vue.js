<script setup lang="ts">
import { computed, ref } from "vue";
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
const taskCategory =ref();
const propsNumber= props.id as never;

setShow();

async function setShow(): Promise<void> {
  await axios
    .get(`http://35.75.39.248/api/v1/tasks/${props.id}`, {
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

async function setLavel(): Promise<void> {
  await axios
    .get(`http://35.75.39.248/api/v1/tasks/${props.id}/label_find`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },

    })
    .then((response: AxiosResponse<any>) => {
      taskCategory.value=response.data.category.category_id;
      console.log(response.data.category.category_id);
    });
}

const router = useRouter();
const changeDate = (date:any) => {
  return moment(date).format("YYYY年MM月DD日");
};

const ReturnListTodo = ():void=> {
  router.push({ path: "/todo/index" });
};

const labelPossible = computed(()=>{
  if(authStore.labels.includes(propsNumber) == true){
    setLavel();
    return true
  }else{
    return false
  }
});

</script>

<template>
  <div class="show">
      <v-card class="mx-auto mt-5" width="800px">
      <v-card-title>
        <h1>タスク詳細</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
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
            <tr v-if="labelPossible == true" >
              <td>カテゴリ</td>
              <td v-if="taskCategory == 1" >
                仕事
              </td>
              <td v-if="taskCategory == 2" >
                趣味
              </td>
              <td v-if="taskCategory == 3" >
                買い物
              </td>
              <td v-if="taskCategory == 4" >
                アイデア
              </td>
              <td v-if="taskCategory == 5" >
                その他
              </td>
            </tr>
          </table>
          <v-row class="justify-center mt-3">
            <v-btn @click="ReturnListTodo" color="secondary">一覧に戻る</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.show{
  padding-top:80px;
}
h1{
  text-align: center;
  padding-bottom: 20px;
}
</style>
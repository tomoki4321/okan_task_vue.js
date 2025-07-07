<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import axios, { type AxiosResponse } from "axios";
import { useRouter } from "vue-router";
import { useFlashMessageStore } from "@/stores/flash-message";

const authStore = useAuthStore();
const router =useRouter();
const messageStore = useFlashMessageStore();
const index:any = reactive({
  users: [],
});
userListUp();
async function userListUp(): Promise<void> {
  await axios
    .get("http://35.75.39.248/api/v1/admin/users", {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response) => {
      index.users = response.data;
      console.log(response.data);
    });
}

async function DestroyUser(id:number): Promise<void> {
  await axios
    .delete(`http://35.75.39.248/api/v1/admin/users/${id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then(() => {
      messageStore.flash("削除しました");
      router.go(0);
    });
}
</script>

<template>
  <h1>タスク一覧</h1>
  <div class="box">
    <table>
      <th>ユーザー名</th>
      <th>メールアドレス</th>
      <th>権限</th>
      <th>編集</th>
      <th>削除</th>
      <tr v-for="user in index.users" :key="user.id">
        <td>
          {{ user.name }}
        </td>
        <td>
          {{ user.email }}
        </td>
        <td>
          {{ user.admin }}
        </td>
        <td>
          <RouterLink v-bind:to="{ name: 'user_edit', params: { id: user.id } }">
            編集
          </RouterLink>
        </td>
        <td>
          <a href="#" @click="DestroyUser(user.id)">削除</a>
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
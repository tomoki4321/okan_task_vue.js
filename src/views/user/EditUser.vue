<script setup lang="ts">
import {ref,reactive} from 'vue';
import axios,{type AxiosResponse} from 'axios';
import { useAuthStore } from "@/stores/auth";
import { useRouter } from 'vue-router';
import { useFlashMessageStore } from "@/stores/flash-message";

interface Props {
  id: number;
}
const props = defineProps<Props>();
const authStore =useAuthStore();
const messageStore = useFlashMessageStore();
const router = useRouter();
const userData = reactive({
  name: "",
  email: "",
  password: "",
});
ReceiveUser();


async function ReceiveUser(): Promise<void> {
  await axios
    .get(`http://localhost:3000/api/v1/admin/users/${props.id}`, {
      headers: {
        uid: authStore.uid,
        "access-token": authStore.access_token,
        client: authStore.client,
      },
    })
    .then((response: AxiosResponse<any>) => {
      userData.name=response.data.user.name,
      userData.email=response.data.user.email,
      console.log(response.data);
    });
}

async function UpdateUser(): Promise<void> {
  const data = {
    user: {
      name: userData.name,
      email: userData.email,
      password: userData.password
    }
  };
  const config = {
    headers: {
      uid: authStore.uid,
      "access-token": authStore.access_token,
      client: authStore.client,
    },
  };
  await axios
    .put(`http://localhost:3000/api/v1/admin/users/${props.id}`, data,config)
    .then((response) => {
      console.log(response.data);
      messageStore.flash("更新しました！")
      router.push({ path: "/user/index" });
    });
}

const ReturnListUser = ():void=> {
  router.push({ path: "/user/index" });
};
</script>


<template>
  <div>
    <div>
      <label for="name">ユーザー名</label>
      <input type="text" id="name" v-model="userData.name" >
    </div>
    <div>
      <label for="content">メールアドレス</label>
      <input type="email" id="email" v-model="userData.email" >
    </div>
    <div>
      <label for="limit">パスワード</label>
      <input type="password" id="password" v-model="userData.password">
    </div>
    <button @click="UpdateUser">更新</button>
    <button @click="ReturnListUser">一覧に戻る</button>
  </div>
</template>
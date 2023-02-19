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
  <div class="edit">
      <v-card class="mx-auto mt-5" width="800px">
      <v-card-title>
        <h1>ユーザー編集</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="ユーザー名" v-model="userData.name"/>
          <v-text-field label="メールアドレス" v-model="userData.email"/>
          <v-text-field label="パスワード" v-model="userData.password" placeholder="******************"/>
          <v-row class="justify-center mb-3">
            <v-btn @click="UpdateUser" class="mr-4" color="secondary">更新</v-btn>
            <v-btn @click="ReturnListUser" class="mr-4" color="secondary">一覧に戻る</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.edit{
  padding-top:80px;
}
h1{
  text-align: center;
  padding-bottom: 20px;
}
</style>
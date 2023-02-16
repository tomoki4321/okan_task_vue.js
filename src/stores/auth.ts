import { defineStore } from "pinia";
import axios, { type AxiosResponse } from "axios";
import router from "@/router";
import { useFlashMessageStore } from "@/stores/flash-message";


export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    uid: localStorage.getItem("uid"),
    access_token: localStorage.getItem("access-token"),
    client: localStorage.getItem("client"),
    returnUrl: null,
  }),
  actions: {
    async signup(
      name: string,
      email: string,
      password: string,
      password_confirmation: string
    ): Promise<void> {
      const messageStore = useFlashMessageStore();
      try {
        await axios
          .post("http://localhost:3000/api/v1/auth", {
            name: name,
            email: email,
            password: password,
            password_confirmation: password_confirmation
          })
          .then((response: AxiosResponse<any>) => {
            localStorage.setItem("uid", response.headers["uid"]);
            localStorage.setItem("client", response.headers["client"]);
            localStorage.setItem("access-token",response.headers["access-token"]);
            this.uid = response.headers["uid"];
            this.client = response.headers["client"];
            this.access_token = response.headers["access-token"];
            console.log("status:", response.status);
            messageStore.flash("新規登録に成功しました！");
            router.push({ path: "/todo/index" });
          });
      } catch (error: any) {
        console.log(error);
        messageStore.flash(error.response.data.errors.full_messages);
      }
    },
    async login(email: string, password: string): Promise<void> {
      const messageStore = useFlashMessageStore();
      try {
        await axios
          .post("http://localhost:3000/api/v1/auth/sign_in", {
            email: email,
            password: password,
          })
          .then((response) => {
            localStorage.setItem("uid", response.headers["uid"]);
            localStorage.setItem("client", response.headers["client"]);
            localStorage.setItem("access-token",response.headers["access-token"]);
            this.uid = response.headers["uid"];
            this.client = response.headers["client"];
            this.access_token = response.headers["access-token"];
            console.log("status:", response.status);
            messageStore.flash("ログインに成功しました！");
            router.push({ path: "/todo/index" });
          });
      } catch (error:any) {
        console.log(error);
        messageStore.flash(error.response.data.errors[0]);
      }
    },
    async logout(): Promise<void> {
      await axios.delete("http://localhost:3000/api/v1/auth/sign_out", {
        headers: {
          uid: this.uid,
          "access-token": this.access_token,
          client: this.client,
        },
      });
      // localStorage.removeItem("access-token");
      // localStorage.removeItem("uid");
      // localStorage.removeItem("client");
      this.access_token = null;
      this.client = null;
      this.uid = null;
    },
    async guest_login(): Promise<void> {
      const messageStore = useFlashMessageStore();
      try {
        await axios
          .post("http://localhost:3000/api/v1/auth/guest_sign_in", {})
          .then((response) => {
            localStorage.setItem("uid", response.headers["uid"]);
            localStorage.setItem("client", response.headers["client"]);
            localStorage.setItem("access-token",response.headers["access-token"]);
            this.uid = response.headers["uid"];
            this.client = response.headers["client"];
            this.access_token = response.headers["access-token"];
            console.log("status:", response.status);
            messageStore.flash("ログインに成功しました！");
            router.push({ path: "/todo/index" });
          });
      } catch (error: any) {
        console.log(error.response.status);
        messageStore.flash(error.response.data.errors[0]);
      }
    },
    async admin_login(): Promise<void> {
      const messageStore = useFlashMessageStore();
      try {
        await axios
          .post("http://localhost:3000/api/v1/auth/admin_sign_in", {})
          .then((response) => {
            localStorage.setItem("uid", response.headers["uid"]);
            localStorage.setItem("client", response.headers["client"]);
            localStorage.setItem("access-token",response.headers["access-token"]);
            this.uid = response.headers["uid"];
            this.client = response.headers["client"];
            this.access_token = response.headers["access-token"];
            console.log("status:", response.status);
            messageStore.flash("ログインに成功しました！");
            router.push({ path: "/todo/index" });
          });
      } catch (error: any) {
        console.log(error.response.status);
        messageStore.flash(error.response.data.errors[0]);
      }
    },
    isAuthencated(): boolean {
      return !!this.client;
    },
  },
});
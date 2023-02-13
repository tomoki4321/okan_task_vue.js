import { defineStore } from "pinia";
import axios, { type AxiosResponse } from "axios";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    uid: localStorage.getItem("uid"),
    access_token: localStorage.getItem("access-token"),
    client: localStorage.getItem("client"),
    // returnUrl: null,
  }),
  actions: {
    async signup(
      name: string,
      email: string,
      password: string,
      password_confirmation: string
    ): Promise<void> {
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
          });
      } catch (error) {
        console.log(error);
      }
    },
    async login(email: string, password: string): Promise<void> {
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
          });
      } catch (error) {
        console.log(error);
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
    isAuthencated(): boolean {
      return !!this.client;
    },
  },
});
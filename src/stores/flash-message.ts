import { defineStore } from "pinia";
import { ref } from "vue";

export const useFlashMessageStore = defineStore("message", () => {
  const text = ref("");
  function flash(this: any, message: string): void {
    this.text = message;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      this.text = "";
    }, 5000);
  }
  return { text, flash };
});
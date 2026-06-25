import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    logout() {
      this.user = null;
      this.token = null;
    },
  },
});

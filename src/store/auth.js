import { defineStore } from "pinia"
import { fetchDashboardData } from "@/api/dashboard"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    partner: null,
  }),

  actions: {
    async loadPartner() {
      const res = await fetchDashboardData()
      this.partner = res.data.data.dashboard_data
      //console.log("Partner loaded:", res.data.data.dashboard_data)
    },

    logout() {
      localStorage.removeItem("token")
      this.partner = null
    }
  }
})

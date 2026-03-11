import { defineStore } from "pinia"
import { fetchInvestmentData } from "@/api/investment"

export const useInvStore = defineStore("investment", {
  state: () => ({
    investments: null,
  }),

  actions: {
    async loadInvestment() {
      const res = await fetchInvestmentData()
      this.investments = res.data.data
      //console.log("investment loaded:", res.data.data)
    },
  }
})

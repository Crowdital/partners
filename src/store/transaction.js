import { defineStore } from "pinia"
import { fetchDashboardData } from "@/api/dashboard"
//import { fetchTransactionData } from "@/api/transaction"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    partner: null,
    products: []
  }),

  actions: {
    async loadPartner() {
      const res = await fetchDashboardData()
      this.partner = res.data.data.dashboard_data
      //console.log("Partner loaded:", res.data.data.dashboard_data)
    },

    // async loadTransaction() {
    //     const res = await fetchTransactionData()
    // }

    // async loadProducts() {
    //   try {
    //     const res = await fetchProductData()
    //     this.products = res.data.data.products || []
    //     //console.log("Products loaded:", res.data.data.products)
    //   } catch (error) {
    //     console.error("Failed to load products:", error)
    //     this.products = []
    //   }
    // },

    // logout() {
    //   localStorage.removeItem("token")
    //   this.partner = null
    //   this.products = []
    // }
  }
})

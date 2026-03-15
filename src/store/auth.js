import { defineStore } from "pinia"
import { fetchDashboardData } from "@/api/dashboard"
import { fetchDashboardStat } from "@/api/dashboard"
import { fetchProductData } from "@/api/product"
import { fetchSingleProductData } from "@/api/product"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    partner: null,
    products: [],
    singleProduct: null,
    stat: []
  }),

  actions: {
    async loadPartner() {
      const res = await fetchDashboardData()
      this.partner = res.data.data.dashboard_data
      //console.log("Partner loaded:", res.data.data.dashboard_data)
    },

    async loadPartnerStat() {
      const res = await fetchDashboardStat()
      this.stat = res.data.data
    },

    async loadProducts() {
      try {
        const res = await fetchProductData()
        this.products = res.data.data.products || []
        //console.log("Products loaded:", res.data.data)
      } catch (error) {
        console.error("Failed to load products:", error)
        this.products = []
      }
    },

    async loadSingleProduct(id) {
      try {
        const res = await fetchSingleProductData(id)
        this.singleProduct = res.data.data
        console.log(res.data.data)
      } catch (error) {
        console.error("Failed to load product:", error)
      }
    },

    logout() {
      localStorage.removeItem("token")
      this.partner = null
      this.products = []
      
    }
  }
})

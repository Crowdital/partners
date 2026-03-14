import { defineStore } from "pinia"
import { fetchTransactionData } from "@/api/transaction"

export const useTransactStore = defineStore("transaction", {
  state: () => ({
    transactions: null,
  }),

  actions: {
    async loadTransaction() {
      const res = await fetchTransactionData()
      this.transactions = res.data.data
      console.log("Transaction loaded:", res.data.data)
    },
  }
})

import { defineStore } from "pinia"
import { fetchTransactionData } from "@/api/transaction"
import { executeWithdrawFunds } from "@/api/transaction"

export const useTransactStore = defineStore("transaction", {
  state: () => ({
    transactions: null,
    withdraw: null
  }),

  actions: {
    async loadTransaction() {
      const res = await fetchTransactionData()
      this.transactions = res.data.data
      //console.log("Transaction loaded:", res.data.data)
    },
    async withdrawFunds(){
      const res = await executeWithdrawFunds()
      //this.withdraw = res.data.data
      console.log("Transaction loaded:", res.data.data)
    }
  }
})

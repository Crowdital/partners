import { defineStore } from "pinia"
import { fetchTransactionData } from "@/api/transaction"
import { executeWithdrawFunds } from "@/api/transaction"
import { getWalletTransaction } from "@/api/transaction"

export const useTransactStore = defineStore("transaction", {
  state: () => ({
    transactions: [],
    withdraw: null,
    walletTr: []
  }),

  actions: {
    async loadTransaction() {
      const res = await fetchTransactionData()
      this.transactions = res.data.data
    },
    async loadWalletTransaction() {
      const res = await getWalletTransaction()
      this.walletTr = res.data.data
    },
    async withdrawFunds(){
      const res = await executeWithdrawFunds()
      this.withdraw = res.data.data
    }
  }
})

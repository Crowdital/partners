import http from "./http";

export const fetchTransactionData = () => http.get("/partners/transactions");
export const executeWithdrawFunds = (credentials) => http.post("/partners/transactions/withdraw", credentials)
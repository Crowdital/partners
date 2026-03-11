import http from "./http";

export const fetchTransactionData = () => http.get("/partners/transactions");
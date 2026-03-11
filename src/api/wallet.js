import http from "./http";

export const fetchWalletData = () => http.get("/partners/wallets");
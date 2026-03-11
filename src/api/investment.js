import http from "./http";

export const fetchInvestmentData = () => http.get("/partners/investments");
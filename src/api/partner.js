import http from "./http";

export const fetchPartnerInvestments = () =>
  http.get("/admin/investments/partners");

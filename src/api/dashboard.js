
import http from "./http";

export const fetchDashboardData = () => http.get("/partners/dashboard"); // returns dashboard info for logged-in partner
export const fetchDashboardStat = () => http.get("/partners/dashboard/stat");

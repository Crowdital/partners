import http from "./http";

export const fetchProductData = () => http.get("/partners/products");
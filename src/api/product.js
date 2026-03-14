import http from "./http";

export const fetchProductData = () => http.get("/partners/products");
export const fetchSingleProductData = (id) => http.get(`/partners/products/${id}`)

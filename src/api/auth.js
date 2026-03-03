import http from "./http";

export const login = (credentials) => {
  return http.post("/partners/auth/login", credentials);
};

export const logout = (credentials) => {
  return http.post("/partners/auth/logout", credentials);
};
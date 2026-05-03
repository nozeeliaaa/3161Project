import apiClient from "./apiClient";

export async function login(credentials) {
  const { data } = await apiClient.post("/login", credentials);
  return data;
}

export async function register(payload) {
  const { data } = await apiClient.post("/register", payload);
  return data;
}

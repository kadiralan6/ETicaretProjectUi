import axios from "axios";

/**
 * İstemci tarafı axios instance — BFF route handler'larına istek atar.
 * Client componentler bu instance'ı kullanarak /api/* endpoint'lerine çağrı yapar.
 * Asla doğrudan backend'e istek atılmaz.
 */
const nextApiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — oturum sonlandırma algılama
nextApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.code === "SessionTerminated") {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:error"));
      }
    }
    return Promise.reject(error);
  }
);

export default nextApiClient;

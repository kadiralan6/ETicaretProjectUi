import "server-only";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/providers/AuthProvider";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(async (config) => {
  if (!config.skipAuth) {
    const session = await getServerSession(authOptions) as any;
    if (session?.accessToken?.token) {
      config.headers.Authorization = `Bearer ${session.accessToken.token}`;
    }
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
});

export default httpClient;

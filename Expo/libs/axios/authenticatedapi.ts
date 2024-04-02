import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const authenticatedApi = axios.create({
  baseURL: BACKEND_URL,
});

export const useSetupAuthenticatedApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = authenticatedApi.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        config.headers["Content-Type"] = "application/json";
        config.headers["mode"] = "cors";
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      authenticatedApi.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);
};

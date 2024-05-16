import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { api } from "./api";

export const useSetupAuthenticatedApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
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
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);
};

import { getCookie, setCookie } from "@/services/auth/tokenHandlers";
import { envVariables } from "./env";

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let refreshPromise: Promise<string | null> | null = null;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getCookie("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(
      `${envVariables.BASE_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const result = await response.json();

    if (result.success && result.data?.accessToken) {
      await setCookie("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return result.data.accessToken;
    }

    throw new Error("Invalid refresh token response");
  } catch (error) {
    // Clear tokens if refresh fails
    await setCookie("accessToken", "", { maxAge: 0, path: "/" });
    await setCookie("refreshToken", "", { maxAge: 0, path: "/" });
    throw error;
  }
};

const serverFetchHelper = async (
  endpoint: string,
  options: RequestInit,
  retryCount = 0
): Promise<Response> => {
  const { headers = {}, ...restOptions } = options;
  const accessToken = await getCookie("accessToken");

  const makeRequest = async (token: string | null): Promise<Response> => {
    const requestHeaders: Record<string, string> = {};

    // Add custom headers
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        requestHeaders[key] = String(value);
      }
    });

    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Handle FormData vs JSON
    if (!(restOptions.body instanceof FormData)) {
      if (restOptions.body && !requestHeaders["Content-Type"]) {
        requestHeaders["Content-Type"] = "application/json";
      }
    }

    const response = await fetch(`${envVariables.BASE_API_URL}${endpoint}`, {
      headers: requestHeaders,
      ...restOptions,
      credentials: "include",
    });

    // Check for token expiration (401)
    if (response.status === 401 && token && retryCount < 1) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken()
          .then((newToken) => {
            processQueue(null, newToken);
            return newToken;
          })
          .catch((error) => {
            processQueue(error, null);
            throw error;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      // Queue this request
      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({
          resolve: async (newToken) => {
            if (newToken) {
              // Retry with new token
              try {
                const retryResponse = await serverFetchHelper(
                  endpoint,
                  options,
                  retryCount + 1
                );
                resolve(retryResponse);
              } catch (retryError) {
                reject(retryError as Error);
              }
            } else {
              reject(new Error("Failed to refresh token"));
            }
          },
          reject: (error) => reject(error),
        });
      });
    }

    return response;
  };

  return makeRequest(accessToken);
};

export const serverFetch = {
  get: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "GET" }),

  post: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "POST" }),

  put: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PUT" }),

  patch: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

  delete: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "DELETE" }),

  // Raw fetch for special cases
  raw: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    fetch(`${envVariables.BASE_API_URL}${endpoint}`, options),
};

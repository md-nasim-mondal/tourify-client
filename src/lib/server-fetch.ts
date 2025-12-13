/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie, setCookie } from "@/services/auth/tokenHandlers";
import { parse } from "cookie";
import { envVariables } from "./env";

// Define a custom options type to include our accessToken
interface FetchOptions extends RequestInit {
  accessToken?: string;
}

class FetchError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = "FetchError";
  }
}

let isRefreshing = false;
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
          Cookie: `refreshToken=${refreshToken}`,
        },
      }
    );

    // Verify response OK
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Refresh token failed:", error);
      await setCookie("accessToken", "", { maxAge: -1, path: "/" });
      await setCookie("refreshToken", "", { maxAge: -1, path: "/" });
      throw new Error(`Failed to refresh token: ${response.status}`);
    }

    const result = await response.json();
    const setCookieHeaders = response.headers.getSetCookie();
    let accessTokenObject: any = null;

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);
        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
      });
    }

    if (result.success && result.data?.accessToken && accessTokenObject) {
      await setCookie("accessToken", accessTokenObject.accessToken, {
        secure: true,
        httpOnly: true,
        maxAge: parseInt(accessTokenObject["Max-Age"]) || 1000 * 60 * 60 * 24,
        sameSite: (accessTokenObject["SameSite"] as any) || "None",
        path: accessTokenObject.Path || "/",
      });

      return result.data.accessToken;
    }

    throw new Error("Invalid refresh token response");
  } catch (error) {
    console.error("Token refresh error:", error);
    await setCookie("accessToken", "", { maxAge: -1, path: "/" });
    await setCookie("refreshToken", "", { maxAge: -1, path: "/" });
    throw error;
  }
};

const serverFetchHelper = async (
  endpoint: string,
  options: FetchOptions,
  retryCount = 0
): Promise<Response> => {
  const { headers = {}, accessToken: optionsToken, ...restOptions } = options;

  const makeRequest = async (token: string | null): Promise<Response> => {
    const requestHeaders: Record<string, string> = {};
    let requestBody: RequestInit["body"] = restOptions.body;
    const finalRestOptions = { ...restOptions };

    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        requestHeaders[key] = String(value);
      }
    });

    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
      requestHeaders["Cookie"] = `accessToken=${token}`;
    }

    if (
      !(requestBody instanceof FormData) &&
      requestBody &&
      !requestHeaders["Content-Type"]
    ) {
      requestHeaders["Content-Type"] = "application/json";
    }

    if (
      requestHeaders["Content-Type"] === "application/json" &&
      typeof requestBody === "object" &&
      requestBody !== null &&
      !(requestBody instanceof FormData)
    ) {
      requestBody = JSON.stringify(requestBody);
    }

    const response = await fetch(`${envVariables.BASE_API_URL}${endpoint}`, {
      headers: requestHeaders,
      body: requestBody,
      ...finalRestOptions,
    });

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

      return new Promise<Response>((resolve, reject) => {
        failedQueue.push({
          resolve: async (newToken) => {
            if (newToken) {
              try {
                const retryResponse = await serverFetchHelper(
                  endpoint,
                  { ...options, accessToken: newToken },
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

  const token = optionsToken || (await getCookie("accessToken"));
  return makeRequest(token);
};

export const serverFetch = {
  get: async (endpoint: string, options: FetchOptions = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "GET" }),

  post: async (
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "POST" }),

  put: async (endpoint: string, options: FetchOptions = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PUT" }),

  patch: async (
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

  delete: async (
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "DELETE" }),

  raw: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    fetch(`${envVariables.BASE_API_URL}${endpoint}`, options),
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie, setCookie } from "@/services/auth/tokenHandlers";
import { envVariables } from "./env";

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
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const result = await response.json();

    if (result.success && result.data?.accessToken) {
      await setCookie("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || true, // Force secure if sameSite is none. Since we're explicitly setting sameSite: "none" here, secure must be true.
        sameSite: "none", // Set to none to allow cross-site POST requests
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        // domain: process.env.NODE_ENV === "development" ? "localhost" : undefined, // Specify domain for consistency
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
    let requestBody: RequestInit["body"] = restOptions.body; // Initialize with original body
    const finalRestOptions = { ...restOptions }; // Create a mutable copy of restOptions

    // Add custom headers
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        requestHeaders[key] = String(value);
      }
    });

    if (token) {
      // requestHeaders["Authorization"] = `${token}`; // If using Authorization header
      requestHeaders["Cookie"] = `accessToken=${token}`; // Add accessToken to Cookie header
    }

    // Determine Content-Type
    if (
      !(requestBody instanceof FormData) &&
      requestBody &&
      !requestHeaders["Content-Type"]
    ) {
      requestHeaders["Content-Type"] = "application/json";
    }

    const isJsonContentType =
      requestHeaders["Content-Type"] === "application/json";

    // If Content-Type is application/json and requestBody is an object (not FormData, null)
    // then stringify it first before attempting to parse/modify.
    if (
      isJsonContentType &&
      typeof requestBody === "object" &&
      requestBody !== null &&
      !(requestBody instanceof FormData)
    ) {
      try {
        requestBody = JSON.stringify(requestBody);
      } catch (e) {
        console.error("Failed to stringify JSON body:", e);
        // If stringification fails, proceed with original body.
      }
    }

    // Now, if requestBody is a string and Content-Type is JSON, attempt to modify 'duration'
    if (isJsonContentType && typeof requestBody === "string") {
      try {
        const parsedBody = JSON.parse(requestBody);
        let modified = false;

        // Check for 'duration' at the top level
        if (
          parsedBody &&
          typeof parsedBody === "object" &&
          typeof parsedBody.duration === "number"
        ) {
          parsedBody.duration = String(parsedBody.duration);
          modified = true;
        }

        // Check for 'duration' nested under a 'body' property (as per error path)
        if (
          parsedBody &&
          typeof parsedBody === "object" &&
          parsedBody.body &&
          typeof parsedBody.body === "object" &&
          typeof parsedBody.body.duration === "number"
        ) {
          parsedBody.body.duration = String(parsedBody.body.duration);
          modified = true;
        }

        if (modified) {
          requestBody = JSON.stringify(parsedBody);
        }
      } catch (e) {
        console.error("Failed to parse or modify JSON body:", e);
      }
    }

    // Ensure the original body from restOptions is not duplicated in fetch call
    if (restOptions.body && requestBody !== restOptions.body) {
      delete finalRestOptions.body;
    }

    const response = await fetch(`${envVariables.BASE_API_URL}${endpoint}`, {
      headers: requestHeaders,
      body: requestBody, // Use the potentially modified requestBody
      ...finalRestOptions, // Contains all other original options EXCEPT body
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
                // Pass the original 'options' to retain method, endpoint, etc.
                const retryResponse = await serverFetchHelper(
                  endpoint,
                  { ...options, body: requestBody }, // Ensure retried request has the modified body
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

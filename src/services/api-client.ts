import { useAuthStore } from "@/store/auth-store";

const BASE_URL = "https://dummyjson.com";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function rawRequest(path: string, options: RequestOptions = {}) {
  const { accessToken } = useAuthStore.getState();
  const { skipAuth, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
    ...(skipAuth || !accessToken
      ? {}
      : { Authorization: `Bearer ${accessToken}` }),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  return res;
}

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, setAccessToken, clearSession } =
    useAuthStore.getState();

  if (!refreshToken) {
    clearSession();
    throw new ApiError("No refresh token available", 401, null);
  }

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
  });

  if (!res.ok) {
    clearSession();
    throw new ApiError("Session expired, please log in again", 401, null);
  }

  const data = await res.json();
  setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  let res = await rawRequest(path, options);

  // when the access token is expired, try to refresh it and retry the request
  if (res.status === 401 && !options.skipAuth) {
    await refreshAccessToken();
    res = await rawRequest(path, options);
  }

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // ignore JSON parsing errors
    }
    throw new ApiError(
      `Request failed with status ${res.status}`,
      res.status,
      body
    );
  }

  return res.json() as Promise<T>;
}

export { ApiError };
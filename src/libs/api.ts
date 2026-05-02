import { getToken } from "./cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  fullResponse?: boolean;
}

interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiResponse<T> {
  data: T;
  headers: Headers;
}

// Overload for full response
export async function apiFetch<T>(
  endpoint: string, 
  options: FetchOptions & { fullResponse: true }
): Promise<ApiResponse<T>>;

// Overload for simple data response (default)
export async function apiFetch<T>(
  endpoint: string, 
  options?: FetchOptions & { fullResponse?: false }
): Promise<T>;

// Implementation
export async function apiFetch<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T | ApiResponse<T>> {
  const { params, fullResponse, ...rest } = options;
  
  let urlPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!urlPath.startsWith('/api/v1')) {
    urlPath = `/api/v1${urlPath}`;
  }
  
  const url = new URL(`${API_BASE_URL}${urlPath}`);
  
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const token = await getToken();

  const headers = new Headers(rest.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!(rest.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url.toString(), {
    ...rest,
    headers,
  });

  const body = (await response.json().catch(() => ({}))) as BackendResponse<T>;

  if (!response.ok || body.success === false) {
    throw new Error(body.message || `HTTP error! status: ${response.status}`);
  }

  // Unwrap the data property from the backend response wrapper
  const unwrappedData = body.data;

  if (fullResponse) {
    return { data: unwrappedData, headers: response.headers } as ApiResponse<T>;
  }

  return unwrappedData as T;
}

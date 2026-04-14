const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

type RequestOptions = RequestInit & {
  token?: string;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { token, headers, ...rest } = options;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const api = {
  get: <T>(path: string, token?: string) => request<T>(path, { method: "GET", token }),
  post: <T, B = unknown>(path: string, body?: B, token?: string) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}), token }),
  put: <T, B = unknown>(path: string, body?: B, token?: string) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}), token }),
  del: <T>(path: string, token?: string) => request<T>(path, { method: "DELETE", token }),
};


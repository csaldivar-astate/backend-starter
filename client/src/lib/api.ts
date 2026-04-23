type JsonBody = Record<string, unknown> | unknown[];

export interface ApiResponse<T = void> {
  ok: boolean;
  status: number;
  data: T;
}

async function request<T = void>(
  method: string,
  path: string,
  body?: JsonBody
): Promise<ApiResponse<T>> {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  const contentType = res.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json')
    ? ((await res.json()) as T)
    : (undefined as T);

  return { ok: res.ok, status: res.status, data };
}

export const api = {
  get: <T = void>(path: string) => request<T>('GET', path),
  post: <T = void>(path: string, body?: JsonBody) => request<T>('POST', path, body),
  put: <T = void>(path: string, body?: JsonBody) => request<T>('PUT', path, body),
  patch: <T = void>(path: string, body?: JsonBody) => request<T>('PATCH', path, body),
  del: <T = void>(path: string) => request<T>('DELETE', path)
};

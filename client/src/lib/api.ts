type JsonBody = Record<string, unknown> | unknown[];

async function request<T = unknown>(
  method: string,
  path: string,
  body?: JsonBody
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return undefined as T;
}

export const api = {
  get: <T = unknown>(path: string) => request<T>('GET', path),
  post: <T = unknown>(path: string, body?: JsonBody) => request<T>('POST', path, body),
  put: <T = unknown>(path: string, body?: JsonBody) => request<T>('PUT', path, body),
  patch: <T = unknown>(path: string, body?: JsonBody) => request<T>('PATCH', path, body),
  del: <T = unknown>(path: string) => request<T>('DELETE', path)
};

const DEFAULT_API_BASE_URL = 'https://footwork-anaconda-unwind.ngrok-free.dev';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');

const toApiUrl = (path: string) => `${API_BASE_URL}${path}`;

interface RequestJsonOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | Record<string, unknown> | null;
}

export async function requestJson<T>(path: string, options: RequestJsonOptions = {}): Promise<T> {
  const body = options.body && typeof options.body === 'object' && !(options.body instanceof FormData)
    ? JSON.stringify(options.body)
    : options.body;
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');
  headers.set('ngrok-skip-browser-warning', 'true');

  if (body && typeof body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(toApiUrl(path), {
    ...options,
    body,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

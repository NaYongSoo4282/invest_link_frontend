const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

const toApiUrl = (path: string) => `${API_BASE_URL}${path}`;

export async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(toApiUrl(path), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

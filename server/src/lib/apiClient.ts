const DEFAULT_API_BASE_URL = 'https://api-stag.zappyhealth.com/api/v1';
const API_BASE_URL = process.env.ZAPPY_API_BASE_URL || DEFAULT_API_BASE_URL;
const API_KEY = process.env.ZAPPY_API_KEY || '';

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

function buildHeaders(options: RequestOptions): Headers {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
  }

  if (API_KEY) {
    headers.set('X-API-KEY', API_KEY);
  }

  if (!options.skipAuth && options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  return headers;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = buildHeaders(options);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  const body = contentType && contentType.includes('application/json')
    ? await response.json().catch(() => undefined)
    : await response.text().catch(() => undefined);

  if (!response.ok) {
    const message = typeof body === 'object' && body !== null && 'message' in body
      ? String((body as Record<string, unknown>).message)
      : response.statusText || 'Request to upstream API failed';
    throw new ApiError(response.status, message, body);
  }

  return (body as T) ?? (undefined as T);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export { API_BASE_URL };

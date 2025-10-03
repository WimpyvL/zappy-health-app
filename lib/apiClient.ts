const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY
const STATIC_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL environment variable. Please check your .env configuration.')
}

if (!API_KEY) {
  throw new Error('Missing VITE_API_KEY environment variable. Please check your .env configuration.')
}

type Query = Record<string, string | number | boolean | undefined | null>

type RequestOptions = Omit<RequestInit, 'body'> & {
  query?: Query
  body?: unknown
  skipAuth?: boolean
}

const buildQueryString = (query?: Query) => {
  if (!query) return ''
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    params.append(key, String(value))
  })
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

const isFormData = (value: unknown): value is FormData => typeof FormData !== 'undefined' && value instanceof FormData
const isBlob = (value: unknown): value is Blob => typeof Blob !== 'undefined' && value instanceof Blob
const isArrayBuffer = (value: unknown): value is ArrayBuffer => typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer

export class ApiClient {
  private authToken: string | null

  constructor(private readonly baseUrl: string, initialToken?: string | null) {
    this.authToken = initialToken ?? null
  }

  setAuthToken(token: string | null) {
    this.authToken = token
  }

  private resolveHeaders(headers?: HeadersInit, skipAuth?: boolean, body?: unknown): HeadersInit {
    let resolvedHeaders: HeadersInit

    if (headers instanceof Headers) {
      resolvedHeaders = new Headers(headers)
    } else if (Array.isArray(headers)) {
      resolvedHeaders = [...headers]
    } else {
      resolvedHeaders = { ...(headers || {}) }
    }

    // Always add X-API-KEY header
    if (resolvedHeaders instanceof Headers) {
      resolvedHeaders.set('X-API-KEY', API_KEY)
    } else if (Array.isArray(resolvedHeaders)) {
      resolvedHeaders.push(['X-API-KEY', API_KEY])
    } else {
      resolvedHeaders['X-API-KEY'] = API_KEY
    }

    const shouldSetJsonHeader = !(isFormData(body) || isBlob(body) || isArrayBuffer(body) || typeof body === 'string')
    if (shouldSetJsonHeader) {
      if (resolvedHeaders instanceof Headers) {
        if (!resolvedHeaders.has('Content-Type')) {
          resolvedHeaders.set('Content-Type', 'application/json')
        }
      } else if (Array.isArray(resolvedHeaders)) {
        const hasContentType = resolvedHeaders.some(([key]) => key.toLowerCase() === 'content-type')
        if (!hasContentType) {
          resolvedHeaders.push(['Content-Type', 'application/json'])
        }
      } else {
        if (!('Content-Type' in resolvedHeaders)) {
          resolvedHeaders['Content-Type'] = 'application/json'
        }
      }
    }

    if (!skipAuth) {
      const token = this.authToken || (typeof window !== 'undefined' ? window.localStorage.getItem('api_access_token') : null)
      if (token) {
        if (resolvedHeaders instanceof Headers) {
          resolvedHeaders.set('Authorization', `Bearer ${token}`)
        } else if (Array.isArray(resolvedHeaders)) {
          resolvedHeaders.push(['Authorization', `Bearer ${token}`])
        } else {
          resolvedHeaders['Authorization'] = `Bearer ${token}`
        }
      }
    }

    return resolvedHeaders
  }

  private serializeBody(body: unknown) {
    if (body === undefined || body === null) {
      return undefined
    }

    if (isFormData(body) || isBlob(body) || isArrayBuffer(body) || typeof body === 'string') {
      return body as BodyInit
    }

    return JSON.stringify(body)
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, query, headers, skipAuth, ...rest } = options
    const queryString = buildQueryString(query)
    const url = `${this.baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}${queryString}`

    const response = await fetch(url, {
      ...rest,
      headers: this.resolveHeaders(headers, skipAuth, body),
      body: this.serializeBody(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`)
    }

    if (response.status === 204) {
      return undefined as T
    }

    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T
    }

    return (await response.text()) as unknown as T
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'POST', body })
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'PUT', body })
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'PATCH', body })
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL, STATIC_TOKEN ?? null)

export const setApiAuthToken = (token: string | null) => {
  if (typeof window !== 'undefined') {
    if (token) {
      window.localStorage.setItem('api_access_token', token)
    } else {
      window.localStorage.removeItem('api_access_token')
    }
  }
  apiClient.setAuthToken(token)
}

export const clearApiAuthToken = () => setApiAuthToken(null)

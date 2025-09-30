const DEFAULT_API_BASE_URL = 'https://api-stag.zappyhealth.com/api/v1'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
const API_KEY = import.meta.env.VITE_ZAPPY_API_KEY || import.meta.env.VITE_API_KEY || ''

const ACCESS_TOKEN_STORAGE_KEY = 'zappy_health_access_token'
const REFRESH_TOKEN_STORAGE_KEY = 'zappy_health_refresh_token'

interface StoredTokens {
  accessToken: string | null
  refreshToken: string | null
}

let inMemoryTokens: StoredTokens = {
  accessToken: null,
  refreshToken: null
}

const isBrowser = () => typeof window !== 'undefined'

function persistTokens(tokens: StoredTokens) {
  inMemoryTokens = tokens

  if (!isBrowser()) {
    return
  }

  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken)
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  }

  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken)
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  }
}

function readTokensFromStorage(): StoredTokens {
  if (!isBrowser()) {
    return { accessToken: null, refreshToken: null }
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)

  inMemoryTokens = { accessToken, refreshToken }
  return inMemoryTokens
}

export function setAuthTokens(tokens: Partial<StoredTokens>) {
  const nextTokens: StoredTokens = {
    accessToken: tokens.accessToken ?? inMemoryTokens.accessToken,
    refreshToken: tokens.refreshToken ?? inMemoryTokens.refreshToken
  }

  persistTokens(nextTokens)
}

export function clearAuthTokens() {
  persistTokens({ accessToken: null, refreshToken: null })
}

export function getStoredTokens(): StoredTokens {
  if (inMemoryTokens.accessToken || inMemoryTokens.refreshToken) {
    return inMemoryTokens
  }

  return readTokensFromStorage()
}

export function getAccessToken(): string | null {
  if (!inMemoryTokens.accessToken) {
    readTokensFromStorage()
  }

  return inMemoryTokens.accessToken
}

export function getRefreshToken(): string | null {
  if (!inMemoryTokens.refreshToken) {
    readTokensFromStorage()
  }

  return inMemoryTokens.refreshToken
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)

  const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData

  if (!isFormDataBody) {
    headers.set('Content-Type', 'application/json')
  }

  if (API_KEY) {
    headers.set('X-API-KEY', API_KEY)
  }

  if (!options.skipAuth) {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  // @ts-expect-error - Non JSON responses should be handled by caller
  return (await response.text()) as T
}

export { API_BASE_URL }

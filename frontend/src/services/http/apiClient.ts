import { appConfig } from '../../config/app.config';

export type ApiResult<T> = {
  data: T;
};

export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorResponse = {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  fields?: ApiFieldError[];
};

type CsrfResponse = {
  parameterName: string;
  headerName: string;
  token: string;
};

export class ApiError extends Error {
  status: number;
  code: string;
  fields: ApiFieldError[];

  constructor(response: ApiErrorResponse) {
    super(response.message || 'Unable to communicate with the API.');

    this.name = 'ApiError';
    this.status = response.status;
    this.code = response.error;
    this.fields = response.fields || [];
  }
}

let csrfToken: CsrfResponse | null = null;

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const method = (init?.method || 'GET').toUpperCase();
  const headers = new Headers(init?.headers);
  const body = init?.body;

  if (body && !(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (requiresCsrf(method)) {
    const token = await getCsrfToken();
    headers.set(token.headerName, token.token);
  }

  const response = await fetch(buildApiUrl(path), {
    ...init,
    method,
    headers,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new ApiError(await parseApiError(response));
  }

  if (response.status === 204) {
    return { data: undefined as T };
  }

  return { data: (await response.json()) as T };
}

function requiresCsrf(method: string): boolean {
  return !['GET', 'HEAD', 'OPTIONS'].includes(method);
}

async function getCsrfToken(): Promise<CsrfResponse> {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await fetch(buildApiUrl('/auth/csrf'), {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      error: 'CSRF_ERROR',
      message: 'Unable to prepare request security.',
      fields: []
    });
  }

  csrfToken = (await response.json()) as CsrfResponse;

  return csrfToken;
}

function buildApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const baseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

async function parseApiError(response: Response): Promise<ApiErrorResponse> {
  try {
    const data = (await response.json()) as Partial<ApiErrorResponse>;

    return {
      status: data.status || response.status,
      error: data.error || 'API_ERROR',
      message: data.message || 'Unable to communicate with the API.',
      path: data.path,
      fields: data.fields || []
    };
  } catch {
    return {
      status: response.status,
      error: 'API_ERROR',
      message: 'Unable to communicate with the API.',
      fields: []
    };
  }
}

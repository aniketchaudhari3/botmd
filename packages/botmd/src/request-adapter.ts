export interface NormalizedRequest {
  url: string;
  headers: Record<string, string>;
}

type RequestLike = 
  | Request
  | { url: string; headers: Headers | Record<string, string | string[] | undefined> }
  | { url?: string; originalUrl?: string; protocol?: string; get: (name: string) => string | undefined; headers: Record<string, string | string[] | undefined> };

function normalizeHeaders(headers: unknown): Record<string, string> {
  const normalized: Record<string, string> = {};

  if (typeof (headers as Headers).get === 'function') {
    const headersObj = headers as Headers;
    if (typeof headersObj.forEach === 'function') {
      headersObj.forEach((value: string, key: string) => {
        normalized[key.toLowerCase()] = value;
      });
    } else {
      const commonHeaders = ['user-agent', 'accept', 'content-type', 'x-botmd-internal'];
      for (const header of commonHeaders) {
        const value = headersObj.get(header);
        if (value) normalized[header] = value;
      }
    }
  } else if (typeof headers === 'object' && headers !== null) {
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        normalized[key.toLowerCase()] = value;
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
        normalized[key.toLowerCase()] = value[0];
      }
    });
  }

  return normalized;
}

export function normalizeRequest(request: RequestLike): NormalizedRequest {
  if (typeof request !== 'object' || request === null) {
    throw new Error('Request must be an object');
  }

  if ('url' in request && typeof request.url === 'string') {
    return {
      url: request.url,
      headers: normalizeHeaders(request.headers)
    };
  }

  if ('get' in request && typeof request.get === 'function') {
    const protocol = 'protocol' in request && typeof request.protocol === 'string' ? request.protocol : 'http';
    const host = request.get('host') || 'localhost';
    const path = ('originalUrl' in request && typeof request.originalUrl === 'string' ? request.originalUrl : undefined) ||
                ('url' in request && typeof request.url === 'string' ? request.url : undefined) || '/';
    const url = `${protocol}://${host}${path}`;

    return { 
      url, 
      headers: normalizeHeaders(request.headers) 
    };
  }

  throw new Error('Invalid request object: must have either url property or get() method');
}

export function getPathFromUrl(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url.split('?')[0];
  }
}

export function getFullPathFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname + urlObj.search;
  } catch {
    return url;
  }
}

export function getBaseUrl(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}


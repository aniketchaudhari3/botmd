import {
  BOTMD_INTERNAL_HEADER,
  DEFAULT_FETCH_TIMEOUT,
  DEFAULT_MAX_HTML_SIZE,
  DEFAULT_RETRY_ATTEMPTS,
} from './constants';
import { validateUrl } from './url-validator';

export function isInternalRequest(headers: Record<string, string>): boolean {
  return headers[BOTMD_INTERNAL_HEADER] === 'true' || 
         headers[BOTMD_INTERNAL_HEADER.toLowerCase()] === 'true';
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchHtmlAttempt(
  url: string,
  timeout: number,
  maxSize: number
): Promise<{ html: string; statusCode?: number }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        [BOTMD_INTERNAL_HEADER]: 'true',
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'botmd/1.0 (internal fetch)'
      },
      signal: controller.signal
    });
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      (error as Error & { statusCode?: number }).statusCode = response.status;
      throw error;
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (size > maxSize) {
        throw new Error(`Content size ${size} bytes exceeds limit of ${maxSize} bytes`);
      }
    }

    const html = await response.text();
    const actualSize = new Blob([html]).size;
    
    if (actualSize > maxSize) {
      throw new Error(`HTML size ${actualSize} bytes exceeds limit of ${maxSize} bytes`);
    }
    
    return { html, statusCode: response.status };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchHtml(
  url: string,
  allowLocalhost: boolean = false,
  timeout: number = DEFAULT_FETCH_TIMEOUT,
  maxSize: number = DEFAULT_MAX_HTML_SIZE
): Promise<string> {
  validateUrl(url, allowLocalhost);

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= DEFAULT_RETRY_ATTEMPTS; attempt++) {
    try {
      const result = await fetchHtmlAttempt(url, timeout, maxSize);
      return result.html;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      const statusCode = (error as Error & { statusCode?: number }).statusCode;
      if (statusCode && statusCode >= 400 && statusCode < 500) {
        throw error;
      }
      
      if (lastError.message.includes('exceeds limit')) {
        throw error;
      }

      if (attempt < DEFAULT_RETRY_ATTEMPTS) {
        await sleep(1000 * (attempt + 1));
      }
    }
  }

  throw lastError || new Error('Failed to fetch HTML after retries');
}


import { detectBot } from './bot-detection';
import { MarkdownCache } from './cache';
import type { BotmdConfig, ResolvedBotmdConfig } from './config';
import { mergeConfig } from './config';
import { fetchHtml, isInternalRequest } from './html-fetcher';
import { htmlToMarkdown } from './html-to-md';
import { shouldProcessPath } from './path-matcher';
import { normalizeRequest, getPathFromUrl, getFullPathFromUrl, getBaseUrl } from './request-adapter';

export interface BotmdResponse {
  isBot: boolean;
  content: string | null;
  headers: Record<string, string>;
  shouldConvert: boolean;
  cached?: boolean;
  error?: Error;
}

export type BotmdRequest = 
  | Request
  | { url: string; headers: Record<string, string> | Headers }
  | { url?: string; originalUrl?: string; protocol?: string; get: (name: string) => string | undefined; headers: Record<string, string | string[] | undefined> };

export class Botmd {
  private config: ResolvedBotmdConfig;
  private cache: MarkdownCache;

  constructor(config: Partial<BotmdConfig> = {}) {
    this.config = mergeConfig(config);
    this.cache = new MarkdownCache({
      enabled: this.config.cache.enabled,
      ttl: this.config.cache.ttl,
      maxSize: this.config.cache.maxSize
    });
  }

  private log(message: string, ...args: unknown[]): void {
    if (this.config.debug) {
      console.log(`[botmd:debug] ${message}`, ...args);
    }
  }

  private logRequest(path: string, userAgent: string): void {
    if (this.config.logRequests) {
      const timestamp = new Date().toISOString();
      console.log(`[botmd:${timestamp}] [${path}] [User-Agent: ${userAgent}]`);
    }
  }

  async createResponse(request: BotmdRequest): Promise<BotmdResponse> {
    try {
      const { url, headers } = normalizeRequest(request);
      this.log('Processing request:', url);
      
      if (!this.config.enabled) {
        this.log('Botmd is disabled');
        return this.createEmptyResponse();
      }
      
      if (isInternalRequest(headers)) {
        this.log('Internal request detected, skipping');
        return this.createEmptyResponse();
      }
      
      const path = getPathFromUrl(url);
      const shouldProcess = shouldProcessPath(
        path,
        this.config.paths.allowed,
        this.config.paths.disallowed
      );
      
      if (!shouldProcess) {
        this.log('Path not allowed:', path);
        return this.createEmptyResponse();
      }
      
      const acceptHeader = headers.accept || headers.Accept || '';
      const userAgent = headers['user-agent'] || headers['User-Agent'] || '';
      const acceptsMarkdown = acceptHeader.includes('text/markdown');
      const isBot = acceptsMarkdown || detectBot(
        userAgent,
        this.config.userAgents.allowed,
        this.config.userAgents.disallowed
      );
      
      if (!isBot) {
        this.log('Not a bot:', userAgent);
        return this.createEmptyResponse();
      }
      
      this.log('Bot detected:', userAgent);
      const cacheKey = getFullPathFromUrl(url);
      
      if (this.cache.isEnabled()) {
        const cached = this.cache.get(cacheKey);
        if (cached) {
          this.log('Cache hit:', cacheKey);
          this.logRequest(path, userAgent);
          return {
            isBot: true,
            content: cached,
            headers: {
              'Content-Type': 'text/markdown; charset=utf-8',
              'X-Botmd-Cache': 'hit'
            },
            shouldConvert: true,
            cached: true
          };
        }
        this.log('Cache miss:', cacheKey);
      }
      
      this.log('Fetching HTML:', url);
      const html = await fetchHtml(url, this.config.debug);
      
      if (!html || html.trim().length === 0) {
        throw new Error('Fetched HTML content is empty');
      }
      
      const baseUrl = getBaseUrl(url);
      this.log('Converting to markdown with base URL:', baseUrl);
      const markdown = htmlToMarkdown(html, baseUrl);
      
      if (this.cache.isEnabled()) {
        this.cache.set(cacheKey, markdown);
        this.log('Cached markdown for:', cacheKey);
      }
      
      this.logRequest(path, userAgent);
      
      return {
        isBot: true,
        content: markdown,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'X-Botmd-Cache': 'miss'
        },
        shouldConvert: true,
        cached: false
      };
      
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        if (this.config.debug) {
          console.error('[botmd:error]', errorObj);
        } else {
          console.error('[botmd] Error processing request:', errorObj.message);
        }
      }
      
      return {
        isBot: false,
        content: null,
        headers: {},
        shouldConvert: false,
        error: errorObj
      };
    }
  }

  private createEmptyResponse(): BotmdResponse {
    return {
      isBot: false,
      content: null,
      headers: {},
      shouldConvert: false
    };
  }

  static shouldSkip(request: BotmdRequest): boolean {
    try {
      const { headers } = normalizeRequest(request);
      return isInternalRequest(headers);
    } catch {
      return false;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}


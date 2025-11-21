import { LRUCache } from 'lru-cache';

export class MarkdownCache {
  private cache: LRUCache<string, string>;
  private enabled: boolean;

  constructor(config: { enabled: boolean; ttl: number; maxSize: number }) {
    this.enabled = config.enabled;
    this.cache = new LRUCache<string, string>({
      max: config.maxSize,
      ttl: config.ttl,
      updateAgeOnGet: true,
      updateAgeOnHas: true
    });
  }

  get(path: string): string | undefined {
    if (!this.enabled || !path) {
      return undefined;
    }
    return this.cache.get(path);
  }

  set(path: string, markdown: string): void {
    if (!this.enabled || !path || !markdown) {
      return;
    }
    this.cache.set(path, markdown);
  }

  clear(): void {
    this.cache.clear();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  size(): number {
    return this.cache.size;
  }
}


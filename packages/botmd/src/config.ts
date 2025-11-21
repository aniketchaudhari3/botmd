import { DEFAULT_CACHE_TTL, DEFAULT_CACHE_MAX_SIZE } from './constants';

export interface BotmdConfig {
  enabled?: boolean;
  paths?: {
    allowed?: (string | RegExp)[];
    disallowed?: (string | RegExp)[];
  };
  userAgents?: {
    allowed?: (string | RegExp)[];
    disallowed?: (string | RegExp)[];
  };
  cache?: {
    enabled?: boolean;
    ttl?: number;
    maxSize?: number;
  };
  logRequests?: boolean;
  debug?: boolean;
}

export interface ResolvedBotmdConfig {
  enabled: boolean;
  paths: {
    allowed: (string | RegExp)[];
    disallowed: (string | RegExp)[];
  };
  userAgents: {
    allowed: (string | RegExp)[];
    disallowed: (string | RegExp)[];
  };
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  logRequests: boolean;
  debug: boolean;
}

export const DEFAULT_CONFIG: ResolvedBotmdConfig = {
  enabled: true,
  paths: {
    allowed: [],
    disallowed: []
  },
  userAgents: {
    allowed: [],
    disallowed: []
  },
  cache: {
    enabled: true,
    ttl: DEFAULT_CACHE_TTL,
    maxSize: DEFAULT_CACHE_MAX_SIZE
  },
  logRequests: false,
  debug: false
};

function validateConfig(config: Partial<BotmdConfig>): void {
  if (config.enabled !== undefined && typeof config.enabled !== 'boolean') {
    throw new Error('enabled must be a boolean');
  }
  
  if (config.logRequests !== undefined && typeof config.logRequests !== 'boolean') {
    throw new Error('logRequests must be a boolean');
  }
  
  if (config.debug !== undefined && typeof config.debug !== 'boolean') {
    throw new Error('debug must be a boolean');
  }

  if (config.paths) {
    if (typeof config.paths !== 'object' || config.paths === null) {
      throw new Error('paths must be an object');
    }
    if (config.paths.allowed !== undefined) {
      if (!Array.isArray(config.paths.allowed)) throw new Error('paths.allowed must be an array');
      for (const p of config.paths.allowed) {
        if (typeof p !== 'string' && !(p instanceof RegExp)) {
          throw new Error('paths.allowed must contain only strings or RegExp');
        }
        if (typeof p === 'string' && p.length === 0) {
          throw new Error('paths.allowed cannot contain empty strings');
        }
      }
    }
    if (config.paths.disallowed !== undefined) {
      if (!Array.isArray(config.paths.disallowed)) throw new Error('paths.disallowed must be an array');
      for (const p of config.paths.disallowed) {
        if (typeof p !== 'string' && !(p instanceof RegExp)) {
          throw new Error('paths.disallowed must contain only strings or RegExp');
        }
        if (typeof p === 'string' && p.length === 0) {
          throw new Error('paths.disallowed cannot contain empty strings');
        }
      }
    }
  }

  if (config.userAgents) {
    if (typeof config.userAgents !== 'object' || config.userAgents === null) {
      throw new Error('userAgents must be an object');
    }
    if (config.userAgents.allowed !== undefined) {
      if (!Array.isArray(config.userAgents.allowed)) throw new Error('userAgents.allowed must be an array');
      for (const p of config.userAgents.allowed) {
        if (typeof p !== 'string' && !(p instanceof RegExp)) {
          throw new Error('userAgents.allowed must contain only strings or RegExp');
        }
        if (typeof p === 'string' && p.length === 0) {
          throw new Error('userAgents.allowed cannot contain empty strings');
        }
      }
    }
    if (config.userAgents.disallowed !== undefined) {
      if (!Array.isArray(config.userAgents.disallowed)) throw new Error('userAgents.disallowed must be an array');
      for (const p of config.userAgents.disallowed) {
        if (typeof p !== 'string' && !(p instanceof RegExp)) {
          throw new Error('userAgents.disallowed must contain only strings or RegExp');
        }
        if (typeof p === 'string' && p.length === 0) {
          throw new Error('userAgents.disallowed cannot contain empty strings');
        }
      }
    }
  }

  if (config.cache) {
    if (config.cache.ttl !== undefined) {
      if (typeof config.cache.ttl !== 'number' || config.cache.ttl < 0 || !Number.isFinite(config.cache.ttl)) {
        throw new Error('cache.ttl must be a non-negative finite number');
      }
    }
    if (config.cache.maxSize !== undefined) {
      if (typeof config.cache.maxSize !== 'number' || config.cache.maxSize < 1 || !Number.isInteger(config.cache.maxSize)) {
        throw new Error('cache.maxSize must be a positive integer');
      }
    }
    if (config.cache.enabled !== undefined && typeof config.cache.enabled !== 'boolean') {
      throw new Error('cache.enabled must be a boolean');
    }
  }
}

export function mergeConfig(userConfig: Partial<BotmdConfig> = {}): ResolvedBotmdConfig {
  validateConfig(userConfig);

  return {
    enabled: userConfig.enabled ?? DEFAULT_CONFIG.enabled,
    paths: {
      allowed: userConfig.paths?.allowed ?? DEFAULT_CONFIG.paths.allowed,
      disallowed: userConfig.paths?.disallowed ?? DEFAULT_CONFIG.paths.disallowed
    },
    userAgents: {
      allowed: userConfig.userAgents?.allowed ?? DEFAULT_CONFIG.userAgents.allowed,
      disallowed: userConfig.userAgents?.disallowed ?? DEFAULT_CONFIG.userAgents.disallowed
    },
    cache: {
      enabled: userConfig.cache?.enabled ?? DEFAULT_CONFIG.cache.enabled,
      ttl: userConfig.cache?.ttl ?? DEFAULT_CONFIG.cache.ttl,
      maxSize: userConfig.cache?.maxSize ?? DEFAULT_CONFIG.cache.maxSize
    },
    logRequests: userConfig.logRequests ?? DEFAULT_CONFIG.logRequests,
    debug: userConfig.debug ?? DEFAULT_CONFIG.debug
  };
}


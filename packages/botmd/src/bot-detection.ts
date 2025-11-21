import { AI_BOT_PATTERNS } from './ai-bots';

function matchesPatterns(userAgent: string, patterns: readonly (string | RegExp)[]): boolean {
  if (!patterns || patterns.length === 0) return false;
  
  const lowerUA = userAgent.toLowerCase();
  
  for (const pattern of patterns) {
    if (typeof pattern === 'string') {
      if (lowerUA.includes(pattern.toLowerCase())) return true;
    } else if (pattern.test(userAgent)) {
      return true;
    }
  }
  
  return false;
}

export function detectBot(
  userAgent: string,
  allowedPatterns: (string | RegExp)[] = [],
  disallowedPatterns: (string | RegExp)[] = []
): boolean {
  if (!userAgent || typeof userAgent !== 'string') return false;

  if (disallowedPatterns.length > 0 && matchesPatterns(userAgent, disallowedPatterns)) {
    return false;
  }

  if (allowedPatterns.length > 0) {
    return matchesPatterns(userAgent, allowedPatterns);
  }

  return matchesPatterns(userAgent, AI_BOT_PATTERNS);
}


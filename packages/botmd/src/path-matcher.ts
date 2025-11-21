export function matchesPattern(path: string, pattern: string | RegExp): boolean {
  if (!path || !pattern) return false;
  
  if (pattern instanceof RegExp) {
    return pattern.test(path);
  }
  
  const patternStr = pattern.toString();
  if (patternStr === path) return true;
  
  if (patternStr.endsWith('/**')) {
    const prefix = patternStr.slice(0, -3);
    return path === prefix || path.startsWith(prefix + '/');
  }
  
  if (patternStr.endsWith('/*')) {
    const prefix = patternStr.slice(0, -2);
    if (!path.startsWith(prefix + '/')) return false;
    const remainder = path.slice(prefix.length + 1);
    return !remainder.includes('/');
  }
  
  if (patternStr.includes('*')) {
    const regexPattern = patternStr
      .replace(/\//g, '\\/')
      .replace(/\\\*\\\*/g, '{{MULTI}}')
      .replace(/\*/g, '[^/]+')
      .replace(/\{\{MULTI\}\}/g, '.*');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }
  
  return false;
}

export function matchesAnyPattern(path: string, patterns: (string | RegExp)[]): boolean {
  if (!patterns || patterns.length === 0) return false;
  
  return patterns.some(pattern => matchesPattern(path, pattern));
}

export function shouldProcessPath(
  path: string,
  allowedPatterns: (string | RegExp)[],
  disallowedPatterns: (string | RegExp)[]
): boolean {
  if (disallowedPatterns.length > 0 && matchesAnyPattern(path, disallowedPatterns)) {
    return false;
  }
  
  if (allowedPatterns.length > 0) {
    return matchesAnyPattern(path, allowedPatterns);
  }
  
  return true;
}


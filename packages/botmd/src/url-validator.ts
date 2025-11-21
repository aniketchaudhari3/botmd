const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fe80:/,
  /^fc00:/,
];

const BLOCKED_HOSTNAMES = [
  'localhost.localdomain',
  'ip6-localhost',
  'ip6-loopback',
];

export function validateUrl(url: string, allowLocalhost: boolean = false): void {
  if (!url || typeof url !== 'string') {
    throw new Error('URL must be a non-empty string');
  }

  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }

  if (!['http:', 'https:'].includes(urlObj.protocol)) {
    throw new Error(`Invalid protocol: ${urlObj.protocol}. Only http: and https: are allowed`);
  }

  const hostname = urlObj.hostname.toLowerCase();

  if (!allowLocalhost && BLOCKED_HOSTNAMES.includes(hostname)) {
    throw new Error(`Access to ${hostname} is not allowed (SSRF protection)`);
  }

  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      if (allowLocalhost && /^127\./.test(hostname)) {
        continue;
      }
      throw new Error(`Access to private IP ${hostname} is not allowed (SSRF protection)`);
    }
  }

  if (/^0\./.test(hostname)) {
    throw new Error(`Access to reserved IP ${hostname} is not allowed (SSRF protection)`);
  }

  if (hostname.startsWith('[') && hostname.endsWith(']')) {
    const ipv6 = hostname.slice(1, -1);
    if (ipv6 === '::' || ipv6 === '::0') {
      throw new Error('Access to unspecified IPv6 address is not allowed (SSRF protection)');
    }
  }
}

export function isInternalHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  
  if (BLOCKED_HOSTNAMES.includes(lower)) {
    return true;
  }
  
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(lower)) {
      return true;
    }
  }
  
  return false;
}


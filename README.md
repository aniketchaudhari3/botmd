# botmd

> Universal AI bot markdown middleware for any JavaScript framework.

Convert your HTML pages to clean, structured markdown automatically when AI bots visit your site. Reduce token usage, improve AI comprehension, and make your content more accessible to AI models.

[![npm version](https://img.shields.io/npm/v/botmd.svg)](https://www.npmjs.com/package/botmd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**📚 [View Full Documentation →](https://botmd-docs.vercel.app)**

## ✨ Features

- **🤖 Smart Bot Detection** - Automatically detects 50+ AI bots and crawlers
- **📝 HTML to Markdown** - Clean, structured markdown with absolute URLs
- **⚡ High Performance** - Built-in LRU cache with TTL
- **🎯 Path Control** - Fine-grained control over which paths get converted
- **🌐 Framework Agnostic** - Works with Next.js, Express, Hono, Bun, NestJS, and more
- **🚀 Edge Ready** - Runs in Node.js and Edge runtimes
- **📦 Zero Config** - Works out of the box with sensible defaults
- **🔒 SSRF Protection** - Built-in security against server-side request forgery

## 🚀 Quick Start

### Installation

```bash
npm install botmd
# or
pnpm add botmd
# or
yarn add botmd
# or
bun add botmd
```

### Next.js Example

```typescript
// middleware.ts
import { Botmd } from 'botmd';
import { NextRequest, NextResponse } from 'next/server';

const botmd = new Botmd({
  paths: {
    allowed: ['/docs/**', '/blog/**'],
    disallowed: ['/api/**', '/admin/**']
  },
  logRequests: true
});

export async function middleware(request: NextRequest) {
  // Skip internal requests
  if (Botmd.shouldSkip(request)) {
    return NextResponse.next();
  }

  const result = await botmd.createResponse(request);
  
  if (!result.shouldConvert) {
    return NextResponse.next();
  }
  
  return new NextResponse(result.content, { 
    headers: result.headers 
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

### Express Example

```typescript
import express from 'express';
import { Botmd } from 'botmd';

const app = express();
const botmd = new Botmd({
  paths: { disallowed: ['/api/**'] }
});

app.use(async (req, res, next) => {
  const result = await botmd.createResponse(req);
  
  if (!result.shouldConvert) {
    return next();
  }
  
  res.set(result.headers);
  res.send(result.content);
});

app.listen(3000);
```

## 🤖 Detected Bots

Botmd automatically detects 50+ AI bots including:

### AI Assistants & Search
- **OpenAI**: GPTBot, ChatGPT-User, OAI-SearchBot
- **Anthropic**: ClaudeBot, Claude-Web, anthropic-ai
- **Perplexity**: PerplexityBot, Perplexity-User
- **Google**: Google-Extended, Googlebot
- **Meta**: meta-externalfetcher
- **Microsoft**: bingbot

### Coding Assistants
- **GitHub Copilot**: GitHubCopilot, CopilotBot
- **Cursor**: Cursor, CursorAgent, CursorBot
- **Codeium**: Windsurf, CodeiumAgent
- **Tabnine**: TabnineAgent
- **Replit**: ReplitAgent, ReplitAI

### Crawlers & Tools
- **Firecrawl**: FirecrawlAgent
- **Jina**: JinaBot, JinaReader
- **Tavily**: TavilyBot, TavilySearchBot
- **Exa**: ExaBot
- **Amazon**: Amazonbot
- **Apple**: Applebot, iTMS
- **Others**: CCBot, Diffbot, DuckAssistBot, Bytespider, TikTokSpider

[See full list](./packages/botmd/src/ai-bots.ts)

## ⚙️ Configuration

```typescript
interface BotmdConfig {
  // Enable/disable the middleware
  enabled?: boolean; // default: true
  
  // Path filtering
  paths?: {
    allowed?: (string | RegExp)[]; // e.g., ['/docs/**', '/blog/*']
    disallowed?: (string | RegExp)[]; // e.g., ['/api/**', '/admin/**']
  };
  
  // User agent filtering
  userAgents?: {
    allowed?: (string | RegExp)[]; // Custom bots to allow
    disallowed?: (string | RegExp)[]; // Bots to block
  };
  
  // Caching
  cache?: {
    enabled?: boolean; // default: true
    ttl?: number; // default: 86400000 (1 day in ms)
    maxSize?: number; // default: 1000 entries
  };
  
  // Logging
  logRequests?: boolean; // default: false
  debug?: boolean; // default: false
}
```

### Path Patterns

```typescript
'/docs'        // Exact match
'/docs/*'      // Single level: /docs/intro ✓, /docs/guide/setup ✗
'/docs/**'     // Multi level: /docs/intro ✓, /docs/guide/setup ✓
/^\/api\/.*/   // RegExp patterns
```

### Common Configurations

```typescript
// Allow all paths (default)
const botmd = new Botmd();

// Only specific paths
const botmd = new Botmd({
  paths: { allowed: ['/docs/**', '/blog/**'] }
});

// Exclude sensitive paths
const botmd = new Botmd({
  paths: { disallowed: ['/api/**', '/admin/**'] }
});
```

## 📚 API

```typescript
new Botmd(config?)                    // Create instance
await botmd.createResponse(request)   // Process request → BotmdResponse
botmd.clearCache()                    // Clear cache
Botmd.shouldSkip(request)             // Check if internal request
```

[Complete API documentation →](https://botmd-docs.vercel.app/docs/api-reference)

## 🧪 Testing

Test with curl:

```bash
# Regular request (gets HTML)
curl http://localhost:3000/docs

# Bot request (gets Markdown)
curl -H "User-Agent: GPTBot" http://localhost:3000/docs
curl -H "User-Agent: Claude-Web" http://localhost:3000/docs

# Explicit markdown request
curl -H "Accept: text/markdown" http://localhost:3000/docs
```

## 🎯 How It Works

1. **Request Normalization** - Extract URL and headers from any request format
2. **Configuration Check** - Verify botmd is enabled and path is allowed
3. **Bot Detection** - Check `Accept: text/markdown` header or user-agent patterns
4. **Cache Check** - Return cached markdown if available (with TTL)
5. **HTML Fetch** - Internally fetch HTML with loop prevention
6. **Conversion** - Transform HTML to clean markdown with absolute URLs
7. **Cache Store** - Store result for future requests
8. **Response** - Return markdown with appropriate headers


## 🚀 Performance

- **Zero dependencies** for HTML conversion (regex-based)
- **LRU cache** with TTL prevents redundant conversions
- **Edge compatible** - no Node.js-specific APIs required
- **Fast path matching** - optimized for common patterns
- **~14KB minified** - minimal bundle impact

## 📖 Documentation

**[Read the full docs at botmd-docs.vercel.app →](https://botmd-docs.vercel.app)**

## 📝 License

MIT License - see [LICENSE](./packages/botmd/LICENSE) file for details.

---

**Made with ❤️ for developers building AI-accessible applications**

For questions, issues, or feature requests, please [open an issue](https://github.com/aniketchaudhari3/botmd/issues).

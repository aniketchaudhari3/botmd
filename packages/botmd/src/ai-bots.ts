export const AI_BOT_PATTERNS: readonly RegExp[] = [
  /ChatGPT-User|OAI-SearchBot/i,
  /Claude-Web/i,
  /Perplexity-User|PerplexityBot/i,
  /meta-externalfetcher/i,
  /Cursor\/\d|CursorAgent|CursorBot/i,
  /GitHubCopilot|CopilotBot/i,
  /ClaudeCode/i,
  /Windsurf\/\d|CodeiumAgent|Codeium\/\d/i,
  /TabnineAgent|Tabnine\/\d/i,
  /ReplitAgent|ReplitAI/i,
  /ExaBot|Exa\/\d/i,
  /FirecrawlAgent|Firecrawl\/\d/i,
  /TavilyBot|TavilySearchBot/i,
  /JinaBot|JinaReader/i,
  /YouBot|YouSearch/i,
  /GPTBot/i,
  /ClaudeBot|anthropic-ai/i,
  /Googlebot|Google-Extended/i,
  /Amazonbot/i,
  /Applebot|iTMS/i,
  /bingbot/i,
  /Bytespider|TikTokSpider/i,
  /cohere-training-data-crawler|cohere-ai/i,
  /CCBot/i,
  /Diffbot/i,
  /DuckAssistBot/i,
  /botmd/i
] as const;

export type AiBotPattern = typeof AI_BOT_PATTERNS[number];


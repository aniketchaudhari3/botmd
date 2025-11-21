'use client';

import { useState } from 'react';

const MOCK_HTML_CONTENT = `
<div>
  <div class="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 mb-5">
    <span>Documentation</span>
    <span class="text-neutral-400">›</span>
    <span class="text-blue-600 dark:text-blue-400 font-medium">API Reference</span>
  </div>
  
  <header class="mb-6 pb-4 border-b-2 border-neutral-200 dark:border-neutral-800">
    <div class="inline-block bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-2.5 py-1 rounded-md text-[0.625rem] font-bold tracking-wide mb-2.5 shadow-sm">GET</div>
    <h1 class="text-2xl font-bold mb-1.5 font-mono">/api/users</h1>
    <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">Retrieve a paginated list of users from your workspace</p>
  </header>

  <section class="space-y-4">
    <div class="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <h2 class="text-base font-semibold mb-3">Parameters</h2>
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b-2 border-neutral-200 dark:border-neutral-700">
            <th class="text-left py-2 pr-2 font-semibold text-neutral-700 dark:text-neutral-300">Name</th>
            <th class="text-left py-2 pr-2 font-semibold text-neutral-700 dark:text-neutral-300">Type</th>
            <th class="text-left py-2 pr-2 font-semibold text-neutral-700 dark:text-neutral-300">Required</th>
            <th class="text-left py-2 font-semibold text-neutral-700 dark:text-neutral-300">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-neutral-100 dark:border-neutral-800">
            <td class="py-2 pr-2"><code class="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-purple-600 dark:text-purple-400 font-semibold font-mono">limit</code></td>
            <td class="py-2 pr-2"><span class="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[0.625rem] font-semibold">integer</span></td>
            <td class="py-2 pr-2"><span class="text-neutral-600 dark:text-neutral-400 text-[0.625rem]">Optional</span></td>
            <td class="py-2 leading-snug">Maximum number of results (default: 20, max: 100)</td>
          </tr>
          <tr class="border-b border-neutral-100 dark:border-neutral-800">
            <td class="py-2 pr-2"><code class="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-purple-600 dark:text-purple-400 font-semibold font-mono">offset</code></td>
            <td class="py-2 pr-2"><span class="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[0.625rem] font-semibold">integer</span></td>
            <td class="py-2 pr-2"><span class="text-neutral-600 dark:text-neutral-400 text-[0.625rem]">Optional</span></td>
            <td class="py-2 leading-snug">Number of results to skip for pagination</td>
          </tr>
          <tr>
            <td class="py-2 pr-2"><code class="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-purple-600 dark:text-purple-400 font-semibold font-mono">status</code></td>
            <td class="py-2 pr-2"><span class="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[0.625rem] font-semibold">string</span></td>
            <td class="py-2 pr-2"><span class="text-neutral-600 dark:text-neutral-400 text-[0.625rem]">Optional</span></td>
            <td class="py-2 leading-snug">Filter by user status: <code class="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded text-pink-600 dark:text-pink-400 text-[0.625rem] font-mono">active</code>, <code class="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded text-pink-600 dark:text-pink-400 text-[0.625rem] font-mono">inactive</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <h2 class="text-base font-semibold mb-3">Example Request</h2>
      <div class="bg-neutral-800 dark:bg-neutral-950 text-neutral-400 px-3 py-2 rounded-t-md text-xs">Shell</div>
      <pre class="bg-neutral-800 dark:bg-neutral-950 text-neutral-200 rounded-b-md p-3 overflow-x-auto font-mono text-[0.7rem] leading-relaxed mt-0">curl -X GET "https://api.example.com/v1/users?limit=10" \\
  -H "Authorization: Bearer sk_live_abc123..." \\
  -H "Content-Type: application/json"</pre>
    </div>

    <div class="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <h2 class="text-base font-semibold mb-3">Response</h2>
      <div class="bg-neutral-800 dark:bg-neutral-950 text-neutral-400 px-3 py-2 rounded-t-md text-xs flex justify-between items-center">
        <span>200 OK</span>
        <span class="bg-emerald-500 text-white px-2 py-0.5 rounded text-[0.625rem] font-semibold">Success</span>
      </div>
      <pre class="bg-neutral-800 dark:bg-neutral-950 text-neutral-200 rounded-b-md p-3 overflow-x-auto font-mono text-[0.7rem] leading-relaxed mt-0">{
  "success": true,
  "data": [
    {
      "id": "usr_a8f7d2c1",
      "name": "Sarah Chen",
      "email": "sarah@example.com",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 247,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}</pre>
    </div>
  </section>
</div>
`;

// Mock Markdown content (converted output)
const MOCK_MARKDOWN_CONTENT = `Documentation › API Reference

# GET /api/users

Retrieve a paginated list of users from your workspace

## Parameters

| Name   | Type    | Required | Description                                        |
|--------|---------|----------|----------------------------------------------------|
| limit  | integer | Optional | Maximum number of results (default: 20, max: 100)  |
| offset | integer | Optional | Number of results to skip for pagination           |
| status | string  | Optional | Filter by user status: active, inactive            |

## Example Request

**Shell**

\`\`\`bash
curl -X GET "https://api.example.com/v1/users?limit=10" \\
  -H "Authorization: Bearer sk_live_abc123..." \\
  -H "Content-Type: application/json"
\`\`\`

## Response

**200 OK** - Success

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "usr_a8f7d2c1",
      "name": "Sarah Chen",
      "email": "sarah@example.com",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 247,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
\`\`\``;

export function DemoBrowser() {
  const [showMarkdown, setShowMarkdown] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Browser Window */}
      <div className="relative border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-xl bg-white dark:bg-neutral-950">
        {/* Browser Chrome */}
        <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-3 py-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
          </div>
          
          {/* URL Bar */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-2.5 py-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs text-neutral-600 dark:text-neutral-200">https://acme.com/docs/api-reference</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-neutral-950 overflow-hidden">
          {!showMarkdown ? (
            // HTML Rendered View
            <div className="p-4 max-h-[380px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: MOCK_HTML_CONTENT }} />
          ) : (
            // Markdown View
            <div className="p-4 max-h-[380px] overflow-y-auto">
              <pre className="text-xs font-mono leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                {MOCK_MARKDOWN_CONTENT}
              </pre>
            </div>
          )}
        </div>

        {/* Floating Toggle Control */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-4xl border-2 border-purple-500 dark:border-purple-400 rounded-full px-4 py-2 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700">
              botmd
            </span>
            <button
              onClick={() => setShowMarkdown(!showMarkdown)}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
              style={{
                backgroundColor: showMarkdown ? '#a855f7' : '#d4d4d8'
              }}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  showMarkdown ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


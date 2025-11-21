const HTML_DETECTION_PATTERN = /<[^>]+>/;
const REMOVE_TAGS_PATTERN = /<(script|style|noscript|nav|footer|header|aside)\b[^>]*>.*?<\/\1>|<(meta|link)\b[^>]*>/gis;
const TITLE_TAG_PATTERN = /<title\b[^>]*>.*?<\/title>/gis;

function cleanHtml(html: string): string {
  return html.replace(REMOVE_TAGS_PATTERN, '').replace(TITLE_TAG_PATTERN, '');
}

function makeAbsoluteUrl(url: string, baseUrl: string): string {
  if (!url || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('//')) {
    return (baseUrl.startsWith('https') ? 'https:' : 'http:') + url;
  }
  
  try {
    return new URL(url, new URL(baseUrl)).href;
  } catch {
    return baseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
  }
}

function getColumnWidths(rows: string[][]): number[] {
  const widths: number[] = [];
  
  rows.forEach(row => {
    row.forEach((cell, index) => {
      const cellLength = cell.length;
      widths[index] = Math.max(widths[index] || 3, cellLength, 3);
    });
  });
  
  return widths;
}

function postProcess(markdown: string): string {
  return markdown
    .replace(/<[^>]*>/g, '')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/^(?!\|).*[ \t]{2,}|[ \t]+$/gm, (match) => 
      match.endsWith(' ') || match.endsWith('\t') ? match.trimEnd() : match.replace(/[ \t]{2,}/g, ' ')
    )
    .trim();
}

function htmlToMarkdownRegex(html: string, baseUrl: string): string {
  let md = cleanHtml(html);
  
  md = md.replace(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi, (_, level, content) => {
    const hashes = '#'.repeat(parseInt(level, 10));
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    return `\n\n${hashes} ${cleanContent}\n\n`;
  });
  
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n\n$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**');
  md = md.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '*$2*');
  
  md = md.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, (_, code) => 
    `\n\n\`\`\`\n${code.replace(/<[^>]*>/g, '')}\n\`\`\`\n\n`
  );
  
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (_, href, text) => {
    const absoluteHref = makeAbsoluteUrl(href, baseUrl);
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    return `[${cleanText}](${absoluteHref})`;
  });
  
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, (_, src, alt) => 
    `![${alt}](${makeAbsoluteUrl(src, baseUrl)})`
  );
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, (_, src) => 
    `![](${makeAbsoluteUrl(src, baseUrl)})`
  );
  
  md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_, content) => {
    const items = content.replace(/<li[^>]*>(.*?)<\/li>/gi, (_: string, item: string) => 
      `- ${item.replace(/<[^>]*>/g, '').trim()}\n`
    );
    return `\n${items}\n`;
  });
  
  md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_, content) => {
    let counter = 1;
    const items = content.replace(/<li[^>]*>(.*?)<\/li>/gi, (_: string, item: string) => 
      `${counter++}. ${item.replace(/<[^>]*>/g, '').trim()}\n`
    );
    return `\n${items}\n`;
  });
  
  md = md.replace(/<table[^>]*>(.*?)<\/table>/gis, (_, tableContent) => {
    const rows = tableContent.match(/<tr[^>]*>(.*?)<\/tr>/gis) || [];
    const allRows: string[][] = [];
    
    rows.forEach((row: string) => {
      const cells = row.match(/<t[hd][^>]*>(.*?)<\/t[hd]>/gi) || [];
      const cellContents = cells.map((cell: string) => 
        cell.replace(/<t[hd][^>]*>(.*?)<\/t[hd]>/gi, '$1').replace(/<[^>]*>/g, '').trim()
      );
      if (cellContents.length > 0) {
        allRows.push(cellContents);
      }
    });
    
    if (allRows.length === 0) return '';
    
    const columnWidths = getColumnWidths(allRows);
    let tableMarkdown = '\n\n';
    
    allRows.forEach((cellContents, rowIndex) => {
      const paddedCells = cellContents.map((cell, colIndex) => 
        cell.padEnd(columnWidths[colIndex] || 3, ' ')
      );
      
      tableMarkdown += '| ' + paddedCells.join(' | ') + ' |\n';
      
      if (rowIndex === 0) {
        const separators = columnWidths.map(width => '-'.repeat(width));
        tableMarkdown += '| ' + separators.join(' | ') + ' |\n';
      }
    });
    
    return tableMarkdown + '\n';
  });
  
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_, content) => {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    const quoted = cleanContent.split('\n').map((line: string) => `> ${line.trim()}`).join('\n');
    return `\n\n${quoted}\n\n`;
  });
  
  md = md.replace(/<hr\s*\/?>/gi, '\n\n---\n\n');
  md = md.replace(/<[^>]*>/g, '');
  
  const entities: Record<string, string> = {
    '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"',
    '&#x27;': "'", '&#39;': "'", '&nbsp;': ' ',
    '&mdash;': '—', '&ndash;': '–', '&hellip;': '...'
  };
  
  for (const [entity, char] of Object.entries(entities)) {
    md = md.replace(new RegExp(entity, 'g'), char);
  }
  
  return postProcess(md);
}

export function htmlToMarkdown(html: string, baseUrl: string): string {
  if (!html || typeof html !== 'string') return '';
  if (!baseUrl || typeof baseUrl !== 'string') {
    throw new Error('baseUrl is required for markdown conversion');
  }

  try {
    return htmlToMarkdownRegex(html, baseUrl);
  } catch (error) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.error('[botmd] Error converting HTML to Markdown:', error);
    }
    return html;
  }
}

export function isHtmlContent(content: string): boolean {
  return !!(content && typeof content === 'string' && HTML_DETECTION_PATTERN.test(content));
}


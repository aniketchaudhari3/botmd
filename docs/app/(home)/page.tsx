import { DemoBrowser } from '@/components/demo-browser';
// import { detectBot } from 'botmd';
import Link from 'fumadocs-core/link';
import { GithubIcon } from 'lucide-react';
import { headers } from 'next/headers';

export default async function HomePage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  // const isBotRequest = detectBot(userAgent);

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="mb-4 max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-2">botmd</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Middleware that converts your HTML to markdown for AI agents and crawlers
        </p>
      </div>
      {/* {!isBotRequest && <DemoBrowser />} */}
      <DemoBrowser />
      {/* Go to docs button */}
      <div className="mt-6 text-center flex flex-row items-start justify-center gap-2">
        <Link
          href="/docs"
          className="rounded-3xl inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-sm"
        >
          Go to docs
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <Link
          href="https://github.com/aniketchaudhari3/botmd"
          className="ml-2 rounded-3xl inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors text-sm"
        >
          <GithubIcon size={16} /> Github
        </Link>
      </div>
    </main>
  );
}

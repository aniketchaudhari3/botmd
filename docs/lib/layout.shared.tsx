import { GithubInfo } from 'fumadocs-ui/components/github-info';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { GithubIcon } from 'lucide-react';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          botmd
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [
      {
        text: 'Github',
        type: 'icon',
        icon: <GithubIcon />,
        url: 'https://github.com/aniketchaudhari3/botmd',
        secondary: true,
      },
      {
        text: 'Documentation',
        url: '/docs',
        secondary: false,
      },
      {
        text: 'Github',
        url: 'https://github.com/aniketchaudhari3/botmd',
        secondary: false,
      },
      {
        text: 'npm',
        url: 'https://www.npmjs.com/package/botmd',
        secondary: false,
      },
    ],
  };
}

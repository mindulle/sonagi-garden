import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Markdown 플러그인들
import remarkGfm from 'remark-gfm';
import remarkWikilinks, { initNoteCache } from './src/utils/remark-wikilinks.ts';
import path from 'path';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// 빌드 시점에 노트 정보 캐싱
initNoteCache(path.resolve('./content'));

// https://astro.build/config
export default defineConfig({
  site: 'https://sonagi-garden.vercel.app',
  integrations: [
    react({
      // React 컴포넌트를 부분적으로 하이드레이션
      include: ['**/components/**/*.tsx', '**/components/**/*.jsx']
    })
  ],

  markdown: {
    // Markdown 플러그인 설정
    remarkPlugins: [
      remarkGfm,
      remarkWikilinks // 커스텀 위키링크 플러그인 (인자 없음)
    ],

    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          className: ['heading-anchor']
        }
      }]
    ],

    // 구문 강조 설정
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
      langs: []
    }
  },

  // 경로 별칭 설정
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
});

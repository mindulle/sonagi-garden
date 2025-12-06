import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Markdown 플러그인들
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

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
      [remarkWikiLink, {
        // Obsidian 스타일 위키링크 [[note]] 지원
        aliasDivider: '|',
        hrefTemplate: (permalink) => {
          // 노트 이름을 그대로 URL로 변환
          /// 나중에 실제 노트 경로를 확인하는 로직 추가 필요
          return `/notes/${permalink}`;
        }
      }]
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

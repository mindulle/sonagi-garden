import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 설정
const CONFIG = {
  sourceRoot: path.resolve(__dirname, '..', '..', 'garden', 'content'),
  targetRoot: path.join(__dirname, '..', 'content'),

  // 마이그레이션할 경로 매핑 (확장됨!)
  mappings: [
    // Frontend - Performance
    {
      source: 'Develop/Frontend/tree/Perf-opt/React',
      target: 'dev/frontend/performance/react',
      category: 'dev',
      defaultTags: ['react', 'performance']
    },
    {
      source: 'Develop/Frontend/tree/Perf-opt/vanilla',
      target: 'dev/frontend/performance/vanilla',
      category: 'dev',
      defaultTags: ['javascript', 'performance']
    },

    // Frontend - Rendering Patterns
    {
      source: 'Develop/Frontend/tree/rendering patterns/react',
      target: 'dev/frontend/rendering-patterns/react',
      category: 'dev',
      defaultTags: ['react', 'rendering', 'ssr', 'csr']
    },
    {
      source: 'Develop/Frontend/tree/rendering patterns/vanilla',
      target: 'dev/frontend/rendering-patterns/vanilla',
      category: 'dev',
      defaultTags: ['javascript', 'rendering']
    },

    // Frontend - Internals
    {
      source: 'Develop/Frontend/tree/Under the hood/javascript',
      target: 'dev/javascript/internals',
      category: 'dev',
      defaultTags: ['javascript', 'internals']
    },
    {
      source: 'Develop/Frontend/tree/Under the hood/Nodejs',
      target: 'dev/nodejs/internals',
      category: 'dev',
      defaultTags: ['nodejs', 'internals']
    },
    {
      source: 'Develop/Frontend/tree/Under the hood/React',
      target: 'dev/react/internals',
      category: 'dev',
      defaultTags: ['react', 'internals']
    },

    // Commons - Concepts (seed)
    {
      source: 'Develop/_commons/seed/Concept/Javascript',
      target: 'dev/javascript/concepts',
      category: 'dev',
      defaultTags: ['javascript', 'concept']
    },
    {
      source: 'Develop/_commons/seed/Concept/React',
      target: 'dev/react/concepts',
      category: 'dev',
      defaultTags: ['react', 'concept']
    },
    {
      source: 'Develop/_commons/seed/Concept/Nodejs',
      target: 'dev/nodejs/concepts',
      category: 'dev',
      defaultTags: ['nodejs', 'concept']
    },

    // Design
    {
      source: 'Design/Ux',
      target: 'design/ux',
      category: 'design',
      defaultTags: ['ux', 'design']
    },
    {
      source: 'Design/Ui',
      target: 'design/ui',
      category: 'design',
      defaultTags: ['ui', 'design']
    },

    // Writing
    {
      source: 'Writing',
      target: 'life/writing',
      category: 'life',
      defaultTags: ['writing', 'essay']
    }
  ],

  // 경로 매핑 규칙 (위키링크 변환용)
  pathMappings: {
    'Develop/Frontend/tree/Perf-opt/React': 'dev/frontend/performance/react',
    'Develop/Frontend/tree/Perf-opt/vanilla': 'dev/frontend/performance/vanilla',
    'Develop/Frontend/tree/rendering patterns/react': 'dev/frontend/rendering-patterns/react',
    'Develop/Frontend/tree/rendering patterns/vanilla': 'dev/frontend/rendering-patterns/vanilla',
    'Develop/Frontend/tree/Under the hood/javascript': 'dev/javascript/internals',
    'Develop/Frontend/tree/Under the hood/Nodejs': 'dev/nodejs/internals',
    'Develop/Frontend/tree/Under the hood/React': 'dev/react/internals',
    'Develop/_commons/seed/Concept/Javascript': 'dev/javascript/concepts',
    'Develop/_commons/seed/Concept/React': 'dev/react/concepts',
    'Develop/_commons/seed/Concept/Nodejs': 'dev/nodejs/concepts',
    'Design/Ux': 'design/ux',
    'Design/Ui': 'design/ui',
    'Writing': 'life/writing'
  }
};

/**
 * 파일명을 kebab-case로 변환
 * "How to Lazy Load Components in React.md" -> "how-to-lazy-load-components-in-react.md"
 */
function toKebabCase(filename) {
  return filename
    .replace(/\.md$/, '') // 확장자 제거
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // 특수문자를 하이픈으로
    .replace(/^-+|-+$/g, '') // 앞뒤 하이픈 제거
    + '.md';
}

/**
 * 파일명에서 제목 추출 (원본 이름 사용)
 */
function extractTitleFromFilename(filename) {
  return filename.replace(/\.md$/, '');
}

/**
 * 내용에서 추가 태그 추출
 */
function extractTagsFromContent(content, defaultTags) {
  const tags = new Set(defaultTags);

  const commonKeywords = [
    'react', 'vue', 'angular', 'svelte', 'solid',
    'javascript', 'typescript', 'nodejs', 'deno', 'bun',
    'performance', 'optimization', 'lazy', 'suspense',
    'ssr', 'csr', 'ssg', 'isr', 'hydration', 'rendering',
    'dom', 'virtual', 'fiber', 'hooks', 'state', 'props',
    'component', 'api', 'async', 'promise', 'async-await',
    'design', 'ux', 'ui', 'accessibility', 'a11y',
    'css', 'html', 'web', 'browser'
  ];

  const lowerContent = content.toLowerCase();
  commonKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      tags.add(keyword);
    }
  });

  return Array.from(tags).slice(0, 8);
}

/**
 * 내용에서 짧은 설명 추출
 */
function extractDescription(content) {
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('```') &&
      !trimmed.startsWith('[[') &&
      !trimmed.startsWith('---') &&
      trimmed.length > 20) {
      return trimmed.slice(0, 150) + (trimmed.length > 150 ? '...' : '');
    }
  }

  return '';
}

/**
 * 위키링크 경로 변환
 * [[Develop/Frontend/tree/Perf-opt/React/lazy-loading|Lazy]] 
 * -> [[dev/frontend/performance/react/lazy-loading|Lazy]]
 */
function convertWikiLinks(content) {
  const wikiLinkRegex = /\[\[([^\]|]+)(\|[^\]]+)?\]\]/g;

  return content.replace(wikiLinkRegex, (match, linkPath, displayText) => {
    let newPath = linkPath;

    // 경로 매핑 적용
    for (const [oldPath, newPath_] of Object.entries(CONFIG.pathMappings)) {
      if (linkPath.startsWith(oldPath)) {
        newPath = linkPath.replace(oldPath, newPath_);
        break;
      }
    }

    // 파일명도 kebab-case로 변환
    const pathParts = newPath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    if (fileName && !fileName.includes('.')) {
      pathParts[pathParts.length - 1] = toKebabCase(fileName + '.md').replace('.md', '');
      newPath = pathParts.join('/');
    }

    return `[[${newPath}${displayText || ''}]]`;
  });
}

/**
 * 파일의 해시값 계산 (중복 감지용)
 */
function calculateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * 프론트매터 생성
 */
function createFrontmatter(filename, content, category, defaultTags) {
  const title = extractTitleFromFilename(filename);
  const tags = extractTagsFromContent(content, defaultTags);
  const description = extractDescription(content);
  const date = new Date().toISOString().split('T')[0];

  return `---
title: "${title}"
date: ${date}
tags: [${tags.join(', ')}]
category: ${category}
description: "${description}"
---

`;
}

/**
 * 단일 파일 마이그레이션
 */
async function migrateFile(sourcePath, targetDir, category, defaultTags, duplicateMap) {
  try {
    // 원본 파일 읽기
    const content = await fs.readFile(sourcePath, 'utf-8');
    const originalFilename = path.basename(sourcePath);

    // 중복 감지
    const contentHash = calculateHash(content);
    if (duplicateMap.has(contentHash)) {
      console.log(`  ⏭️  중복 파일 건너뜀: ${originalFilename} (이미 존재: ${duplicateMap.get(contentHash)})`);
      return { status: 'duplicate', file: originalFilename };
    }

    // 파일명 정규화
    const newFilename = toKebabCase(originalFilename);
    const targetPath = path.join(targetDir, newFilename);

    // 이미 파일이 존재하는지 확인
    try {
      await fs.access(targetPath);
      console.log(`  ⏭️  이미 존재: ${newFilename}`);
      duplicateMap.set(contentHash, newFilename);
      return { status: 'exists', file: newFilename };
    } catch {
      // 파일이 없으면 계속 진행
    }

    // 위키링크 변환
    const convertedContent = convertWikiLinks(content);

    // 프론트매터가 이미 있는지 확인
    let finalContent;
    if (convertedContent.trim().startsWith('---')) {
      // 이미 프론트매터가 있으면 내용만 변환
      finalContent = convertedContent;
    } else {
      // 프론트매터 생성
      const frontmatter = createFrontmatter(
        originalFilename,
        convertedContent,
        category,
        defaultTags
      );
      finalContent = frontmatter + convertedContent;
    }

    // 파일 쓰기
    await fs.writeFile(targetPath, finalContent, 'utf-8');
    duplicateMap.set(contentHash, newFilename);

    if (originalFilename !== newFilename) {
      console.log(`  ✅ ${originalFilename} → ${newFilename}`);
    } else {
      console.log(`  ✅ ${newFilename}`);
    }

    return { status: 'migrated', file: newFilename, originalFile: originalFilename };

  } catch (error) {
    console.error(`  ❌ 오류: ${path.basename(sourcePath)} - ${error.message}`);
    return { status: 'error', file: path.basename(sourcePath), error: error.message };
  }
}

/**
 * 디렉토리의 모든 마크다운 파일 마이그레이션
 */
async function migrateDirectory(mapping, duplicateMap) {
  const sourcePath = path.join(CONFIG.sourceRoot, mapping.source);
  const targetPath = path.join(CONFIG.targetRoot, mapping.target);

  console.log(`\n📂 ${mapping.source}`);
  console.log(`   → ${mapping.target}`);

  try {
    // 원본 디렉토리 존재 확인
    try {
      await fs.access(sourcePath);
    } catch {
      console.log(`   ⚠️  원본 디렉토리 없음, 건너뜀`);
      return [];
    }

    // 대상 디렉토리 생성
    await fs.mkdir(targetPath, { recursive: true });

    // 원본 디렉토리의 파일 목록
    const files = await fs.readdir(sourcePath);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.log(`   ℹ️  마크다운 파일 없음`);
      return [];
    }

    console.log(`   📄 ${mdFiles.length}개 파일 발견`);

    // 각 파일 마이그레이션
    const results = [];
    for (const file of mdFiles) {
      const sourceFilePath = path.join(sourcePath, file);
      const result = await migrateFile(
        sourceFilePath,
        targetPath,
        mapping.category,
        mapping.defaultTags,
        duplicateMap
      );
      results.push(result);
    }

    return results;

  } catch (error) {
    console.error(`❌ 디렉토리 처리 실패: ${error.message}`);
    return [];
  }
}

/**
 * 메인 함수
 */
async function main() {
  console.log('🌱 Sonagi Garden 노트 마이그레이션 v2\n');
  console.log(`원본: ${CONFIG.sourceRoot}`);
  console.log(`대상: ${CONFIG.targetRoot}\n`);
  console.log('✨ 개선사항:');
  console.log('  - 위키링크 경로 자동 변환');
  console.log('  - 파일명 kebab-case 정규화');
  console.log('  - 중복 파일 자동 감지\n');

  const allResults = [];
  const duplicateMap = new Map(); // 중복 감지용

  // 각 매핑에 대해 마이그레이션 실행
  for (const mapping of CONFIG.mappings) {
    const results = await migrateDirectory(mapping, duplicateMap);
    allResults.push(...results);
  }

  // 통계 출력
  console.log('\n' + '='.repeat(60));
  console.log('📊 마이그레이션 완료\n');

  const migrated = allResults.filter(r => r.status === 'migrated').length;
  const exists = allResults.filter(r => r.status === 'exists').length;
  const duplicate = allResults.filter(r => r.status === 'duplicate').length;
  const errors = allResults.filter(r => r.status === 'error').length;

  console.log(`✅ 새로 마이그레이션: ${migrated}개`);
  console.log(`⏭️  이미 존재: ${exists}개`);
  console.log(`🔄 중복 파일: ${duplicate}개`);
  console.log(`❌ 오류: ${errors}개`);
  console.log(`📝 총 처리: ${allResults.length}개 파일`);

  if (errors > 0) {
    console.log('\n⚠️  오류 파일:');
    allResults
      .filter(r => r.status === 'error')
      .forEach(r => console.log(`  - ${r.file}: ${r.error}`));
  }

  console.log('\n🎉 완료!');
}

// 실행
main().catch(console.error);
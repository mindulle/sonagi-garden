import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 설정
const CONFIG = {
  sourceRoot: path.resolve(__dirname, '..', '..', 'garden-v4', 'content'),
  targetRoot: path.join(__dirname, '..', 'content'),
  // 마이그레이션할 경로 매핑
  mappings: [
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
    }
  ]
};

/**
 * 파일명에서 제목 추출
 * "How to lazy load components in React.md" -> "How to Lazy Load Components in React"
 */
function extractTitleFromFilename(filename) {
  return filename
    .replace(/\.md$/, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 내용에서 추가 태그 추출 (간단한 휴리스틱)
 */
function extractTagsFromContent(content, defaultTags) {
  const tags = new Set(defaultTags);
  
  const commonKeywords = [
    'react', 'vue', 'angular', 'javascript', 'typescript', 'nodejs',
    'performance', 'optimization', 'lazy', 'suspense', 'ssr', 'csr',
    'hydration', 'rendering', 'dom', 'virtual', 'fiber', 'hooks',
    'state', 'props', 'component', 'api', 'async', 'promise'
  ];
  
  const lowerContent = content.toLowerCase();
  commonKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      tags.add(keyword);
    }
  });
  
  return Array.from(tags).slice(0, 8); // 최대 8개 태그
}

/**
 * 내용에서 짧은 설명 추출 (첫 번째 문단)
 */
function extractDescription(content) {
  // 프론트매터와 제목을 제거
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    // 빈 줄, 제목(#), 코드 블록(```), 링크([[)는 건너뛰기
    if (trimmed && 
        !trimmed.startsWith('#') && 
        !trimmed.startsWith('```') &&
        !trimmed.startsWith('[[') &&
        trimmed.length > 20) {
      return trimmed.slice(0, 150) + (trimmed.length > 150 ? '...' : '');
    }
  }
  
  return '';
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
async function migrateFile(sourcePath, targetPath, category, defaultTags) {
  try {
    // 원본 파일 읽기
    const content = await fs.readFile(sourcePath, 'utf-8');
    
    // 이미 프론트매터가 있는지 확인
    if (content.trim().startsWith('---')) {
      console.log(`  ⏭️  이미 프론트매터가 있음: ${path.basename(sourcePath)}`);
      // 그대로 복사
      await fs.writeFile(targetPath, content, 'utf-8');
      return { status: 'exists', file: path.basename(sourcePath) };
    }
    
    // 프론트매터 생성
    const frontmatter = createFrontmatter(
      path.basename(sourcePath),
      content,
      category,
      defaultTags
    );
    
    // 새 내용 = 프론트매터 + 원본 내용
    const newContent = frontmatter + content;
    
    // 대상 파일 쓰기
    await fs.writeFile(targetPath, newContent, 'utf-8');
    
    console.log(`  ✅ 마이그레이션 완료: ${path.basename(sourcePath)}`);
    return { status: 'migrated', file: path.basename(sourcePath) };
    
  } catch (error) {
    console.error(`  ❌ 오류: ${path.basename(sourcePath)} - ${error.message}`);
    return { status: 'error', file: path.basename(sourcePath), error: error.message };
  }
}

/**
 * 디렉토리의 모든 마크다운 파일 마이그레이션
 */
async function migrateDirectory(mapping) {
  const sourcePath = path.join(CONFIG.sourceRoot, mapping.source);
  const targetPath = path.join(CONFIG.targetRoot, mapping.target);
  
  console.log(`\n📂 ${mapping.source} → ${mapping.target}`);
  
  try {
    // 대상 디렉토리 생성
    await fs.mkdir(targetPath, { recursive: true });
    
    // 원본 디렉토리의 파일 목록
    const files = await fs.readdir(sourcePath);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`   ${mdFiles.length}개 파일 발견`);
    
    // 각 파일 마이그레이션
    const results = [];
    for (const file of mdFiles) {
      const sourceFilePath = path.join(sourcePath, file);
      const targetFilePath = path.join(targetPath, file);
      
      const result = await migrateFile(
        sourceFilePath,
        targetFilePath,
        mapping.category,
        mapping.defaultTags
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
  console.log('🌱 Sonagi Garden 노트 마이그레이션 시작\n');
  console.log(`원본: ${CONFIG.sourceRoot}`);
  console.log(`대상: ${CONFIG.targetRoot}\n`);
  
  const allResults = [];
  
  // 각 매핑에 대해 마이그레이션 실행
  for (const mapping of CONFIG.mappings) {
    const results = await migrateDirectory(mapping);
    allResults.push(...results);
  }
  
  // 통계 출력
  console.log('\n' + '='.repeat(50));
  console.log('📊 마이그레이션 완료\n');
  
  const migrated = allResults.filter(r => r.status === 'migrated').length;
  const exists = allResults.filter(r => r.status === 'exists').length;
  const errors = allResults.filter(r => r.status === 'error').length;
  
  console.log(`✅ 마이그레이션: ${migrated}개`);
  console.log(`⏭️  이미 존재: ${exists}개`);
  console.log(`❌ 오류: ${errors}개`);
  console.log(`📝 총: ${allResults.length}개 파일 처리`);
  
  if (errors > 0) {
    console.log('\n오류 파일:');
    allResults
      .filter(r => r.status === 'error')
      .forEach(r => console.log(`  - ${r.file}: ${r.error}`));
  }
  
  console.log('\n🎉 완료!');
}

// 실행
main().catch(console.error);
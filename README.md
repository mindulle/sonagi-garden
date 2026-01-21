# 🌱 Sonagi Garden

청량한 디지털 정원 - Astro와 Sonagi 디자인 시스템 기반

## 개요

Obsidian 마크다운 노트를 웹에 쉽게 배포하는 정적 사이트 생성기입니다. Sonagi 디자인 시스템의 청량하고 시원한 느낌을 담았습니다.

## 기술 스택

- **프레임워크**: Astro 4
- **UI**: Sonagi Design System (React)
- **언어**: TypeScript
- **스타일**: CSS Modules + Design Tokens
- **배포**: Vercel / Netlify / GitHub Pages

## 프로젝트 구조

```
sonagi-garden/
├── content/              # 마크다운 노트
│   ├── dev/             # 개발 관련
│   ├── design/          # 디자인 관련
│   └── life/            # 일상, 에세이
├── src/
│   ├── components/      # UI 컴포넌트
│   ├── layouts/         # 페이지 레이아웃
│   ├── pages/           # 라우팅
│   ├── styles/          # 전역 스타일
│   └── utils/           # 유틸리티
├── public/              # 정적 파일
└── astro.config.mjs     # Astro 설정
```

## 개발 시작하기

### 필수 요구사항

- Node.js 18 이상
- pnpm 8 이상

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 빌드
pnpm build

# 프리뷰
pnpm preview
```

## 노트 작성하기

### 프론트매터

```yaml
---
title: 노트 제목
date: 2025-01-27
tags: [tag1, tag2]
category: dev
draft: false
description: 노트 설명
---
```

### 위키링크

```markdown
[[other-note]] - 다른 노트로 링크
[[note|표시 텍스트]] - 커스텀 텍스트로 링크
```

## 개발 로드맵

### Phase 1: MVP ✅

- [x] Astro 프로젝트 세팅
- [x] 기본 레이아웃
- [x] 홈페이지
- [x] 마크다운 렌더링
- [x] 노트 페이지 렌더링

### Phase 2: Core Features ✅

- [x] 위키링크 처리
- [x] 검색 기능
- [x] 백링크
- [x] TOC 자동 생성
- [x] 다크 모드
- [x] 그래프 뷰 (Phase 3에서 앞당김)
- [x] RSS 피드 (Phase 3에서 앞당김)

### Phase 3: 확장 기능 (진행 중)

- [x] 댓글 시스템 (Giscus)
- [x] SEO 최적화 (Sitemap, Metadata)
- [x] 배포 최적화

## 배포 (Deployment)

이 프로젝트는 Vercel 배포에 최적화되어 있습니다.

1. Vercel 대시보드에서 `Importer Git Repository` 선택
2. `Build Command`: `pnpm build`
3. `Output Directory`: `dist`
4. `Install Command`: `pnpm install`
5. 환경 변수는 별도로 필요하지 않지만, Giscus 설정 시 `Comments.tsx`의 ID 값 확인 필요.

## Sonagi 디자인 시스템 통합

현재는 임시 토큰을 사용 중입니다. Sonagi 디자인 시스템 연결 후:

```bash
# 패키지 링크
pnpm link ../sonagi-design-system/packages/react
pnpm link ../sonagi-design-system/packages/tokens
```

## 라이선스

MIT License

## 기여하기

이슈와 PR은 언제나 환영합니다! 🌿

---
title: "Getting Started with Sonagi Garden"
date: 2025-01-27
tags: [setup, guide, astro]
category: dev
draft: false
description: "Sonagi Garden으로 디지털 정원을 시작하는 방법"
---

# Getting Started with Sonagi Garden

Sonagi Garden에 오신 것을 환영합니다! 🌱

## 소개

Sonagi Garden은 Astro와 Sonagi 디자인 시스템을 기반으로 한 디지털 정원입니다. Obsidian 마크다운 노트를 웹에 쉽게 배포할 수 있습니다.

## 주요 특징

### 1. 청량한 디자인
비 온 뒤의 맑고 깨끗한 느낌을 디자인으로 표현했습니다. Sonagi 디자인 시스템의 일관된 스타일을 경험해보세요.

### 2. 마크다운 지원
- GitHub Flavored Markdown (GFM)
- Obsidian 위키링크 `[[note]]`
- 코드 하이라이팅
- 프론트매터 메타데이터

### 3. 빠른 성능
Astro의 정적 사이트 생성으로 매우 빠른 로딩 속도를 제공합니다.

## 다음 단계

- [[installation]] - 설치 가이드
- [[writing-notes]] - 노트 작성 방법
- [[configuration]] - 설정 커스터마이징

## 코드 예시

```typescript
// Astro 컴포넌트 예시
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
```

```css
/* Sonagi 토큰 활용 */
.card {
  background: var(--sonagi-color-surface);
  padding: var(--sonagi-spacing-lg);
  border-radius: var(--sonagi-radius-md);
}
```

---

*Last updated: 2025-01-27*

---
title: "Wikilink Test"
date: 2025-11-27
tags: [test, wikilink]
category: dev
draft: false
description: "Testing wikilink functionality"
---

# Wikilink Test

이 노트는 위키링크 기능을 테스트하기 위한 노트입니다.

## 위키링크 예시

### 작동하는 링크
- [[getting-started]] - 시작 가이드
- [[getting-started|커스텀 텍스트]] - 별칭이 있는 링크

### React 관련 링크
- [[basics]] - React 렌더링 기초
- [[optimization]] - React 최적화
- [[state]] - React 상태 관리

### 깨진 링크 (존재하지 않는 노트)
- [[non-existent-note]] - 이 링크는 작동하지 않을 것입니다
- [[another-missing|없는 노트]] - 별칭이 있는 깨진 링크

## 기대 동작

- 존재하는 노트로의 링크는 청록색(primary color)으로 표시되며 호버 시 배경이 나타남
- 깨진 링크는 회색으로 표시되며 점선 밑줄이 그어짐
- 모든 링크는 Sonagi 디자인 토큰을 사용하여 스타일링됨

---

**Note**: 이 노트는 위키링크 구현 후 삭제할 수 있습니다.

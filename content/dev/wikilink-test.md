---
title: WikiLink Test
date: 2025-01-01
tags: [wikilink, test]
category: dev
description: Testing custom wiki link resolution
---

# WikiLink Test

This note tests the custom wiki link resolution logic.

## Direct Links
- [[Architecture]] (Same directory, if exists)
- [[Getting Started]] (Should resolve to /notes/dev/getting-started)
- [[broken-link]] (Should be red/broken)

## Aliased Links
- [[Getting Started|Start Here]] (Should show as "Start Here")

## Case Insensitivity
- [[getting started]] (Should resolve)
- [[GETTING STARTED]] (Should resolve)

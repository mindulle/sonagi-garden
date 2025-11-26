---
title: How React Virtual DOM Works
date: 2024-01-15
category: dev
tags: [react, internals, virtual-dom, reconciliation]
description: Understanding how React's Virtual DOM works
---

# How React Virtual DOM Works

Virtual DOM works in these steps:

1. Whenever any underlying data changes, new virtual DOM representation will be created.
2. Then the difference between the previous DOM representation and the new one is calculated.
3. Once the calculations are done, the real DOM will be updated with only the things that have actually changed.
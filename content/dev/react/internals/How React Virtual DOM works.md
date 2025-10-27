---
title: "How React Virtual DOM Works"
date: 2025-10-27
tags: [react, internals, dom, virtual]
category: dev
description: "Virtual DOM works in this steps:"
---

Virtual DOM works in this steps:

1. Whenever any underlying data changes, new virtual DOM representation will be created.
2. Then the difference between the previous DOM representation and the new one is calculated.
3. Once the calculations are done, the real DOM will be updated with only the things that have actually changed.
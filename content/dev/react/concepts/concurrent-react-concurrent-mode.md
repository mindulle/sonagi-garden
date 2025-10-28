---
title: "Concurrent React (Concurrent Mode)"
date: 2025-10-28
tags: [react, concept, rendering, component, ui]
category: dev
description: "Concurrent React, previously referred to as Concurrent Mode, is a set of new features in React that allows React to interrupt the rendering process to..."
---

Concurrent React, previously referred to as Concurrent Mode, is a set of new features in React that allows React to interrupt the rendering process to consider more urgent tasks, making it possible for React to be more responsive to user input and produce smoother user experiences. It lets React keep the UI responsive while rendering large component trees by splitting the rendering work into smaller chunks and spreading it over multiple frames.
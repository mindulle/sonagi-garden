---
title: "Does Arrow functions have their own `this`"
date: 2025-10-28
tags: [javascript, internals]
category: dev
description: "No, arrow functions do not have their own `this`. Instead, they inherit the `this` of the enclosing lexical scope."
---

No, arrow functions do not have their own `this`. Instead, they inherit the `this` of the enclosing lexical scope.
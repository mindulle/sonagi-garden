---
title: "What are Explicit binding in JavaScript"
date: 2025-10-28
tags: [javascript, concept, state]
category: dev
description: "Explicit binding is a way to explicitly state what the `this` keyword is going to be bound to using `call`, `apply` or `bind` methods of a function."
---

Explicit binding is a way to explicitly state what the `this` keyword is going to be bound to using `call`, `apply` or `bind` methods of a function.

```js
const roadmap = {
  name: 'JavaScript',
};

function printName() {
  console.log(this.name);
}

printName.call(roadmap); // JavaScript
printName.apply(roadmap); // JavaScript

const printRoadmapName = printName.bind(roadmap);
printRoadmapName(); // JavaScript
```

In the above example, the `this` keyword inside the `printName()` function is explicitly bound to the `roadmap` object using `call`, `apply` or `bind` methods.
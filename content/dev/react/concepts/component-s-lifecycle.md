---
title: "component's lifecycle"
date: 2025-10-28
tags: [react, concept, dom, hooks, state, component]
category: dev
description: "In React functional components, **lifecycle-like behaviors** are achieved ==using hooks==:"
---

In React functional components, **lifecycle-like behaviors** are achieved ==using hooks==:
<!--SR:!2024-05-21,1,230-->

## Mounting and Unmounting

Utilizing the useEffect hook with an empty dependency array ([]) ensures the hook runs **after** ==the component mounts to the DOM==.
<!--SR:!2024-05-21,1,230-->

```js
useEffect(() => {
  // do something after component mounts
  return () => {
    // do something before component unmounts
  };
}, []);
```

The cleanup function returned within the useEffect callback offers a mechanism for handling tasks when the component is about to **unmount**.

## Updates

The useEffect hook, when invoked without a dependency array or with specific dependencies, executes **after** ==every render== or when ==specified prop/state changes are detected==.
<!--SR:!2024-05-21,1,230!2024-05-21,1,230-->

```js
useEffect(() => {
  // do something after every render
});
```

```js
useEffect(() => {
  // do something after specific prop/state changes
}, [state1, state2]);
```
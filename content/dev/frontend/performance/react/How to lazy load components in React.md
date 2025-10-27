---
title: "How To Lazy Load Components In React"
date: 2025-10-27
tags: [react, performance, lazy, suspense, state, component, promise]
category: dev
description: "You can use React's `lazy()` function in conjunction with dynamic `import()` to lazily load a component. This is often combined with `Suspense` to dis..."
---

You can use React's `lazy()` function in conjunction with dynamic `import()` to lazily load a component. This is often combined with `Suspense` to display fallback content while the component is being loaded.

```js
// The component has to be exported as a default export
export default function RoadmapRender() {
  return <h1>This is a lazily-loaded component!</h1>;
}
```

```js
import { lazy, Suspense } from 'react';

const LazyRoadmapRender = lazy(() => delay(import('./RoadmapRender')));

export function App() {
  const [showRoadmapRender, setShowRoadmapRender] = useState(false);
  return (
    <>
      <button onClick={() => setShowRoadmapRender(true)}>
        Show RoadmapRender
      </button>
      {showRoadmapRender && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyRoadmapRender />
        </Suspense>
      )}
    </>
  );
}

// Helper function to simulate a 2 seconds delay
function delay(promise) {
  return new Promise((resolve) => setTimeout(resolve, 2000)).then(
    () => promise
  );
}
```

The `RoadmapRender` component is lazily loaded and rendered inside the `Suspense` component. While the component is being loaded, the `Suspense` component will display the fallback content.
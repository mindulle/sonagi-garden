---
title: "What is the difference between Real DOM and Virtual DOM"
date: 2025-10-28
tags: [react, internals, javascript, dom, virtual, ui, browser]
category: dev
description: "Virtual DOM is the representation of a UI in the form of a plain javascript object. It is a node tree that lists the elements, their attributes and co..."
---

Virtual DOM is the representation of a UI in the form of a plain javascript object. It is a node tree that lists the elements, their attributes and content as Objects and their properties. Real DOM is the real representation of a UI which can be seen and inspected in the browser. Manipulating the virtual DOM is much faster than real DOM, because nothing gets drawn on the screen. React uses this virtual DOM to figure out the most efficient way to update the browser DOM.
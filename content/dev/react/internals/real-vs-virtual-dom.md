---
title: Real DOM vs Virtual DOM
date: 2024-01-15
category: dev
tags: [react, internals, virtual-dom, dom, performance]
description: Understanding the difference between Real DOM and Virtual DOM
---

# Real DOM vs Virtual DOM

Virtual DOM is the representation of a UI in the form of a plain javascript object. It is a node tree that lists the elements, their attributes and content as Objects and their properties. Real DOM is the real representation of a UI which can be seen and inspected in the browser. Manipulating the virtual DOM is much faster than real DOM, because nothing gets drawn on the screen. React uses this virtual DOM to figure out the most efficient way to update the browser DOM.
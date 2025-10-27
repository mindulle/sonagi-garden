---
title: "How Does React Handle Prop Drilling, And What Are The Downsides Of Excessive Prop Drilling"
date: 2025-10-27
tags: [react, internals, state, props, component, api]
category: dev
description: "Prop drilling is the process of passing data from a parent component to deeply nested child components through props. While React doesn't prohibit thi..."
---

Prop drilling is the process of passing data from a parent component to deeply nested child components through props. While React doesn't prohibit this, it can lead to code that is hard to maintain and understand. Excessive prop drilling can make it challenging to track data flow and can result in unnecessary re-renders. To mitigate these issues, you can use Context API or state management libraries like Redux.
# Spec: 006-search-functionality

## 1. Overview
Implement client-side search functionality that allows users to quickly find notes by title, content, or tags. Uses a lightweight search library for fast, fuzzy matching.

## 2. User Stories / Requirements
- [ ] User can open search with keyboard shortcut (Cmd/Ctrl+K)
- [ ] User can search by note title, content preview, or tags
- [ ] Search results are ranked by relevance
- [ ] Search supports fuzzy matching for typos
- [ ] Results show note title, category, and preview snippet
- [ ] Clicking result navigates to that note
- [ ] Search is fast (<100ms for typical query)

## 3. Technical Design

### Search Library
- **Pagefind**: Static search library for Astro
  - Alternative: **Fuse.js** for client-side fuzzy search
  - Generates search index at build time
  - Lightweight and performant

### Components
- **SearchModal**: Overlay modal for search interface
  - Input field with live results
  - Result list with keyboard navigation
  - Esc to close, Enter to navigate
  - Highlight matching text

### Search Index
```typescript
interface SearchDocument {
  id: string;           // note path
  title: string;        // note title
  category: string;     // dev/design/life
  tags: string[];       // tags array
  content: string;      // full content or excerpt
  url: string;          // note URL
}
```

### UI/UX
- **Trigger**: Search icon in header + keyboard shortcut
- **Modal**: Centered overlay with backdrop blur
- **Results**: List with title, category badge, excerpt
- **Keyboard**: Arrow keys to navigate, Enter to open, Esc to close

### Implementation Options
1. **Pagefind** (recommended for static sites)
   - Build-time indexing
   - Zero runtime overhead
   - Great for SEO

2. **Fuse.js** (simpler integration)
   - Client-side only
   - More flexible
   - Larger bundle size

## 4. Implementation Plan
1. [ ] Choose search library (Pagefind vs Fuse.js)
2. [ ] Install and configure search library
3. [ ] Create search index generation script
4. [ ] Build `src/components/ui/SearchModal.tsx`
5. [ ] Add search trigger to header navigation
6. [ ] Implement keyboard shortcuts (Cmd/Ctrl+K)
7. [ ] Style search modal and results
8. [ ] Test search accuracy and performance
9. [ ] Add search to documentation

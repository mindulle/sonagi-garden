# Spec: 005-toc-generation

## 1. Overview
Automatically generate a Table of Contents (TOC) for note pages based on markdown headings. The TOC provides quick navigation within long articles and improves content discoverability.

## 2. User Stories / Requirements
- [ ] User sees TOC on the side (desktop) or collapsed section (mobile)
- [ ] TOC includes headings from h2 to h4 (h1 is page title)
- [ ] Clicking TOC item scrolls to that section
- [ ] Current section is highlighted in TOC (scroll spy)
- [ ] TOC is sticky and follows scroll on desktop
- [ ] TOC auto-hides if note has fewer than 3 headings

## 3. Technical Design

### Components
- **TOC**: React component for table of contents
  - Receives headings array as prop
  - Implements scroll spy for active section
  - Sticky positioning on desktop
  - Collapsible accordion on mobile

### Data Extraction
- Use `rehype-slug` (already installed) to add IDs to headings
- Use `rehype-autolink-headings` (already installed) for anchor links
- Extract headings structure from markdown AST
- Pass headings to layout via props

### Heading Structure
```typescript
interface Heading {
  depth: number;      // 2, 3, or 4
  text: string;       // heading text
  id: string;         // slug for anchor
}
```

### Layout
- **Desktop**: Fixed sidebar on right side
- **Mobile**: Collapsible section before content
- **Breakpoint**: 1024px

### Scroll Spy
- Use IntersectionObserver to detect visible headings
- Highlight current section in TOC
- Smooth scroll behavior for TOC clicks

## 4. Implementation Plan
1. [ ] Create utility to extract headings from markdown
2. [ ] Update note layout to pass headings to TOC component
3. [ ] Create `src/components/ui/TOC.tsx` component
4. [ ] Implement scroll spy with IntersectionObserver
5. [ ] Style TOC for desktop and mobile layouts
6. [ ] Test with notes of varying lengths
7. [ ] Add conditional rendering (hide if < 3 headings)

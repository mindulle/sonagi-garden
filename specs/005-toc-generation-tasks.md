# Tasks: 005-toc-generation

## Phase 1: Heading Extraction
- [ ] Create utility to extract headings from markdown AST
- [ ] Filter headings (h2-h4 only)
- [ ] Generate slugs for anchor links
- [ ] Update note layout to pass headings to component

## Phase 2: TOC Component
- [ ] Create `src/components/ui/TOC.tsx`
- [ ] Implement desktop sticky sidebar layout
- [ ] Implement mobile collapsible layout
- [ ] Add smooth scroll behavior

## Phase 3: Scroll Spy
- [ ] Implement IntersectionObserver for active section detection
- [ ] Highlight current section in TOC
- [ ] Handle edge cases (top/bottom of page)

## Phase 4: Styling & Testing
- [ ] Style TOC for both layouts (desktop/mobile)
- [ ] Add conditional rendering (hide if < 3 headings)
- [ ] Test with short notes
- [ ] Test with long notes (many headings)
- [ ] Test responsive breakpoints

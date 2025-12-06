# Tasks: 004-dark-mode

## Phase 1: Theme Tokens
- [ ] Extend `src/styles/tokens.css` with dark mode variables
- [ ] Define dark color palette (background, surface, text, borders)
- [ ] Ensure all components use CSS custom properties

## Phase 2: Toggle Component
- [ ] Create `src/components/ui/DarkModeToggle.tsx`
- [ ] Implement sun/moon icon toggle
- [ ] Add click handler to switch themes
- [ ] Ensure keyboard accessibility

## Phase 3: Persistence & Integration
- [ ] Add theme initialization script to `Base.astro`
- [ ] Implement localStorage persistence
- [ ] Detect OS preference (`prefers-color-scheme`)
- [ ] Add toggle to header navigation

## Phase 4: Testing
- [ ] Test theme switching
- [ ] Verify localStorage persistence
- [ ] Test OS preference detection
- [ ] Review all pages in dark mode
- [ ] Test smooth transitions

# Spec: 004-dark-mode

## 1. Overview
Implement dark mode toggle that switches between light and dark themes. Uses Sonagi design system color tokens and persists user preference in localStorage.

## 2. User Stories / Requirements
- [ ] User can toggle between light and dark modes
- [ ] User's preference is persisted across sessions
- [ ] System respects user's OS preference on first visit
- [ ] Smooth transition between modes
- [ ] All components adapt to dark mode
- [ ] Toggle button is accessible from header

## 3. Technical Design

### Components
- **DarkModeToggle**: React component for theme switcher
  - Sun/Moon icon toggle button
  - Click handler to switch themes
  - Accessible with keyboard navigation

### Theme Implementation
- **CSS Variables**: Extend existing tokens.css with dark mode values
- **Strategy**: Use `data-theme` attribute on `<html>` element
- **Persistence**: localStorage key `sonagi-theme`

### Color Tokens (Dark Mode)
```css
[data-theme="dark"] {
  --sonagi-color-background: #0f1419;
  --sonagi-color-surface: #1a1f29;
  --sonagi-color-text-primary: #e6edf3;
  --sonagi-color-text-secondary: #8b949e;
  --sonagi-color-border: #30363d;
  --sonagi-color-primary: #58a6ff;
  --sonagi-color-primary-hover: #79c0ff;
  /* ... additional dark mode tokens */
}
```

### Script Flow
1. Check localStorage for saved preference
2. If none, check `prefers-color-scheme` media query
3. Apply theme by setting `data-theme` attribute
4. Toggle updates both DOM and localStorage

## 4. Implementation Plan
1. [ ] Extend `src/styles/tokens.css` with dark mode variables
2. [ ] Create `src/components/ui/DarkModeToggle.tsx` component
3. [ ] Add theme initialization script to `Base.astro` (inline, blocking)
4. [ ] Add DarkModeToggle to header navigation
5. [ ] Test theme persistence and OS preference detection
6. [ ] Verify all pages/components work in dark mode

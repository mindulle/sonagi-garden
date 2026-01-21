# Spec: 000-project-initialization

## 1. Overview
Initialize the **Sonagi Garden** project, a personal digital garden powered by Astro. This phase establishes the technical foundation, directory structure, and design system integration.

## 2. User Stories / Requirements
- [ ] **Tech Stack**: The project must use Astro 4, React, and TypeScript.
- [ ] **Design System**: 
    - Must NOT use Tailwind CSS.
    - Must use CSS Variables for design tokens (`src/styles/tokens.css`).
    - Must provide basic UI components (`Button`, `Card`) in `src/components/ui`.
- [ ] **Content**: Support Markdown/MDX content in `content/` directory.
- [ ] **Routing**: Basic file-based routing for Home (`/`) and Notes (`/notes/[slug]`).
- [ ] **Layouts**: A `BaseLayout` that applies global styles and fonts.

## 3. Technical Design

### Directory Structure
```
sonagi-garden/
├── .specify/           # Spec-Kit configuration
├── content/            # Markdown content source
├── public/             # Static assets
├── specs/              # Feature specifications
├── src/
│   ├── components/
│   │   └── ui/         # Reusable design system components
│   ├── layouts/        # Base.astro, Note.astro
│   ├── pages/          # index.astro, [slug].astro
│   └── styles/
│       ├── global.css  # Global reset & typography
│       └── tokens.css  # Design tokens (colors, spacing)
└── astro.config.mjs    # Configuration
```

### Design Tokens (Sonagi)
- **Primary Color**: `#4A90E2` (Blue)
- **Font**: Noto Sans KR (Google Fonts)
- **Radius**: `0.5rem` (Default)

## 4. Implementation Plan
1. [ ] **Clean Setup**: Verify `package.json` dependencies (Astro, React, TS).
2. [ ] **Style Architecture**: Ensure `tokens.css` is imported in `global.css`.
3. [ ] **UI Foundation**: Verify `Button.tsx` and `Card.tsx` exist and use tokens.
4. [ ] **Layouts**: Ensure `Base.astro` uses the correct HTML structure and meta tags.
5. [ ] **Cleanup**: Remove any unused files or legacy Tailwind configurations if present.

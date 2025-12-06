# Spec: 001-note-rendering

## 1. Overview
Implement the rendering logic for Markdown notes. This includes displaying the note content, frontmatter metadata (title, date, tags), and applying the Sonagi design system's typography.

## 2. User Stories / Requirements
- [ ] **URL**: Notes should be accessible at `/notes/[slug]`.
- [ ] **Layout**: Use `src/layouts/Note.astro`.
- [ ] **Metadata**: Display title, category, date, and tags at the top of the note.
- [ ] **Typography**: 
    - Content must be readable with proper line height and spacing.
    - Headings (`h1`~`h6`) must follow Sonagi scale.
    - Code blocks must be styled (Shiki is already configured).
    - Blockquotes should have a "refreshing" style (blue border).
- [ ] **Navigation**: A "Back to Home" link at the bottom.

## 3. Technical Design

### Components
- **`NoteLayout`** (`src/layouts/Note.astro`):
    - Already exists but needs verification against `tokens.css`.
    - Ensure it uses `<slot />` for content.
- **Typography**:
    - Define a `.prose` class in `src/styles/global.css` or scoped style in `Note.astro`.
    - Map standard HTML elements (`p`, `ul`, `a`) to `var(--sonagi-...)` tokens.

### Data Flow
1. `src/pages/notes/[...slug].astro` fetches `*.md` from `content/`.
2. Passes `frontmatter` and `Content` component to `NoteLayout`.
3. `NoteLayout` renders the wrapper and metadata.
4. `<Content />` renders the markdown body.

## 4. Implementation Plan
1. [ ] **Verify Layout**: Check `src/layouts/Note.astro` styles.
2. [ ] **Typography**: Refine the CSS in `Note.astro` to ensure it strictly uses `tokens.css`.
3. [ ] **Test Content**: Create a sample markdown file `content/dev/hello-world.md`.
4. [ ] **Verification**: Open `/notes/dev/hello-world` and check visual correctness.

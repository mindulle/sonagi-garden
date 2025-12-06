# Spec: 002-tag-list-page

## 1. Overview
Implement a tag browsing system that allows users to discover content by tags. This includes a main tag list page showing all available tags with note counts, and individual tag pages that display all notes with a specific tag.

## 2. User Stories / Requirements
- [ ] **Tag List Page (`/tags`)**: Display all tags used across the site
    - Show tag name and count of notes using that tag
    - Sort tags alphabetically or by popularity (note count)
    - Use Sonagi design system for styling
- [ ] **Tag Filter Page (`/tags/[tag]`)**: Display notes filtered by a specific tag
    - Show all notes that have the selected tag
    - Display tag name prominently at the top
    - Include a "Back to all tags" link
- [ ] **Navigation**: Add a "Tags" link to the main navigation
- [ ] **Design**: Use `Card` component for tag items, maintain consistency with existing UI

## 3. Technical Design

### Pages
- **`src/pages/tags/index.astro`**: Main tag list page
    - Use `Astro.glob()` to fetch all markdown files
    - Extract and aggregate all tags from frontmatter
    - Calculate note count per tag
    - Render using `Card` components from `src/components/ui/`
- **`src/pages/tags/[tag].astro`**: Individual tag filter page
    - Use `getStaticPaths()` to generate pages for each tag
    - Filter notes by the tag parameter
    - Display filtered notes in a list/grid

### Data Flow
1. Fetch all markdown files from `content/`
2. Extract `tags` array from each file's frontmatter
3. Aggregate into a map: `{ tagName: noteCount }`
4. For tag filter pages, filter notes where `frontmatter.tags.includes(tag)`

### Styling
- Use existing `Card` component for tag items
- Apply Sonagi color tokens for tag badges
- Ensure responsive layout (grid on desktop, stack on mobile)

## 4. Implementation Plan
1. [ ] **Create Tag List Page**: Implement `src/pages/tags/index.astro`
2. [ ] **Create Tag Filter Page**: Implement `src/pages/tags/[tag].astro`
3. [ ] **Update Navigation**: Add "Tags" link to `src/layouts/Base.astro` header
4. [ ] **Test**: Verify tag aggregation, filtering, and navigation

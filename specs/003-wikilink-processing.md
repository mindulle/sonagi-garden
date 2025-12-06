# Spec: 003-wikilink-processing

## 1. Overview
Implement Obsidian-style wikilink processing to enable seamless linking between notes. Wikilinks use the `[[note-name]]` or `[[note-name|display text]]` syntax and are fundamental to creating a connected digital garden.

## 2. User Stories / Requirements
- [ ] User can create links using `[[note-name]]` syntax
- [ ] User can specify custom display text with `[[note-name|custom text]]`
- [ ] System should resolve wikilinks to actual note URLs
- [ ] System should handle case-insensitive matching
- [ ] System should show broken links distinctly (different color/style)
- [ ] Links should work across different categories (dev, design, life)

## 3. Technical Design

### Components
- **Remark Plugin**: Custom remark plugin to transform wikilinks to HTML links
  - Parse `[[...]]` syntax
  - Resolve note paths from content collections
  - Generate proper URLs based on category and filename
  - Mark broken links with special class

### Data Structures
```typescript
interface WikiLink {
  target: string;        // note-name
  alias?: string;        // custom display text
  resolved: boolean;     // whether link exists
  url?: string;          // resolved URL
}
```

### Remark Plugin Flow
1. Parse markdown AST for wikilink patterns
2. Extract target note name and optional alias
3. Search content collections for matching note
4. Generate URL: `/notes/{category}/{filename}`
5. Replace wikilink with HTML link or broken link indicator

### URL Resolution
- Pattern: `[[note-name]]` or `[[note-name|alias]]`
- Search: Case-insensitive across all categories
- Output: `<a href="/notes/{category}/{filename}">{alias || title}</a>`
- Broken: `<a class="broken-link" data-target="{target}">{alias || target}</a>`

## 4. Implementation Plan
1. [ ] Create remark plugin `src/utils/remark-wikilinks.ts`
2. [ ] Implement note resolution logic
3. [ ] Add plugin to `astro.config.mjs`
4. [ ] Style wikilinks and broken links in global CSS
5. [ ] Test with various link patterns
6. [ ] Update documentation with wikilink usage

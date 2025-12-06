# Spec: 007-backlinks

## 1. Overview
Display backlinks (reverse links) for each note, showing all other notes that link to the current note. This creates a bidirectional graph of knowledge and helps discover related content.

## 2. User Stories / Requirements
- [ ] User sees list of backlinks at bottom of note page
- [ ] Each backlink shows the referring note's title and context
- [ ] Backlinks are grouped by category
- [ ] Empty state message when no backlinks exist
- [ ] Backlinks update automatically when new links are created

## 3. Technical Design

### Dependencies
- **Requires**: 003-wikilink-processing (must be implemented first)

### Data Structure
Build backlink index at build time by parsing all wikilinks:

```typescript
interface Backlink {
  sourceNote: string;    // note that contains the link
  sourceTitle: string;   // title of source note
  sourceCategory: string;// category of source
  sourceUrl: string;     // URL to source note
  context?: string;      // surrounding text snippet
}

type BacklinkIndex = Map<string, Backlink[]>;
```

### Build Process
1. Parse all markdown files for wikilinks
2. Create reverse mapping: target → sources
3. Store as JSON for build-time access
4. Pass backlinks to note layout via props

### Component
- **BacklinksSection**: Display component for backlinks
  - Section at bottom of note content
  - Card-based layout
  - Group by category (optional)
  - Show context snippet with highlighted link

### UI Layout
```
┌─────────────────────────────────┐
│ Note Content                    │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 🔗 Backlinks (3)                │
├─────────────────────────────────┤
│ [Card] Source Note Title        │
│   Category • Date               │
│   "...context with [[link]]..." │
├─────────────────────────────────┤
│ [Card] Another Source           │
│   ...                           │
└─────────────────────────────────┘
```

## 4. Implementation Plan
1. [ ] Create build script `scripts/generate-backlinks.ts`
2. [ ] Parse all notes and extract wikilink targets
3. [ ] Build reverse index and save to JSON
4. [ ] Update Astro config to run script in build process
5. [ ] Create `src/components/ui/BacklinksSection.tsx`
6. [ ] Update note layout to load and display backlinks
7. [ ] Style backlinks section with Sonagi design system
8. [ ] Test with various link patterns and contexts

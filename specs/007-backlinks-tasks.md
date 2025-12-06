# Tasks: 007-backlinks

## Phase 1: Build Script Development
- [ ] Create `scripts/generate-backlinks.ts`
- [ ] Parse all markdown files
- [ ] Extract wikilink targets from each note
- [ ] Build reverse index (target → sources)

## Phase 2: Context Extraction
- [ ] Extract surrounding text for context snippets
- [ ] Highlight wikilink in context
- [ ] Save backlink data to JSON

## Phase 3: Component Creation
- [ ] Create `src/components/ui/BacklinksSection.tsx`
- [ ] Display backlinks in card layout
- [ ] Group by category (optional)
- [ ] Show context snippets

## Phase 4: Integration & Testing
- [ ] Update Astro config to run build script
- [ ] Update note layout to load backlinks
- [ ] Style backlinks section
- [ ] Test with various link patterns
- [ ] Test empty state (no backlinks)
- [ ] Verify backlinks update on rebuild

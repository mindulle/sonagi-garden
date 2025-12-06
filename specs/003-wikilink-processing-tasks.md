# Tasks: 003-wikilink-processing

## Phase 1: Remark Plugin Development
- [ ] Create `src/utils/remark-wikilinks.ts` plugin file
- [ ] Implement regex pattern for wikilink detection
- [ ] Parse target note name and alias
- [ ] Build note resolution function (search content collections)

## Phase 2: URL Resolution & Link Generation
- [ ] Implement case-insensitive note matching
- [ ] Generate proper URLs: `/notes/{category}/{filename}`
- [ ] Handle broken links with special styling
- [ ] Support cross-category linking

## Phase 3: Integration & Testing
- [ ] Add plugin to `astro.config.mjs`
- [ ] Style wikilinks in global CSS
- [ ] Style broken links distinctly
- [ ] Test with various link patterns:
    - [ ] `[[note-name]]`
    - [ ] `[[note-name|custom text]]`
    - [ ] Cross-category links
    - [ ] Broken links
- [ ] Update documentation

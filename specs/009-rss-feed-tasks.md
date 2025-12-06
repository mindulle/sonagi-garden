# Tasks: 009-rss-feed

## Phase 1: Setup
- [ ] Install `@astrojs/rss` package
- [ ] Configure site URL in Astro config

## Phase 2: Main Feed
- [ ] Create `src/pages/rss.xml.ts`
- [ ] Fetch all notes from content collections
- [ ] Map to RSS feed items
- [ ] Sort by date (newest first)
- [ ] Limit to 50 items

## Phase 3: Category Feeds
- [ ] Create `/dev/rss.xml` route
- [ ] Create `/design/rss.xml` route
- [ ] Create `/life/rss.xml` route
- [ ] Filter notes by category

## Phase 4: Integration & Testing
- [ ] Configure feed metadata (title, description)
- [ ] Test feeds with RSS validator
- [ ] Add RSS icon/link to footer
- [ ] Test in RSS readers (Feedly, etc.)
- [ ] Update documentation with feed URLs

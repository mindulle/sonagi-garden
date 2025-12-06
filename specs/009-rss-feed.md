# Spec: 009-rss-feed

## 1. Overview
Generate RSS/Atom feeds for the site to enable users to subscribe and receive updates when new notes are published. Separate feeds for each category and a combined feed for all content.

## 2. User Stories / Requirements
- [ ] RSS feed available at `/rss.xml` (all notes)
- [ ] Category-specific feeds: `/dev/rss.xml`, `/design/rss.xml`, `/life/rss.xml`
- [ ] Feeds include note title, description, content, and publication date
- [ ] Feeds are auto-generated at build time
- [ ] RSS icon/link in footer or header
- [ ] Feeds validate against RSS 2.0 / Atom 1.0 spec

## 3. Technical Design

### Astro Integration
- Use `@astrojs/rss` package (official Astro RSS integration)
- Generate feeds from content collections
- Support both RSS 2.0 and Atom formats

### Feed Structure
```typescript
interface FeedItem {
  title: string;          // note title
  link: string;           // absolute URL to note
  description: string;    // note description or excerpt
  pubDate: Date;          // publication date
  categories: string[];   // tags
  content: string;        // full HTML content (optional)
}
```

### Feed Routes
- `/rss.xml` - All notes (latest 50)
- `/dev/rss.xml` - Dev category
- `/design/rss.xml` - Design category  
- `/life/rss.xml` - Life category

### Metadata
```xml
<channel>
  <title>Sonagi Garden</title>
  <description>청량한 디지털 정원</description>
  <link>https://sonagi-garden.example.com</link>
  <language>ko</language>
  <lastBuildDate>...</lastBuildDate>
</channel>
```

### Content Strategy
- **Description**: Use frontmatter description or first paragraph
- **Content**: Include full HTML render or excerpt (configurable)
- **Sorting**: By publication date, newest first
- **Limit**: Maximum 50 items per feed

## 4. Implementation Plan
1. [ ] Install `@astrojs/rss` package
2. [ ] Create `src/pages/rss.xml.ts` for main feed
3. [ ] Create category-specific feed routes
4. [ ] Configure feed metadata (title, description, site URL)
5. [ ] Map content collections to feed items
6. [ ] Test feeds with RSS validator
7. [ ] Add RSS icon/link to site footer
8. [ ] Update documentation with feed URLs
9. [ ] Test in RSS readers (Feedly, NewsBlur, etc.)

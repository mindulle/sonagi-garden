# Spec: 008-graph-view

## 1. Overview
Create an interactive graph visualization showing connections between notes. Nodes represent notes, edges represent wikilinks. Users can explore the knowledge graph visually and navigate by clicking nodes.

## 2. User Stories / Requirements
- [ ] User can access graph view from main navigation
- [ ] Graph shows all notes as nodes, wikilinks as edges
- [ ] Nodes are colored by category
- [ ] Node size reflects number of connections
- [ ] User can zoom, pan, and interact with the graph
- [ ] Clicking a node navigates to that note
- [ ] User can filter by category or tags
- [ ] Graph highlights connected nodes on hover

## 3. Technical Design

### Dependencies
- **Requires**: 003-wikilink-processing (wikilinks must exist)
- **Optional**: 007-backlinks (for bidirectional edges)

### Visualization Library
- **Force-Graph**: React component for force-directed graphs
  - Alternative: **D3.js** for custom visualization
  - 2D or 3D rendering options
  - Interactive zoom and pan

### Data Structure
```typescript
interface GraphNode {
  id: string;           // note identifier
  title: string;        // note title
  category: string;     // dev/design/life
  tags: string[];       // tags for filtering
  url: string;          // link to note
}

interface GraphEdge {
  source: string;       // source note ID
  target: string;       // target note ID
  type?: string;        // 'wikilink' | 'backlink'
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```

### Build Process
1. Extract all notes and their wikilinks
2. Build graph data structure
3. Save as JSON file in public directory
4. Load at runtime for visualization

### Page Route
- **URL**: `/graph`
- **Component**: `src/pages/graph.astro`
- **Client Component**: `src/components/GraphView.tsx` (React)

### Features
- **Color Coding**: Category-based node colors
- **Size**: Based on degree (number of connections)
- **Filters**: Dropdown to filter by category or tags
- **Highlight**: Show connected nodes on hover
- **Search**: Find and center on specific node
- **Physics**: Force-directed layout for natural clustering

## 4. Implementation Plan
1. [ ] Choose graph library (Force-Graph vs D3.js)
2. [ ] Install graph visualization dependencies
3. [ ] Create build script `scripts/generate-graph-data.ts`
4. [ ] Generate graph data JSON file
5. [ ] Create `src/pages/graph.astro` page
6. [ ] Build `src/components/GraphView.tsx` React component
7. [ ] Implement node/edge rendering with category colors
8. [ ] Add interaction handlers (click, hover, zoom)
9. [ ] Implement category/tag filters
10. [ ] Add "Graph" link to main navigation
11. [ ] Style graph page and controls
12. [ ] Test performance with many nodes
13. [ ] Add documentation for graph features

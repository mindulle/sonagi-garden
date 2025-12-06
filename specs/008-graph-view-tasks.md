# Tasks: 008-graph-view

## Phase 1: Library Selection & Setup
- [ ] Evaluate Force-Graph vs D3.js
- [ ] Choose graph library
- [ ] Install graph dependencies

## Phase 2: Data Generation
- [ ] Create `scripts/generate-graph-data.ts`
- [ ] Extract all notes as nodes
- [ ] Extract all wikilinks as edges
- [ ] Save graph data to JSON in public directory

## Phase 3: Graph Page & Component
- [ ] Create `src/pages/graph.astro`
- [ ] Create `src/components/GraphView.tsx`
- [ ] Implement node rendering (colored by category)
- [ ] Implement edge rendering
- [ ] Add force-directed layout

## Phase 4: Interactivity
- [ ] Implement zoom and pan
- [ ] Add click handler (navigate to note)
- [ ] Add hover highlighting (show connections)
- [ ] Implement node search/filter

## Phase 5: Features & Polish
- [ ] Add category filter dropdown
- [ ] Add tag filter
- [ ] Size nodes by connection count
- [ ] Add "Graph" link to navigation
- [ ] Style graph page and controls

## Phase 6: Testing
- [ ] Test with small graph (<10 nodes)
- [ ] Test with large graph (>100 nodes)
- [ ] Test performance
- [ ] Test filters and search
- [ ] Test on mobile devices

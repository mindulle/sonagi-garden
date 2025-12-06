import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

const CONTENT_DIR = 'content';
const OUTPUT_FILE = 'public/graph-data.json';

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateGraphData() {
    console.log('Generating graph data...');

    const files = await glob(`${CONTENT_DIR}/**/*.md`);
    const nodes = [];
    const edges = [];
    const existingNodes = new Set();
    const fileMap = {};

    // First pass: Create nodes and build fileMap
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const { data } = matter(content);

        // content/dev/getting-started.md -> dev/getting-started
        const slug = file.split(path.sep).join('/')
            .replace(/^content\//, '')
            .replace(/\.md$/, '');

        const title = data.title || path.basename(file, '.md');
        const category = slug.split('/')[0]; // dev, design, life

        const filename = path.basename(file, '.md').toLowerCase();
        fileMap[filename] = slug;

        nodes.push({
            id: slug,
            name: title,
            val: 1, // Default size, will increment based on connections
            group: category
        });

        existingNodes.add(slug);
    }

    // Second pass: Create edges
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const { content: markdown } = matter(content);

        const sourceSlug = file.split(path.sep).join('/')
            .replace(/^content\//, '')
            .replace(/\.md$/, '');

        const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
        let match;

        while ((match = regex.exec(markdown)) !== null) {
            const targetRaw = match[1].trim();
            const targetKey = targetRaw.toLowerCase().replace(/\s+/g, '-');

            // Try exact match first, then raw match (via fileMap)
            let targetSlug = fileMap[targetKey];
            if (!targetSlug) {
                targetSlug = fileMap[targetRaw.toLowerCase()];
            }

            // Only add edge if target exists (internal link)
            if (targetSlug && existingNodes.has(targetSlug)) {

                // Avoid self-loops
                if (sourceSlug !== targetSlug) {
                    edges.push({
                        source: sourceSlug,
                        target: targetSlug
                    });

                    // Increment node size (degree centrality)
                    const sourceNode = nodes.find(n => n.id === sourceSlug);
                    const targetNode = nodes.find(n => n.id === targetSlug);
                    if (sourceNode) sourceNode.val += 0.5;
                    if (targetNode) targetNode.val += 0.5;
                }
            }
        }
    }

    const graphData = { nodes, links: edges };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(graphData, null, 2));
    console.log(`Graph data generated in ${OUTPUT_FILE}`);
}

generateGraphData().catch(console.error);

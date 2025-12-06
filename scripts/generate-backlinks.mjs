import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

const CONTENT_DIR = 'content';
const OUTPUT_FILE = 'src/generated/backlinks.json';

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateBacklinks() {
    console.log('Generating backlinks...');

    const files = await glob(`${CONTENT_DIR}/**/*.md`);
    const backlinks = {}; // targetSlug -> [{ sourceSlug, sourceTitle, excerpt }]

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const { data, content: markdown } = matter(content);

        // Get source slug from file path
        // content/dev/getting-started.md -> dev/getting-started
        const sourceSlug = file.split(path.sep).join('/')
            .replace(/^content\//, '')
            .replace(/\.md$/, '');

        const sourceTitle = data.title || path.basename(file, '.md');

        // Find all wikilinks [[target]] or [[target|alias]]
        const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
        let match;

        while ((match = regex.exec(markdown)) !== null) {
            const targetRaw = match[1].trim();
            // Simple slugification: lowercase and replace spaces with hyphens if needed
            // But our wikilink plugin assumes direct mapping or simple normalization.
            // Let's match the plugin's logic: lowercase, replace spaces with hyphens? 
            // Actually the plugin does: filename.toLowerCase().replace(/[-_]/g, ' ') for matching keys.
            // But here we need the SLUG.
            // If target is "Getting Started", slug is "getting-started" (usually).
            // If target is "getting-started", slug is "getting-started".
            // Let's assume target matches the filename (without extension) for now, 
            // or we need a map of "Title" -> "Slug".

            // For now, let's assume the target in [[target]] IS the slug or close to it.
            // We'll normalize to lowercase and replace spaces with hyphens.
            const targetSlug = targetRaw.toLowerCase().replace(/\s+/g, '-');

            if (!backlinks[targetSlug]) {
                backlinks[targetSlug] = [];
            }

            // Extract excerpt (context)
            const index = match.index;
            const start = Math.max(0, index - 50);
            const end = Math.min(markdown.length, index + match[0].length + 50);
            let excerpt = markdown.slice(start, end).trim();
            if (start > 0) excerpt = '...' + excerpt;
            if (end < markdown.length) excerpt = excerpt + '...';

            // Avoid duplicates
            const exists = backlinks[targetSlug].find(b => b.sourceSlug === sourceSlug);
            if (!exists) {
                backlinks[targetSlug].push({
                    sourceSlug,
                    sourceTitle,
                    excerpt
                });
            }
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(backlinks, null, 2));
    console.log(`Backlinks generated in ${OUTPUT_FILE}`);
}

generateBacklinks().catch(console.error);

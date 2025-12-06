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

    // 1. Build a map of "Possible Link Targets" -> "Real Slug"
    const fileMap = {};
    const files = await glob(`${CONTENT_DIR}/**/*.md`);

    for (const file of files) {
        // content/dev/getting-started.md -> dev/getting-started
        const slug = file.split(path.sep).join('/')
            .replace(/^content\//, '')
            .replace(/\.md$/, '');

        const filename = path.basename(file, '.md').toLowerCase();
        // If there are duplicates, the last one wins (simple collision handling)
        fileMap[filename] = slug;

        // Also add title to map if available? 
        // Reading content just for title here might be expensive, let's optimize if needed.
        // For now, mapping filename (which is usually the wikilink target) is good enough.
    }

    const backlinks = {}; // targetSlug -> [{ sourceSlug, sourceTitle, excerpt }]

    // 2. Scan files again to find links
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const { data, content: markdown } = matter(content);

        const sourceSlug = file.split(path.sep).join('/')
            .replace(/^content\//, '')
            .replace(/\.md$/, '');
        const sourceTitle = data.title || path.basename(file, '.md');

        const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
        let match;

        while ((match = regex.exec(markdown)) !== null) {
            const targetRaw = match[1].trim();
            // Normalize target to match fileMap key
            const targetKey = targetRaw.toLowerCase().replace(/\s+/g, '-');

            // Try exact match first (e.g. "getting-started" -> "getting-started")
            let targetSlug = fileMap[targetKey];

            // Fallback: try raw lowercase (e.g. "Getting Started" -> "getting started" in map?)
            // If the user has a file named "my note.md", slug is "dev/my-note" probably?
            // Wait, we generate slug from path, but fileMap key is just filename.
            if (!targetSlug) {
                targetSlug = fileMap[targetRaw.toLowerCase()];
            }

            // If we found a valid target note
            if (targetSlug) {
                if (!backlinks[targetSlug]) {
                    backlinks[targetSlug] = [];
                }

                const index = match.index;
                const start = Math.max(0, index - 50);
                const end = Math.min(markdown.length, index + match[0].length + 50);
                let excerpt = markdown.slice(start, end).trim();
                // Clean up newlines in excerpt
                excerpt = excerpt.replace(/\n/g, ' ');

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
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(backlinks, null, 2));
    console.log(`Backlinks generated in ${OUTPUT_FILE}`);
}

generateBacklinks().catch(console.error);

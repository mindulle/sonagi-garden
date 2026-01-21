import fs from "fs";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";

const CONTENT_DIR = path.resolve("./content");
const VALID_EXTENSIONS = [".md", ".mdx"];

console.log(`🔍 Starting validation in ${CONTENT_DIR}...`);

async function validateNotes() {
  // 1. Get all notes
  const files = await glob("**/*.{md,mdx}", { cwd: CONTENT_DIR });
  console.log(`Found ${files.length} notes.`);

  const noteMap = new Map(); // slug -> filepath
  const errors = [];
  const warnings = [];

  // 2. First pass: Build slug map and check frontmatter
  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");

    // Derive slug (assuming filename is slug for simplicity, or relative path)
    // Astro default slug is relative path without extension
    const slug = file.replace(/\.(md|mdx)$/, "");
    noteMap.set(slug, filePath);

    // Also add the basename as a slug alias if unique?
    // Sonagi Garden seems to use file-based routing.
    // Let's assume standard Astro Content Collection behavior: slug is ID.
    // But wikilinks often use just the filename. Let's map filename -> slug too.
    const filename = path.basename(file, path.extname(file));
    if (!noteMap.has(filename)) {
      noteMap.set(filename, filePath);
    }

    try {
      const parsed = matter(content);
      const { data } = parsed;

      // Check required fields
      if (!data.title) {
        errors.push({
          file,
          type: "Missing Title",
          message: 'Frontmatter "title" is missing',
        });
      }
      if (!data.date) {
        // warnings.push({ file, type: 'Missing Date', message: 'Frontmatter "date" is missing' });
        // Date might not be strictly required for all, maybe just warning
      } else if (isNaN(Date.parse(data.date))) {
        errors.push({
          file,
          type: "Invalid Date",
          message: `Date "${data.date}" is invalid`,
        });
      }
    } catch (e) {
      errors.push({ file, type: "Frontmatter Error", message: e.message });
    }
  }

  // 3. Second pass: Check Wikilinks and internal links
  const wikiLinkRegex = /\[\[(.*?)(?:\|.*?)?\]\]/g;
  const imageLinkRegex = /!\[.*?\]\((.*?)\)/g;

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const fileDir = path.dirname(filePath);

    // Check Wikilinks
    let match;
    while ((match = wikiLinkRegex.exec(content)) !== null) {
      const linkTarget = match[1].trim();
      const targetSlug = linkTarget.split("#")[0];

      if (targetSlug && !noteMap.has(targetSlug)) {
        warnings.push({
          file,
          type: "Broken Wikilink",
          message: `Link to "[[${linkTarget}]]" not found`,
        });
      }
    }

    // Check Image Links
    let imgMatch;
    while ((imgMatch = imageLinkRegex.exec(content)) !== null) {
      const imgPath = imgMatch[1].trim();
      // Ignore external links
      if (imgPath.startsWith("http") || imgPath.startsWith("//")) continue;
      // Ignore empty links (handled by build error usually, but good to catch)
      if (!imgPath) {
        errors.push({
          file,
          type: "Empty Image Link",
          message: "Image link is empty",
        });
        continue;
      }

      // Resolve path
      let resolvedPath;
      if (imgPath.startsWith("/")) {
        // Absolute path relative to content or public? pattern varies
        // Assuming relative to public if /assets, or content?
        // Let's assume content root for now or check public
        // But Astro usually treats / as public.
        // If it's ./ or ../ it's relative.
        // Let's just check if it exists relative to file
        continue; // Skip absolute paths for now as they might be public assets
      } else {
        resolvedPath = path.resolve(fileDir, imgPath);
      }

      if (!fs.existsSync(resolvedPath)) {
        errors.push({
          file,
          type: "Missing Image",
          message: `Image "${imgPath}" not found at ${resolvedPath}`,
        });
      }
    }
  }

  // 4. Report
  if (errors.length > 0 || warnings.length > 0) {
    console.log("\n--- Validation Report ---");

    if (errors.length > 0) {
      console.error(`\n❌ Found ${errors.length} Critical Errors:`);
      errors.forEach((e) =>
        console.error(`  [${e.type}] ${e.file}: ${e.message}`),
      );
    }

    if (warnings.length > 0) {
      console.warn(
        `\n⚠️ Found ${warnings.length} Warnings (Broken Links etc.):`,
      );
      // Limit warning output if too many
      const limit = 20;
      warnings
        .slice(0, limit)
        .forEach((w) => console.warn(`  [${w.type}] ${w.file}: ${w.message}`));
      if (warnings.length > limit)
        console.warn(`  ...and ${warnings.length - limit} more warnings.`);
    }

    if (errors.length > 0) process.exit(1);
  } else {
    console.log("\n✅ All notes validated successfully!");
  }
}

validateNotes().catch(console.error);

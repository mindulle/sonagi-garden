import fs from "fs";
import path from "path";
import { glob } from "glob";

const CONTENT_DIR = path.resolve("./content");

console.log(`🔧 Starting broken image fixer in ${CONTENT_DIR}...`);

async function fixBrokenImages() {
  const files = await glob("**/*.{md,mdx}", { cwd: CONTENT_DIR });
  let fixedCount = 0;
  let fileCount = 0;

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    let content = fs.readFileSync(filePath, "utf-8");
    const fileDir = path.dirname(filePath);
    let modified = false;

    // Regex to capture the whole image tag and the path
    // Note: This simple regex handles standard inline images: ![alt](path "title")
    // It might not handle balanced brackets perfectly but works for most.
    // We capture: 1: alt, 2: path, 3: optional title
    const imageRegex = /!\[([^\]]*?)\]\(([^)]+?)(?:\s+"([^"]*)")?\)/g;

    content = content.replace(imageRegex, (match, alt, imgPath, title) => {
      imgPath = imgPath.trim();

      // Ignore external links
      if (imgPath.startsWith("http") || imgPath.startsWith("//")) {
        return match;
      }

      // Ignore empty paths (though should probably fix/comment them too if they break build)
      if (!imgPath) {
        return `<!-- BROKEN IMAGE (empty path): ${match} -->`;
      }

      // Resolve path
      let resolvedPath;
      if (imgPath.startsWith("/")) {
        // Absolute path - skip for now or check public?
        // Astro/Vite handles / as public usually. If it's broken there, we should verify.
        // But sticking to relative for safety of this script.
        return match;
      } else {
        resolvedPath = path.resolve(fileDir, imgPath);
      }

      if (!fs.existsSync(resolvedPath)) {
        console.log(`[Fixing] ${file}: Missing ${imgPath}`);
        modified = true;
        fixedCount++;
        return `<!-- BROKEN IMAGE: ${match} -->`;
      }

      return match;
    });

    if (modified) {
      fs.writeFileSync(filePath, content, "utf-8");
      fileCount++;
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} broken links in ${fileCount} files.`);
}

fixBrokenImages().catch(console.error);

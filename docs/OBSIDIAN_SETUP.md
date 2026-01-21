# Obsidian Setup Guide for Sonagi Garden

This guide explains how to configure Obsidian to work seamlessly with the Sonagi Garden Astro project.

## 1. Open Vault
1. Open Obsidian.
2. Select **"Open folder as vault"**.
3. Choose the root directory of this project: `sonagi-garden`.

## 2. Recommended Settings
To ensure compatibility with Astro's parsing logic (`remark-wiki-link`), configure Obsidian as follows:

### Files & Links
- **Default location for new attachments**: `In specific folder below` -> `public/assets/images`
  - *Why*: Astro serves static assets from `public/`. Placing images here allows you to link them as `/assets/images/filename.png`.
- **New link format**: **Markdown**
  - *Why*: While our Astro setup supports `[[Wikilinks]]` for *notes*, standard Markdown links `[Title](path)` and images `![Alt](/path)` are the most robust for static site generation, especially for assets.
- **Use [[Wikilinks]]**: **Off** (Optional but Recommended for strict compatibility)
  - *Note*: You *can* leave this **On** if you prefer the `[[...]]` typing experience. The `remark-wiki-link` plugin in Astro *will* understand them for internal note links. However, for **Issues/Images**, standard Markdown is safer.

## 3. Workflow
### Creating a New Note
1. Duplicate the template at `scripts/templates/New_Note.md` (or copy its content).
2. Save the new file in `content/dev` (or appropriate subfolder).
3. The filename will become the URL slug (e.g., `my-note.md` -> `/notes/dev/my-note`).

### Linking Notes
- You can use `[[Note Name]]` if you enabled Wikilinks.
- The build system (`remark-wiki-link`) automatically resolves these to the correct URL based on the filename.

### Adding Images
1. Paste an image into Obsidian.
2. Ensure it goes to `public/assets/images`.
3. Verify the link looks like: `![Image Description](/assets/images/my-image.png)`.
   - *Note*: Obsidian might default to `![[my-image.png]]`. You may need to manually change this to standard markdown syntax for the deployed site to render it correctly, or use a plugin to auto-convert.

## 4. Dual-Editor Setup (Performance Essential)
If you keep this project open in both **VS Code** (or Antigravity) and **Obsidian** at the same time, follow these rules to ensure smooth performance:

### Exclude Development Folders
Obsidian can slow down if it tries to index thousands of code files (like `node_modules`).
1.  Go to **Settings > Files & Links**.
2.  Find **"Excluded files"**.
3.  Add the following patterns:
    -   `node_modules` (Critical)
    -   `.git`
    -   `dist`
    -   `.astro`
    -   `.vercel`
    -   `.gemini` (AI Agent artifacts)
    -   `src` (Optional: if you only want to write content)

    -   `src` (Optional: if you only want to write content)

This setup ensures Obsidian only focuses on your notes, while VS Code handles the code.

## 5. Sharing Your Setup
We have pre-configured the project to share "safe" settings while ignoring personal ones.

- **VS Code**: Settings in `.vscode/settings.json` are shared. (Formatting, etc.)
- **Obsidian**: Settings in `.obsidian/` (Plugins, Appearance) are shared, but **Workspace** (Open tabs, Layout) is ignored.
  - If you customize your Obsidian (e.g., install a plugin), simply commit the changes in `.obsidian/` to share them with your other computers or team.

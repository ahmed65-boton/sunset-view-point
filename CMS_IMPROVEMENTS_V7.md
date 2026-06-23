# CMS Improvements v7

This patch adds practical improvements on top of the current CMS/page-builder version.

## Added

### Page builder templates
The CMS Pages tab now has quick-start templates:

- Blank builder
- About / story
- Private events
- Gallery
- Promo landing

Templates prefill the hero, page slug, description, and builder blocks so a new page is not an empty shell.

### Duplicate page
Existing CMS pages now have a **Duplicate** button. It creates a draft copy with a unique slug and keeps it hidden from navigation until you review it.

### Duplicate block
Every page-builder block now has a **Duplicate** button, useful for repeating cards, text sections, CTAs, and image/text sections.

### Cards with images
Cards grid blocks now support an optional fifth field for an image:

```txt
Title | Text | Button label | /link | /image.jpg
```

### Dynamic SEO metadata for CMS pages
Public CMS pages now generate metadata from the page title, description, and hero image. This improves page titles and previews when sharing links.

## Verification

Run this from the project root in PowerShell:

```powershell
Select-String -Path "app\cms\page.tsx" -Pattern "Quick start templates","Duplicate","About / story","Promo landing"
Select-String -LiteralPath "app\[slug]\page.tsx" -Pattern "generateMetadata","card.image","getCmsPageBySlug"
```

Then clear the cache and run locally:

```powershell
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
pnpm run dev
```

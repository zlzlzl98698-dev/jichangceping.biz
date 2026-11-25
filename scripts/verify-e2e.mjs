import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS_DIR = path.join(ROOT, 'docs')
const DIST_DIR = path.join(DOCS_DIR, '.vitepress', 'dist')
const BRANDS_PATH = path.join(ROOT, 'data', 'brands.json')
const BENCHMARKS_PATH = path.join(ROOT, 'data', 'benchmarks.json')

const errors = []
const checks = []

function pass(msg) {
  checks.push(`PASS: ${msg}`)
}

function fail(msg) {
  errors.push(`FAIL: ${msg}`)
}

function walkFiles(dir, ext, skipDirs = new Set()) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkFiles(full, ext, skipDirs))
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      out.push(full)
    }
  }
  return out
}

function distAssetExists(relUrl) {
  if (typeof relUrl !== 'string' || !relUrl.trim()) return false
  const clean = relUrl.trim().split('#')[0].split('?')[0].replace(/^\//, '')
  return fs.existsSync(path.join(DIST_DIR, clean))
}

if (!fs.existsSync(DIST_DIR)) {
  console.error(`[verify-e2e] Missing dist directory: ${DIST_DIR}`)
  process.exit(1)
}

// 1. Check all 122 HTML files exist and match source markdown pages
const htmlFiles = walkFiles(DIST_DIR, '.html')
if (htmlFiles.length === 122) {
  pass(`dist contains exactly ${htmlFiles.length} HTML files`)
} else {
  fail(`expected 122 HTML files in dist, found ${htmlFiles.length}`)
}

const mdFiles = walkFiles(DOCS_DIR, '.md', new Set(['.vitepress', 'public']))
const missingHtmlForMd = []
for (const mdFile of mdFiles) {
  const rel = path.relative(DOCS_DIR, mdFile).replace(/\\/g, '/')
  const expectedHtml =
    rel === '404.md'
      ? path.join(DIST_DIR, '404.html')
      : rel.endsWith('/index.md') || rel === 'index.md'
        ? path.join(DIST_DIR, rel.replace(/\.md$/, '.html'))
        : path.join(DIST_DIR, rel.replace(/\.md$/, '.html'))
  if (!fs.existsSync(expectedHtml)) {
    missingHtmlForMd.push(`${rel} -> ${path.relative(DIST_DIR, expectedHtml)}`)
  }
}
if (missingHtmlForMd.length === 0) {
  pass(`all ${mdFiles.length} source markdown pages have corresponding built HTML files`)
} else {
  fail(`missing HTML for source pages: ${missingHtmlForMd.join(', ')}`)
}

// 2. Zero unparsed ** inside <main>
const unparsedBoldPages = []
for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8')
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  if (!mainMatch) continue
  const cleanedMain = mainMatch[1]
    .replace(/<(pre|code|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
  if (cleanedMain.includes('**')) {
    unparsedBoldPages.push(path.relative(DIST_DIR, htmlFile).replace(/\\/g, '/'))
  }
}
if (unparsedBoldPages.length === 0) {
  pass('zero unparsed "**" found in <main> across all HTML pages')
} else {
  fail(`found unparsed "**" in <main>: ${unparsedBoldPages.join(', ')}`)
}

// 3. /images/avatar.webp exists and is referenced in index.html
const avatarRel = '/images/avatar.webp'
const indexHtmlPath = path.join(DIST_DIR, 'index.html')
const indexHtml = fs.existsSync(indexHtmlPath) ? fs.readFileSync(indexHtmlPath, 'utf8') : ''
if (distAssetExists(avatarRel) && indexHtml.includes(avatarRel)) {
  pass('/images/avatar.webp exists in dist and is referenced in index.html')
} else {
  fail(
    `avatar check failed (exists=${distAssetExists(avatarRel)}, inIndex=${indexHtml.includes(avatarRel)})`
  )
}

// 4. All brands.json logos exist in dist
const brands = JSON.parse(fs.readFileSync(BRANDS_PATH, 'utf8'))
const missingBrandLogos = []
for (const brand of brands) {
  if (!brand.logo || !distAssetExists(brand.logo)) {
    missingBrandLogos.push(`${brand.slug}: ${brand.logo || '(empty)'}`)
  }
}
if (missingBrandLogos.length === 0) {
  pass(`all ${brands.length} brands.json logos exist in dist`)
} else {
  fail(`missing brand logos in dist: ${missingBrandLogos.join('; ')}`)
}

// 5. All benchmarks.json imagePath and thumbnailPath exist in dist
const benchmarks = JSON.parse(fs.readFileSync(BENCHMARKS_PATH, 'utf8'))
const missingBenchAssets = []
let benchImageCount = 0
for (const batch of benchmarks) {
  if (!batch.imagePath) continue
  benchImageCount += 1
  if (!distAssetExists(batch.imagePath)) {
    missingBenchAssets.push(`${batch.id} imagePath missing: ${batch.imagePath}`)
  }
  if (!batch.thumbnailPath) {
    missingBenchAssets.push(`${batch.id} thumbnailPath not set`)
  } else if (!distAssetExists(batch.thumbnailPath)) {
    missingBenchAssets.push(`${batch.id} thumbnailPath missing: ${batch.thumbnailPath}`)
  }
}
if (missingBenchAssets.length === 0) {
  pass(`all ${benchImageCount} benchmark imagePath + thumbnailPath assets exist in dist`)
} else {
  fail(`benchmark asset issues: ${missingBenchAssets.join('; ')}`)
}

// 6. Required root artifacts exist and are non-empty
for (const artifact of ['search-index.json', 'sitemap.xml', 'robots.txt', 'llms.txt']) {
  const full = path.join(DIST_DIR, artifact)
  if (fs.existsSync(full) && fs.statSync(full).size > 0) {
    pass(`${artifact} exists (${fs.statSync(full).size} bytes)`)
  } else {
    fail(`${artifact} missing or empty in dist`)
  }
}

// 7. Compiled CSS contains required dark-mode and layout selectors
const assetsDir = path.join(DIST_DIR, 'assets')
const cssFiles = walkFiles(assetsDir, '.css')
const cssContent = cssFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
const requiredSelectors = ['.dark .hp-root', '.dark .page-meta-banner', '.dark .ct-table', '.VPNavScreen']
const missingSelectors = requiredSelectors.filter((sel) => !cssContent.includes(sel))
if (cssFiles.length > 0 && missingSelectors.length === 0) {
  pass(`compiled CSS (${cssFiles.length} file(s)) contains all required selectors`)
} else {
  fail(`compiled CSS missing selectors: ${missingSelectors.join(', ')}`)
}

// 8. Local search index chunk is below 700 KB
const chunksDir = path.join(assetsDir, 'chunks')
const localIndexChunks = fs.existsSync(chunksDir)
  ? fs.readdirSync(chunksDir).filter((f) => f.startsWith('@localSearchIndexroot') && f.endsWith('.js'))
  : []
if (localIndexChunks.length === 0) {
  fail('missing @localSearchIndexroot*.js chunk in dist/assets/chunks')
} else {
  const chunkPath = path.join(chunksDir, localIndexChunks[0])
  const chunkSize = fs.statSync(chunkPath).size
  const chunkKb = (chunkSize / 1024).toFixed(1)
  if (chunkSize < 700 * 1024) {
    pass(`${localIndexChunks[0]} is ${chunkKb} KB (< 700 KB)`)
  } else {
    fail(`${localIndexChunks[0]} is ${chunkKb} KB (>= 700 KB)`)
  }
}

for (const line of checks) console.log(line)
for (const line of errors) console.error(line)

if (errors.length > 0) {
  console.error(`\n[verify-e2e] FAILED with ${errors.length} error(s).`)
  process.exit(1)
}

console.log(`\n[verify-e2e] ALL ${checks.length} CHECKS PASSED.`)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BRANDS_PATH = path.join(ROOT, 'data', 'brands.json')
const PUBLIC_DIR = path.join(ROOT, 'docs', 'public')
const LOGOS_PREFIX = '/images/logos/'
const OPT_DIR = path.join(PUBLIC_DIR, 'images', 'logos', 'opt')
const SIZE_THRESHOLD_BYTES = 40 * 1024

async function main() {
  const raw = fs.readFileSync(BRANDS_PATH, 'utf8')
  const brands = JSON.parse(raw)
  if (!Array.isArray(brands)) {
    throw new Error('data/brands.json must contain a JSON array')
  }

  fs.mkdirSync(OPT_DIR, { recursive: true })

  let convertedCount = 0
  let totalBefore = 0
  let totalAfter = 0

  for (const brand of brands) {
    const logo = typeof brand.logo === 'string' ? brand.logo.trim() : ''
    if (!logo.startsWith(LOGOS_PREFIX)) continue
    if (logo.startsWith(`${LOGOS_PREFIX}opt/`)) continue
    if (logo.toLowerCase().endsWith('.svg')) continue

    const inputPath = path.join(PUBLIC_DIR, logo.replace(/^\//, ''))
    if (!fs.existsSync(inputPath)) {
      console.warn(`[skip] missing logo file for ${brand.slug}: ${inputPath}`)
      continue
    }

    const stat = fs.statSync(inputPath)
    if (stat.size <= SIZE_THRESHOLD_BYTES) {
      continue
    }

    const outputRel = `/images/logos/opt/${brand.slug}.webp`
    const outputPath = path.join(OPT_DIR, `${brand.slug}.webp`)

    await sharp(inputPath)
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ quality: 84, alphaQuality: 90 })
      .toFile(outputPath)

    const outStat = fs.statSync(outputPath)
    totalBefore += stat.size
    totalAfter += outStat.size
    convertedCount += 1

    const savedPct = (((stat.size - outStat.size) / stat.size) * 100).toFixed(1)
    console.log(
      `[opt] ${brand.slug}: ${logo} (${(stat.size / 1024).toFixed(1)} KB) -> ${outputRel} (${(outStat.size / 1024).toFixed(1)} KB, -${savedPct}%)`
    )

    brand.logo = outputRel
  }

  if (convertedCount > 0) {
    const trailingNewline = raw.endsWith('\n') ? '\n' : ''
    fs.writeFileSync(BRANDS_PATH, JSON.stringify(brands, null, 2) + trailingNewline, 'utf8')
    console.log(
      `\nConverted ${convertedCount} logos: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024).toFixed(1)} KB (saved ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB)`
    )
  } else {
    console.log('No brand logos exceeded 40KB needing optimization.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BENCHMARKS_PATH = path.join(ROOT, 'data', 'benchmarks.json')
const PUBLIC_DIR = path.join(ROOT, 'docs', 'public')
const THUMBS_DIR = path.join(PUBLIC_DIR, 'images', 'benchmarks', 'thumbs')

async function main() {
  const raw = fs.readFileSync(BENCHMARKS_PATH, 'utf8')
  const batches = JSON.parse(raw)
  if (!Array.isArray(batches)) {
    throw new Error('data/benchmarks.json must contain a JSON array')
  }

  fs.mkdirSync(THUMBS_DIR, { recursive: true })

  let processedCount = 0
  let totalBefore = 0
  let totalAfter = 0

  for (const batch of batches) {
    const imagePath = typeof batch.imagePath === 'string' ? batch.imagePath.trim() : ''
    if (!imagePath) continue

    const inputPath = path.join(PUBLIC_DIR, imagePath.replace(/^\//, ''))
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Missing original benchmark image for ${batch.id}: ${inputPath}`)
    }

    const thumbRel = `/images/benchmarks/thumbs/${batch.id}.webp`
    const thumbAbs = path.join(THUMBS_DIR, `${batch.id}.webp`)

    await sharp(inputPath)
      .resize({ width: 680, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(thumbAbs)

    const origStat = fs.statSync(inputPath)
    const thumbStat = fs.statSync(thumbAbs)
    totalBefore += origStat.size
    totalAfter += thumbStat.size
    processedCount += 1

    const savedPct = (((origStat.size - thumbStat.size) / origStat.size) * 100).toFixed(1)
    console.log(
      `[thumb] ${batch.id}: ${(origStat.size / 1024).toFixed(1)} KB -> ${thumbRel} (${(thumbStat.size / 1024).toFixed(1)} KB, -${savedPct}%)`
    )

    batch.thumbnailPath = thumbRel
  }

  const trailingNewline = raw.endsWith('\n') ? '\n' : ''
  fs.writeFileSync(BENCHMARKS_PATH, JSON.stringify(batches, null, 2) + trailingNewline, 'utf8')

  const totalSavedBytes = totalBefore - totalAfter
  const totalSavedPct = totalBefore > 0 ? ((totalSavedBytes / totalBefore) * 100).toFixed(1) : '0.0'
  console.log(
    `\nGenerated ${processedCount} benchmark WebP thumbnails: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB (${(totalAfter / 1024).toFixed(1)} KB), saved ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB (-${totalSavedPct}%)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

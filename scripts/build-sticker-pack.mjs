import { mkdtemp, mkdir, readFile, rm, writeFile, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

// Maintenance command: Node + the project's Sharp, Python 3's standard ZIP writer.
const root = fileURLToPath(new URL('../', import.meta.url))
const entries = JSON.parse(await readFile(join(root, 'src/data/nom-stickers.json'), 'utf8'))
const output = join(root, 'public/downloads/nom-stickers-512.zip')
const temporary = await mkdtemp(join(tmpdir(), 'nom-stickers-'))
try {
  const pack = join(temporary, 'Nom-stickers')
  for (const entry of entries) {
    const target = join(pack, entry.file)
    await mkdir(dirname(target), { recursive: true })
    await sharp(join(root, 'public/images/nom/stickers', entry.file))
      .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9 }).toFile(target)
  }
  await writeFile(join(pack, 'README.txt'),
    'Nom / Loom Studio 表情包\n\n33 张透明 PNG，最长边 512px。全身 8 张、表情与动作 25 张。\n图片不含文字；网页中的气泡仅用于试搭。\n\n' +
    entries.map(entry => `${entry.file} — ${entry.title}`).join('\n') + '\n')
  await mkdir(dirname(output), { recursive: true })
  execFileSync('python3', ['-m', 'zipfile', '-c', output, 'Nom-stickers'], { cwd: temporary })
  console.log(`Created ${output}: ${entries.length} PNGs, ${((await stat(output)).size / 1024 / 1024).toFixed(1)} MiB`)
} finally {
  await rm(temporary, { recursive: true, force: true })
}

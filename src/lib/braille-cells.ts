export type BrailleCell = { char: string; r: number; g: number; b: number; alpha: number; lum: number }

/** Input is a cols*2 by rows*4 RGBA sample, retaining the eight spatial dots per cell. */
export function brailleCells(pixels: Uint8ClampedArray, cols: number, rows: number, silhouette = false): BrailleCell[] {
  const bits = [1, 8, 2, 16, 4, 32, 64, 128]
  const cells: BrailleCell[] = []
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    let mask = 0, red = 0, green = 0, blue = 0, alpha = 0, count = 0
    for (let y = 0; y < 4; y++) for (let x = 0; x < 2; x++) {
      const offset = ((row * 4 + y) * cols * 2 + col * 2 + x) * 4
      const r = pixels[offset], g = pixels[offset + 1], b = pixels[offset + 2], a = pixels[offset + 3]
      const luminance = (r * .299 + g * .587 + b * .114) / 255
      const threshold = .10 + ((col * 2 + x + (row * 4 + y) * 3) % 8) / 8 * .58
      if (a < 32 || (!silhouette && luminance < threshold)) continue
      mask |= bits[y * 2 + x]
      red += r; green += g; blue += b; alpha += a; count++
    }
    const r = count ? Math.round(red / count) : 0
    const g = count ? Math.round(green / count) : 0
    const b = count ? Math.round(blue / count) : 0
    cells.push({ char: String.fromCharCode(0x2800 + mask), r, g, b, alpha: count ? alpha / count / 255 : 0, lum: r * .299 + g * .587 + b * .114 })
  }
  return cells
}

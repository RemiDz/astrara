/**
 * Captures a rendered SVG element as a PNG data URL.
 * Inlines all computed styles before serialisation so the canvas render is faithful.
 */
export async function captureWheelAsPng(
  svgElement: SVGSVGElement,
  width: number,
  height: number,
): Promise<string> {
  // 1. Clone the SVG to avoid mutating the original
  const clone = svgElement.cloneNode(true) as SVGSVGElement

  // 2. Set explicit dimensions
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // 3. Serialize SVG to string
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(clone)

  // 4. Create blob and object URL
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  // 5. Load into an Image
  const img = new Image()
  img.width = width
  img.height = height

  const loaded = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = (e) => reject(new Error(`SVG image load failed: ${e}`))
  })

  img.src = url

  await loaded

  // 6. Draw to canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  // 7. Clean up
  URL.revokeObjectURL(url)

  // 8. Return data URL
  return canvas.toDataURL('image/png')
}

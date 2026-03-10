import React from 'react'
import { createRoot } from 'react-dom/client'
import ZodiacBandChart from '@/components/ZodiacBandChart/ZodiacBandChart'
import type { PlanetPosition } from '@/components/NatalChartWheel/NatalChartWheel'
import { captureWheelAsPng } from '@/components/NatalChartWheel/captureWheel'

/**
 * Renders the ZodiacBandChart SVG off-screen, captures it as PNG, and returns the data URL.
 */
export async function renderZodiacBandPng(
  planets: PlanetPosition[],
  clientName: string,
  birthDate: string,
  birthTime: string,
  renderWidth: number = 1600,
  renderHeight: number = 1000,
): Promise<string> {
  const container = document.createElement('div')
  container.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;'
  document.body.appendChild(container)

  const root = createRoot(container)

  const pngUrl = await new Promise<string>((resolve, reject) => {
    let resolved = false

    const handleReady = async () => {
      if (resolved) return
      resolved = true

      try {
        await new Promise(r => setTimeout(r, 50))

        const svgEl = container.querySelector('svg')
        if (!svgEl) {
          reject(new Error('ZodiacBandChart SVG element not found after render'))
          return
        }

        // Read actual SVG dimensions
        const svgW = parseInt(svgEl.getAttribute('width') || String(renderWidth), 10)
        const svgH = parseInt(svgEl.getAttribute('height') || String(renderHeight), 10)

        const dataUrl = await captureWheelAsPng(svgEl, svgW, svgH)
        resolve(dataUrl)
      } catch (err) {
        reject(err)
      }
    }

    root.render(
      React.createElement(ZodiacBandChart, {
        planets,
        clientName,
        birthDate,
        birthTime,
        width: renderWidth,
        height: renderHeight,
        onReady: handleReady,
      })
    )

    setTimeout(() => {
      if (!resolved) {
        resolved = true
        reject(new Error('ZodiacBandChart render timed out'))
      }
    }, 5000)
  })

  root.unmount()
  document.body.removeChild(container)

  return pngUrl
}

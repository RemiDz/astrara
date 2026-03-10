import React from 'react'
import { createRoot } from 'react-dom/client'
import NatalChartWheel from '@/components/NatalChartWheel/NatalChartWheel'
import type { PlanetPosition } from '@/components/NatalChartWheel/NatalChartWheel'
import { captureWheelAsPng } from '@/components/NatalChartWheel/captureWheel'

/**
 * Renders the NatalChartWheel SVG off-screen, captures it as PNG, and returns the data URL.
 * This bridges the React component with the jsPDF-based PDF generator.
 */
export async function renderNatalWheelPng(
  planets: PlanetPosition[],
  birthDate: string,
  birthTime: string,
  renderSize: number = 800,
): Promise<string> {
  // Create off-screen container
  const container = document.createElement('div')
  container.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;'
  document.body.appendChild(container)

  const root = createRoot(container)

  // Render the SVG component and wait for onReady
  const pngUrl = await new Promise<string>((resolve, reject) => {
    let resolved = false

    const handleReady = async () => {
      if (resolved) return
      resolved = true

      try {
        // Small delay to ensure browser has painted
        await new Promise(r => setTimeout(r, 50))

        const svgEl = container.querySelector('svg')
        if (!svgEl) {
          reject(new Error('SVG element not found after render'))
          return
        }

        const dataUrl = await captureWheelAsPng(svgEl, renderSize, renderSize)
        resolve(dataUrl)
      } catch (err) {
        reject(err)
      }
    }

    root.render(
      React.createElement(NatalChartWheel, {
        planets,
        birthDate,
        birthTime,
        size: renderSize,
        onReady: handleReady,
      })
    )

    // Safety timeout — resolve with fallback after 5s
    setTimeout(() => {
      if (!resolved) {
        resolved = true
        reject(new Error('Natal wheel render timed out'))
      }
    }, 5000)
  })

  // Clean up
  root.unmount()
  document.body.removeChild(container)

  return pngUrl
}

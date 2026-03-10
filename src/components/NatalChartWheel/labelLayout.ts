// Label collision avoidance for natal chart wheel
// Distributes planet labels so they never overlap, using leader lines when displaced

export interface LabelPosition {
  planetName: string
  angleDeg: number        // Actual ecliptic longitude on wheel
  labelAngleDeg: number   // Adjusted angle after collision avoidance
  labelRadius: number     // Adjusted radius (pushed in/out if needed)
  needsLeaderLine: boolean
}

interface PlanetInput {
  name: string
  longitude: number // 0-360
}

/**
 * Layout planet labels around the wheel with collision avoidance.
 *
 * Algorithm:
 * 1. Sort planets by ecliptic longitude
 * 2. Detect clusters where angular separation < minSeparation
 * 3. Distribute cluster labels evenly across needed angular space
 * 4. Alternate radial offsets within clusters for extra separation
 * 5. Mark displaced labels for leader lines
 */
export function layoutPlanetLabels(
  planets: PlanetInput[],
  defaultRadius: number,
  minAngularSeparation: number = 14,
): LabelPosition[] {
  if (planets.length === 0) return []

  // Sort by longitude
  const sorted = [...planets].sort((a, b) => a.longitude - b.longitude)

  // Build clusters of planets that are too close together
  const clusters: number[][] = []
  let currentCluster: number[] = [0]

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[currentCluster[currentCluster.length - 1]].longitude
    const curr = sorted[i].longitude
    const diff = curr - prev

    if (diff < minAngularSeparation) {
      currentCluster.push(i)
    } else {
      clusters.push([...currentCluster])
      currentCluster = [i]
    }
  }
  clusters.push([...currentCluster])

  // Check wrap-around: last cluster's last planet to first cluster's first planet
  if (clusters.length > 1) {
    const lastCluster = clusters[clusters.length - 1]
    const lastPlanetLon = sorted[lastCluster[lastCluster.length - 1]].longitude
    const firstPlanetLon = sorted[clusters[0][0]].longitude
    const wrapDiff = (firstPlanetLon + 360) - lastPlanetLon

    if (wrapDiff < minAngularSeparation) {
      // Merge last cluster into first
      clusters[0] = [...lastCluster, ...clusters[0]]
      clusters.pop()
    }
  }

  // Assign label positions
  const results: LabelPosition[] = new Array(sorted.length)

  for (const cluster of clusters) {
    if (cluster.length === 1) {
      // Single planet — no displacement needed
      const idx = cluster[0]
      results[idx] = {
        planetName: sorted[idx].name,
        angleDeg: sorted[idx].longitude,
        labelAngleDeg: sorted[idx].longitude,
        labelRadius: defaultRadius,
        needsLeaderLine: false,
      }
    } else {
      // Multiple planets in cluster — spread them out
      const lons = cluster.map(i => sorted[i].longitude)

      // Handle wrap-around: normalize longitudes relative to cluster centre
      let minLon = lons[0]
      const normalizedLons = lons.map(l => {
        let diff = l - minLon
        if (diff > 180) diff -= 360
        if (diff < -180) diff += 360
        return diff
      })

      // Centre of the cluster
      const avgNorm = normalizedLons.reduce((a, b) => a + b, 0) / normalizedLons.length
      const clusterCentre = ((minLon + avgNorm) % 360 + 360) % 360

      // Total angular space needed
      const totalNeeded = (cluster.length - 1) * minAngularSeparation
      const startAngle = clusterCentre - totalNeeded / 2

      for (let ci = 0; ci < cluster.length; ci++) {
        const idx = cluster[ci]
        const labelAngle = ((startAngle + ci * minAngularSeparation) % 360 + 360) % 360
        const actualAngle = sorted[idx].longitude

        // Check if label was displaced
        let angleDiff = Math.abs(labelAngle - actualAngle)
        if (angleDiff > 180) angleDiff = 360 - angleDiff
        const displaced = angleDiff > 1.5

        // Determine tightest gap to a neighbour within cluster
        const prevGap = ci > 0 ? Math.abs(normalizedLons[ci] - normalizedLons[ci - 1]) : Infinity
        const nextGap = ci < cluster.length - 1 ? Math.abs(normalizedLons[ci + 1] - normalizedLons[ci]) : Infinity
        const tightest = Math.min(prevGap, nextGap)

        // Aggressive radial offset — stronger for very tight pairs
        let radialOffset: number
        if (tightest < 5) {
          // Very tight pair (e.g., Jupiter 1° / Saturn 3°) — aggressive separation
          radialOffset = ci % 2 === 0 ? -defaultRadius * 0.18 : defaultRadius * 0.18
        } else if (cluster.length > 2) {
          radialOffset = ci % 2 === 0 ? -defaultRadius * 0.12 : defaultRadius * 0.12
        } else {
          radialOffset = ci === 0 ? -defaultRadius * 0.10 : defaultRadius * 0.10
        }

        results[idx] = {
          planetName: sorted[idx].name,
          angleDeg: actualAngle,
          labelAngleDeg: labelAngle,
          labelRadius: defaultRadius + radialOffset,
          needsLeaderLine: displaced,
        }
      }
    }
  }

  return results
}

import { useRef, useCallback } from 'react'

interface TapVsDragOptions {
  moveThreshold?: number   // pixels — default 5
  timeThreshold?: number   // ms — default 300
  onTap: () => void
}

export function useTapVsDrag({ moveThreshold = 5, timeThreshold = 300, onTap }: TapVsDragOptions) {
  const startPos = useRef<{ x: number; y: number } | null>(null)
  const startTime = useRef(0)
  const isDragging = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY }
    startTime.current = Date.now()
    isDragging.current = false
    // Do NOT stopPropagation — let OrbitControls receive the event
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!startPos.current) return
    const dx = e.clientX - startPos.current.x
    const dy = e.clientY - startPos.current.y
    if (dx * dx + dy * dy > moveThreshold * moveThreshold) {
      isDragging.current = true
    }
  }, [moveThreshold])

  const onPointerUp = useCallback(() => {
    if (!startPos.current) return
    const elapsed = Date.now() - startTime.current
    if (!isDragging.current && elapsed < timeThreshold) {
      onTap()
    }
    startPos.current = null
    isDragging.current = false
  }, [timeThreshold, onTap])

  return { onPointerDown, onPointerMove, onPointerUp }
}

'use client'

import { ReactNode, useEffect, useRef, useState, useCallback } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const touchStartY = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Open: mount then animate in
  useEffect(() => {
    if (isOpen) {
      setClosing(false)
      // Next frame so the CSS animation triggers
      requestAnimationFrame(() => setVisible(true))
      document.body.style.overflow = 'hidden'
    } else {
      setVisible(false)
      setClosing(false)
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setClosing(true)
    // Wait for slide-down animation to finish, then call onClose to unmount
    setTimeout(() => {
      onClose()
    }, 200)
  }, [onClose])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    if (deltaY > 80) {
      handleClose()
    }
  }, [handleClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40">
      {/* Dim overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        style={{
          opacity: visible && !closing ? 1 : 0,
          transition: 'opacity 0.2s ease-out',
        }}
        onClick={handleClose}
      />

      {/* Bottom sheet on mobile, side panel on desktop */}
      <div
        ref={sheetRef}
        className="absolute z-10
          bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl
          md:bottom-auto md:top-0 md:left-auto md:right-0 md:max-h-full md:h-full md:w-[400px] md:rounded-t-none md:rounded-l-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.92) 0%, rgba(13, 13, 26, 0.97) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(147, 197, 253, 0.06)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          transform: visible && !closing ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.25s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 md:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white/80 z-10"
          aria-label="Close"
        >
          ✕
        </button>

        <div
          className="p-6 pt-2 md:pt-6 flex-1 min-h-0"
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

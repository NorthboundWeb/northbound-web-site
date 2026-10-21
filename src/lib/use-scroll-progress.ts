'use client'

import { type RefObject, useEffect, useState } from 'react'

/**
 * How far the page has scrolled through an element, as 0–1.
 *
 * 0 when the element's top meets the top of the viewport, 1 when its bottom
 * does. Intended for tall sections holding a sticky child: the progress value
 * is the position within the pin.
 *
 * One rAF-throttled listener per caller, so at most one layout read per frame.
 * Returns `enabled: false` when the visitor prefers reduced motion — callers
 * use that to render a sensible static state rather than an unmoving animation.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      return
    }

    setEnabled(true)
    const element = ref.current
    if (!element) return

    let frame = 0
    const measure = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) {
        setProgress(1)
        return
      }
      setProgress(Math.min(1, Math.max(0, -rect.top / travel)))
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])

  return { progress, enabled }
}

/** Maps progress to 0–1 across an arbitrary window, clamped at both ends. */
export function ramp(progress: number, from: number, to: number) {
  if (progress <= from) return 0
  if (progress >= to) return 1
  return (progress - from) / (to - from)
}

'use client'

import { VisualEditing } from '@sanity/visual-editing/react'
import { useEffect } from 'react'

export default function VisualEditingComponent() {
  useEffect(() => {
    if (window.self !== window.top) {
      document.body.style.display = 'block'
    }
  }, [])

  return <VisualEditing portal={true} />
}
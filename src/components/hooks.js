import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [])
}

export function useScrollTo(pos) {
  useEffect(() => {
    window.scrollTo(0, pos)
  }, [])
}

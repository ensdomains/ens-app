import { useState, useEffect } from 'react'
import { css } from 'emotion'

const breakpoints = {
  small: 576,
  medium: 768,
  large: 992,
  xLarge: 1200
}

const mq = Object.keys(breakpoints).reduce((accumulator, label) => {
  let prefix = typeof breakpoints[label] === 'string' ? '' : 'min-width:'
  let suffix = typeof breakpoints[label] === 'string' ? '' : 'px'
  accumulator[label] = cls =>
    css`
      @media (${prefix + breakpoints[label] + suffix}) {
        ${css`
          ${cls};
        `};
      }
    `
  return accumulator
}, {})

export const useMediaMin = bp => {
  const [matches, setMatches] = useState(false)

  useEffect(
    () => {
      const mediaList = window.matchMedia(`(min-width: ${breakpoints[bp]}px)`)

      setMatches(mediaList.matches)

      const handleChange = e => setMatches(e.matches)

      mediaList.addEventListener('change', handleChange)
      return () => mediaList.removeEventListener('change', handleChange)
    },
    [matches]
  )

  return matches
}

export default mq

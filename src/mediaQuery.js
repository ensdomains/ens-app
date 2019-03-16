import { useState, useEffect } from 'react'
import { css } from '@emotion/core'

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

const useMedia = (query, defaultState) => {
  const [state, setState] = useState(defaultState)

  useEffect(() => {
    let mounted = true
    const mql = window.matchMedia(query)
    const onChange = () => {
      if (!mounted) return
      setState(!!mql.matches)
    }

    mql.addListener(onChange)
    setState(mql.matches)

    return () => {
      mounted = false
      mql.removeListener(onChange)
    }
  }, [query])

  return state
}

export const useMediaMin = (bp, defaultState) =>
  useMedia(`(min-width: ${breakpoints[bp]}px)`, defaultState)

export const useMediaMax = (bp, defaultState) =>
  useMedia(`(max-width: ${breakpoints[bp] - 1}px)`, defaultState)

export default mq

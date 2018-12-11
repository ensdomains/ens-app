import React from 'react'
import { css } from 'emotion'
import MediaQueryLibrary from 'react-responsive'

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

export const MediaQuery = ({ children, bp }) => (
  <MediaQueryLibrary minWidth={breakpoints[bp]}>
    {matches => children(matches)}
  </MediaQueryLibrary>
)

export default mq

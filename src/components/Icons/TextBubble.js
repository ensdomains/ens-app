import React from 'react'
import styled from '@emotion/styled/macro'
import Icon from './IconBase'

const SVG = styled(Icon)`
  transform: scale(${p => (p.scale ? p.scale : 1)});
`

const TextBubble = ({ active, color, scale, className }) => (
  <SVG
    className={className}
    width="26"
    height="26"
    active={active}
    color={color}
    scale={scale}
  >
    <path
      d="M13 26C5.82 26 0 20.18 0 13S5.82 0 13 0s13 5.82 13 13-5.82 13-13 13zM8 8a1 1 0 1 0 0 2h10a1 1 0 0 0 0-2H8zm0 4a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2H8zm0 4a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H8z"
      fill="#2B2B2B"
      fillRule="evenodd"
    />
  </SVG>
)

export default TextBubble

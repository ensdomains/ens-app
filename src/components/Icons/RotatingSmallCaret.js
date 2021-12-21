import React from 'react'
import styled from '@emotion/styled/macro'
import { ReactComponent as DefaultSmallCaret } from './SmallCaret.svg'

const RotatingSmallCaretSide = styled(DefaultSmallCaret)`
  flex-shrink: 0;
  transform: ${p => (p.rotated ? 'rotate(0)' : 'rotate(-90deg)')};
  transition: 0.2s;
`

const RotatingSmallCaretTop = styled(DefaultSmallCaret)`
  flex-shrink: 0;
  transform: ${p => (p.rotated ? 'rotate(-180deg)' : 'rotate(0)')};
  transition: 0.2s;
  ${p =>
    p.highlight &&
    p.rotated &&
    `
      path {
        fill: #282929;
      }
  `}
`

export default function RotatingSmallCaret({
  start = 'right',
  rotated,
  highlight = 'false',
  testid
}) {
  if (start === 'right') {
    return (
      <RotatingSmallCaretSide
        rotated={rotated ? 1 : 0}
        highlight={highlight}
        data-testid={testid}
      />
    )
  } else if (start === 'top') {
    return (
      <RotatingSmallCaretTop
        rotated={rotated ? 1 : 0}
        highlight={highlight}
        data-testid={testid}
      />
    )
  }
}

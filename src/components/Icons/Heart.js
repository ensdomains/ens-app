import React from 'react'
import styled from '@emotion/styled/macro'
import Icon from './IconBase'

const SVG = styled(Icon)``

const Heart = ({ active, className }) => (
  <SVG width="23" height="21" active={active} className={className}>
    <path
      d="M10.369 1.737a5.771 5.771 0 0 0-8.253 0l-.184.187C-.644 4.54-.643 8.787 1.931 11.402l8.834 8.977a1.002 1.002 0 0 0 1.429 0l8.834-8.977c2.575-2.616 2.576-6.859-.002-9.478l-.183-.187a5.77 5.77 0 0 0-8.253 0l-.75.763a.504.504 0 0 1-.72 0l-.751-.763z"
      fillRule="evenodd"
    />
  </SVG>
)

export default Heart

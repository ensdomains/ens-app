import React from 'react'
import styled from '@emotion/styled/macro'
import Icon from './IconBase'

const SVG = styled(Icon)``

const File = ({ active, className }) => (
  <SVG
    width="21"
    height="19"
    xmlns="http://www.w3.org/2000/svg"
    active={active}
    className={className}
  >
    <g fillRule="evenodd">
      <rect width="18" height="5" rx="2.5" />
      <rect y="14" width="14" height="5" rx="2.5" />
      <rect y="7" width="21" height="5" rx="2.5" />
    </g>
  </SVG>
)

export default File

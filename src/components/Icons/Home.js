import React from 'react'
import styled from '@emotion/styled/macro'
import Icon from './IconBase'

const SVG = styled(Icon)`
  transform: scale(${p => (p.scale ? p.scale : 1)});
  path {
    width: 50px;
  }
`

const Home = ({ active, color, scale, className }) => (
  <SVG
    className={className}
    width="23"
    height="20"
    active={active}
    color={color}
  >
    <path
      d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"
      fillRule="evenodd"
    />{' '}
  </SVG>
)

export default Home

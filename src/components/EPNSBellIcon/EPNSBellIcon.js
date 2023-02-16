import React from 'react'
import styled from '@emotion/styled/macro'

const Icon = styled('div')`
  width: 32px;
  height: 32px;
  margin-top: -7px;
  cursor: pointer;
`
const defaultSize = '32px'

const Image = styled('img')`
  width: ${props => props.size || defaultSize};
  height: ${props => props.size || defaultSize};
`

export default function({
  size, // px
  ...otherProps
}) {
  return (
    <Icon {...otherProps}>
      <Image
        alt="EPNS Bell Icon"
        src="https://backend-dev.epns.io/assets/epnslogo.png"
        width={size}
        height={size}
      />
    </Icon>
  )
}

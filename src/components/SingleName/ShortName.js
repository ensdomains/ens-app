import React from 'react'
import styled from '@emotion/styled'

const ShortNameContainer = styled('div')`
  padding: 30px 40px;
  text-align: center;
`

export default function ShortName() {
  return (
    <ShortNameContainer>
      Short names are not currently on auction, but they can be reserved at{' '}
      <a href="https://reserve.ens.domains">reserve.ens.domains</a>. The
      auctions will begin soon after the reservation process.
    </ShortNameContainer>
  )
}

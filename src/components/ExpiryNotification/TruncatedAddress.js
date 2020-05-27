import React from 'react'
import styled from '@emotion/styled'

const TruncatedAddressContainer = styled('span')`
  font-weight: 500;
`

export default function TruncatedAddress({ address = '' }) {
  const showFullAddress = false
  const addressTruncated = address.substr(0, 14)

  return (
    <TruncatedAddressContainer title={address}>
      {showFullAddress ? address : addressTruncated}
      {!showFullAddress && <span>&hellip;</span>}
    </TruncatedAddressContainer>
  )
}

import React from 'react'
import Address from '../components/Address'

const AddressContainer = ({ match, location }) => {
  const address = match.params.address.toLowerCase()
  const queryParams = new URLSearchParams(location.search)
  return (
    <Address
      address={address}
      showOriginBanner={queryParams.get('origin') === 'renew'}
    />
  )
}

export default AddressContainer

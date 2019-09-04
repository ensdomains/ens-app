import React from 'react'
import Address from '../components/Address'

const AddressContainer = ({ match }) => {
  const address = match.params.address.toLowerCase()
  return <Address address={address} />
}

export default AddressContainer

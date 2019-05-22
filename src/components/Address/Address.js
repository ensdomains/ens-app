import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ENS from 'ethereum-ens'

const AddressInput = ({ provider }) => {
  const [inputValue, setInputValue] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState('')

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()

        const ens = new ENS(provider)
        const address = await ens.resolver(inputValue).addr()

        setResolvedAddress(address)

        return false
      }}
    >
      <input
        onChange={e => {
          setInputValue(e.currentTarget.value)
        }}
      />
      <p>{resolvedAddress}</p>
      <button type="submit">Search</button>
    </form>
  )
}

AddressInput.propTypes = {
  provider: PropTypes.object
}

export default AddressInput

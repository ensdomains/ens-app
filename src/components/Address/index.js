import React, { useState } from 'react'
import ENS from 'ethereum-ens'

function Address({ className, provider }) {
  const { Blockies, AddressForm, AutoComplete } = className
  const [value, setValue] = useState(null)
  const [resolvedAddress, setResolvedAddress] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const ethereumRegEx = /^0x[a-fA-F0-9]{40}$/
  return (
    <AddressForm
      className={className}
      onSubmit={async e => {
        e.preventDefault()
        if (ethereumRegEx.test(value)) {
          setResolvedAddress(value)
        } else {
          const ens = new ENS(provider)
          ens
            .resolver(value)
            .addr()
            .then(response => {
              setResolvedAddress(response)
              setErrorMessage(null)
            })
            .catch(err => {
              setErrorMessage(err.toString())
              setResolvedAddress(null)
            })
        }

        return false
      }}
    >
      <AutoComplete>
        <input
          type="text"
          value={value ? value : ''}
          onChange={e => setValue(e.target.value)}
          placeholder="Enter Address or ENS Name"
        />
        {resolvedAddress && (
          <>
            {Blockies && <Blockies address={resolvedAddress} imageSize={40} />}
            <span className="address">{resolvedAddress}</span>
          </>
        )}
        {errorMessage && <span className="error">{errorMessage}</span>}
      </AutoComplete>
      <button type="submit">Search</button>
    </AddressForm>
  )
}

export default Address

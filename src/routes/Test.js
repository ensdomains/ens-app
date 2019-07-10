import React, { useState } from 'react'
import AddressInput from '@ensdomains/react-ens-address'

export const TestPage = () => {
  const [resolvedAddress, setResolvedAddress] = useState(null)
  const [error, setError] = useState(null)

  return (
    <>
      <p>Default</p>
      <AddressInput provider={window.web3 || window.ethereum} />

      <p>Without search icon</p>
      <AddressInput
        provider={window.web3 || window.ethereum}
        showSearchIcon={false}
      />

      <p>Without search icon & without blockies</p>
      <AddressInput
        provider={window.web3 || window.ethereum}
        showSearchIcon={false}
        showBlockies={false}
      />

      <p>Custom placeholder</p>
      <AddressInput
        provider={window.web3 || window.ethereum}
        placeholder="Test test test"
      />

      <p>
        With onResolve handler:{' '}
        <span className="resolve-result">{resolvedAddress}</span>
      </p>
      <AddressInput
        provider={window.web3 || window.ethereum}
        onResolve={setResolvedAddress}
      />

      <p>
        With onError handler: <span className="error-result">{error}</span>
      </p>
      <AddressInput
        provider={window.web3 || window.ethereum}
        onError={setError}
      />

      <p>Small</p>
      <AddressInput
        provider={window.web3 || window.ethereum}
        className="small"
      />

      <br />
    </>
  )
}

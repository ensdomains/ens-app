import React, { useState } from 'react'
import Web3 from 'web3'
import AddressInput from '../components/Address/Address'

const web3 = new Web3(
  'https://mainnet.infura.io/v3/b608a8ce95964c469961c30385809cca'
)
web3.currentProvider.sendAsync = web3.currentProvider.send

export const TestPage = () => {
  const [resolvedAddress, setResolvedAddress] = useState(null)
  const [error, setError] = useState(null)

  return (
    <>
      <p>Default</p>
      <AddressInput provider={web3.currentProvider} />

      <p>Without search icon</p>
      <AddressInput provider={web3.currentProvider} showSearchIcon={false} />

      <p>Without search icon & without blockies</p>
      <AddressInput
        provider={web3.currentProvider}
        showSearchIcon={false}
        showBlockies={false}
      />

      <p>Custom placeholder</p>
      <AddressInput
        provider={web3.currentProvider}
        placeholder="Test test test"
      />

      <p>
        With onResolve handler:{' '}
        <span className="resolve-result">{resolvedAddress}</span>
      </p>
      <AddressInput
        provider={web3.currentProvider}
        onResolve={setResolvedAddress}
      />

      <p>
        With onError handler: <span className="error-result">{error}</span>
      </p>
      <AddressInput provider={web3.currentProvider} onError={setError} />

      <p>Small</p>
      <AddressInput provider={web3.currentProvider} className="small" />

      <br />
    </>
  )
}

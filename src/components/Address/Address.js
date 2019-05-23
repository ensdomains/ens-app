import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ENS from 'ethereum-ens'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value])

  return debouncedValue
}

function resolveName(search, provider) {
  const ens = new ENS(provider)

  return ens
    .resolver(search)
    .addr()
    .then(addr => addr)
    .catch(err => {
      console.error(err)
      return 'Unable to find address'
    })
}

const AddressInput = ({ provider }) => {
  const [inputValue, setInputValue] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  const debouncedSearchTerm = useDebounce(inputValue, 500)

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsResolving(true)

      resolveName(debouncedSearchTerm, provider).then(result => {
        setIsResolving(false)

        setResolvedAddress(result)
      })
    } else {
      setIsResolving(false)
    }
  }, [debouncedSearchTerm])

  return (
    <>
      <label>Search ENS name </label>
      <input
        onChange={async e => {
          setInputValue(e.currentTarget.value)
        }}
      />
      {isResolving && <p>Searching ...</p>}
      <p>{resolvedAddress}</p>
    </>
  )
}

AddressInput.propTypes = {
  provider: PropTypes.object
}

export default AddressInput

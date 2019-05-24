import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ENS from 'ethereum-ens'
import { isValid } from 'ipaddr.js'

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

function checkAndValidate(input, setInputType) {
  const namePattern = /^[\w\d.]+$/
  const addressPattern = /^0x[a-fA-F0-9]{40}$/
  let isValid = false
  if (input.slice(0, 2) === '0x') {
    isValid = addressPattern.test(input)
    setInputType('address')
  } else {
    isValid = namePattern.test(input)
    setInputType('name')
  }

  return isValid
}

function resolveName(search, ens) {
  return ens
    .resolver(search)
    .addr()
    .then(addr => addr)
    .catch(err => {
      console.error(err)
      return 'Unable to find address'
    })
}

function resolveAddress(search, ens) {
  return ens
    .reverse(search)
    .addr()
    .then(addr => addr)
    .catch(err => {
      console.error(err)
      return 'Unable to find address'
    })
}

const AddressInput = ({ provider, className }) => {
  const [inputValue, setInputValue] = useState('')
  const [inputType, setInputType] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  const ens = new ENS(provider)
  const debouncedSearchTerm = useDebounce(inputValue, 500)

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsResolving(true)

      if (checkAndValidate(debouncedSearchTerm, setInputType)) {
        if (inputType === 'address') {
          resolveAddress(debouncedSearchTerm, ens).then(result => {
            setIsResolving(false)

            setResolvedAddress(result)
          })
        } else {
          resolveName(debouncedSearchTerm, ens).then(result => {
            setIsResolving(false)
            setResolvedAddress(result)
          })
        }
      } else {
        setIsResolving(false)
        alert('wrong input')
      }
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

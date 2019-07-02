import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ENS from 'ethereum-ens'
import _ from 'lodash'
import {
  getEthAddressType,
  isAddress,
  ETH_ADDRESS_TYPE
} from '../../utils/address.js'
import Loader from '../../components/Loader.js'
import { SingleNameBlockies } from '../../components/SingleName/SingleNameBlockies.js'
import warningImage from '../../assets/warning.svg'
import searchImage from '../../assets/search.svg'

import './style.css'

const ENS_NOT_FOUND = 'ENS name not found'

function Address(props) {
  const [resolvedAddress, setResolvedAddress] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [isResolvingInProgress, setIsResolvingInProgress] = useState(false)
  const [error, setError] = useState(null)
  const [inputDebouncer, setInputDebouncer] = useState(null)

  const inputDebouncerHandler = async (ens, input) => {
    try {
      const result = await resolveName(ens, input)
      setError(null)
      const { address, type, name } = result
      if (type === 'name') {
        setResolvedAddress(address)
      } else if (type === 'address') {
        setResolvedAddress(name)
      }

      props.onResolve(result)
      props.onError(null)
    } catch (error) {
      setError(error.toString())
      setResolvedAddress(null)

      props.onResolve({
        address: input,
        name: null,
        type: null
      })
      props.onError(error)
    }
  }

  useEffect(() => {
    const ens = new ENS(props.provider)
    setInputDebouncer(() =>
      _.debounce(inputDebouncerHandler.bind(null, ens), 500)
    )
  }, [props.provider])

  const handleInput = async address => {
    if (!address) {
      setInputValue('')
      setError(null)
      setResolvedAddress(null)

      return inputDebouncer.cancel()
    }

    setInputValue(address)
    inputDebouncer(address)
  }

  const handleResolver = async fn => {
    try {
      setIsResolvingInProgress(true)
      setResolvedAddress(null)
      return await fn()
    } catch (error) {
      if (error && error.message && error.message === ENS_NOT_FOUND) return
      throw error
    } finally {
      setIsResolvingInProgress(false)
    }
  }

  const resolveName = async (ens, inputValue) => {
    const addressType = getEthAddressType(inputValue)

    if (addressType === ETH_ADDRESS_TYPE.name) {
      return await handleResolver(async () => ({
        address: await ens.resolver(inputValue).addr(),
        name: inputValue,
        type: 'name'
      }))
    } else if (addressType === ETH_ADDRESS_TYPE.address) {
      return await handleResolver(async () => ({
        name: await ens.reverse(inputValue).name(),
        address: inputValue,
        type: 'address'
      }))
    }

    throw 'Incorrect address or name'
  }

  const isResolveNameNotFound = () => {
    return (
      !resolvedAddress &&
      inputValue &&
      !isResolvingInProgress &&
      getEthAddressType(inputValue) !== ETH_ADDRESS_TYPE.address
    )
  }

  const showBlockies = () => {
    if (props.showBlockies) {
      let address

      if (isAddress(inputValue)) {
        address = inputValue
      } else if (isAddress(resolvedAddress)) {
        address = resolvedAddress
      }

      if (address) {
        return (
          <SingleNameBlockies
            address={address.toLowerCase()}
            imageSize={30}
            className="blockies"
          />
        )
      }
    }
  }

  return (
    <div className={`cmp-address-wrapper ${props.className}`}>
      <div
        className={`cmp-address  ${resolvedAddress ? 'resolved' : ''} ${
          error ? 'error' : ''
        }`}
      >
        <div className="input-wrapper">
          <div className="indicator">
            {isResolvingInProgress && <Loader className="loader" />}
            {!isResolvingInProgress && showBlockies()}
            {isResolveNameNotFound() && (
              <img src={warningImage} className="icon-wrapper error-icon" />
            )}
            {props.showSearchIcon && !inputValue && (
              <img src={searchImage} className="icon-wrapper search-icon" />
            )}
          </div>
          <input
            onChange={e => handleInput(e.currentTarget.value)}
            placeholder={props.placeholder}
            spellCheck={false}
            name="ethereum"
          />
        </div>
        <div className="info-wrapper">
          {resolvedAddress && <div className="resolved">{resolvedAddress}</div>}
        </div>
      </div>
    </div>
  )
}

Address.propTypes = {
  provider: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  showBlockies: PropTypes.bool,
  showSearchIcon: PropTypes.bool,
  onError: PropTypes.func,
  onResolve: PropTypes.func,
  className: PropTypes.string
}

Address.defaultProps = {
  placeholder: 'Enter Ethereum name or address',
  showBlockies: true,
  showSearchIcon: false,
  className: '',
  onError: function() {},
  onResolve: function() {}
}

export default Address

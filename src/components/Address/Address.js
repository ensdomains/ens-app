import React from 'react'
import PropTypes from 'prop-types'
import ENS from 'ethereum-ens'
import _ from 'lodash'
import { getEthAddressType, ETH_ADDRESS_TYPE } from '../../utils/address.js'
import Loader from '../../components/Loader.js'
import { SingleNameBlockies } from '../../components/SingleName/SingleNameBlockies.js'
import warningImage from '../../assets/warning.svg'
import searchImage from '../../assets/search.svg'
import tickImage from '../../assets/greenTick.svg'

import './style.css'

const ENS_NOT_FOUND = 'ENS name not found'

class AddressInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      resolvedAddress: null,
      inputValue: '',
      isResolvingInProgress: false,
      error: null
    }

    this.placeholder =
      'placeholder' in props
        ? props.placeholder
        : 'Enter Ethereum name or address'
    this.showBlockies = 'showBlockies' in props ? props.showBlockies : true
    this.showSearchIcon =
      'showSearchIcon' in props ? props.showSearchIcon : true
    this.className = props.className || ''
    this.onError = props.onError || function() {}
    this.onResolve = props.onResolve || function() {}

    this.ens = new ENS(props.provider)

    this.inputDebouncer = _.debounce(this.inputDebouncerHandler, 300)
  }

  async inputDebouncerHandler(address) {
    try {
      const result = await this.resolveName(address)
      this.setState({ error: null, resolvedAddress: result })

      this.onResolve(result)
      this.onError(null)
    } catch (error) {
      this.setState({ error: error.toString(), resolvedAddress: null })

      this.onResolve(null)
      this.onError(error)
    }
  }

  async handleInput(address) {
    if (!address) {
      this.setState({ inputValue: '', error: null, resolvedAddress: null })
      this.inputDebouncer.cancel()
      return
    }

    this.setState({ inputValue: address })
    this.inputDebouncer(address)
  }

  async handleResolver(fn) {
    try {
      this.setState({ isResolvingInProgress: true, resolvedAddress: null })
      return await fn()
    } catch (error) {
      if (error && error.message && error.message === ENS_NOT_FOUND) return
      throw error
    } finally {
      this.setState({ isResolvingInProgress: false })
    }
  }

  async resolveName(address) {
    const addressType = getEthAddressType(address)

    if (addressType === ETH_ADDRESS_TYPE.name) {
      return await this.handleResolver(() => this.ens.resolver(address).addr())
    } else if (addressType === ETH_ADDRESS_TYPE.address) {
      return await this.handleResolver(() => this.ens.reverse(address).name())
    }

    throw 'Incorrect address or name'
  }

  isResolveNameNotFound() {
    return (
      !this.state.resolvedAddress &&
      this.state.inputValue &&
      !this.state.isResolvingInProgress &&
      getEthAddressType(this.state.inputValue) !== ETH_ADDRESS_TYPE.address
    )
  }

  showResolved() {
    if (this.state.resolvedAddress) {
      if (!this.showBlockies)
        return <img src={tickImage} className="icon-wrapper tick-icon" />
      return (
        <SingleNameBlockies
          address={this.state.resolvedAddress}
          imageSize={40}
          className="blockies"
        />
      )
    }
  }

  render() {
    return (
      <div
        className={`cmp-address ${this.className} ${
          this.state.resolvedAddress ? 'resolved' : ''
        } ${this.state.error ? 'error' : ''}`}
      >
        <div className="input-wrapper">
          <div className="indicator">
            {this.state.isResolvingInProgress && <Loader className="loader" />}
            {this.showResolved()}
            {this.isResolveNameNotFound() && (
              <img src={warningImage} className="icon-wrapper error-icon" />
            )}
            {this.showSearchIcon && !this.state.inputValue && (
              <img src={searchImage} className="icon-wrapper search-icon" />
            )}
          </div>
          <input
            onChange={e => this.handleInput(e.currentTarget.value)}
            placeholder={this.placeholder}
            spellCheck={false}
            name="ethereum"
          />
        </div>
        <div className="info-wrapper">
          {this.state.resolvedAddress && (
            <div className="resolved">{this.state.resolvedAddress}</div>
          )}
        </div>
      </div>
    )
  }
}

AddressInput.propTypes = {
  provider: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  showBlockies: PropTypes.bool,
  showSearchIcon: PropTypes.bool,
  onError: PropTypes.func,
  onResolve: PropTypes.func,
  className: PropTypes.string
}

export default AddressInput

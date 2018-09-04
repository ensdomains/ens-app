import React, { Component } from 'react'
import styled from 'react-emotion'

const errorData = {
  domainMalformed: {
    short: searchTerm =>
      `Domain malformed. ${searchTerm} is not a valid domain.`,
    long: searchTerm =>
      `You have either added a domain without a TLD such as .eth or you have added unsupported characters`
  },
  unsupported: {
    short: searchTerm =>
      `Domain tld unsupported. ${searchTerm
        .split('.')
        .splice(-1, 1)} is not currently a support tld.`,
    long: searchTerm =>
      `We currently only support .eth and .xyz domains. Support for future domains are planned in the future`
  },
  tooShort: {
    short: searchTerm =>
      `Name is too short. Names must be at least 7 characters long. `,
    long: searchTerm => `Domain malformed. ${searchTerm} is not a valid domain.`
  }
}

class SingleError extends Component {
  state = {
    show: false
  }

  toggleError = () => {
    this.setState(state => ({ show: !state.show }))
  }
  render() {
    const { error, searchTerm } = this.props
    return (
      <SingleErrorContainer>
        <ShortError onClick={this.toggleError}>
          {errorData[error].short(searchTerm)}
        </ShortError>
        <LongError show={this.state.show}>
          {errorData[error].long(searchTerm)}
        </LongError>
      </SingleErrorContainer>
    )
  }
}

class SearchErrors extends Component {
  render() {
    const { errors, searchTerm } = this.props
    return (
      <SearchErrorsContainer>
        {errors.map(e => (
          <SingleError error={e} searchTerm={searchTerm} />
        ))}
      </SearchErrorsContainer>
    )
  }
}

const SearchErrorsContainer = styled('div')``

const SingleErrorContainer = styled('div')``

const ShortError = styled('div')``

const LongError = styled('div')`
  display: ${({ show }) => (show ? 'block' : 'none')};
`

export default SearchErrors

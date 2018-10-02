import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import { H2 } from '../Typography/Basic'
import WarningDefault from '../Icons/Warning'
import SmallCaret from '../Icons/SmallCaret'

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
    short: searchTerm => (
      <Fragment>
        <strong>Name is too short</strong>. Names must be at least 7 characters
        long.
      </Fragment>
    ),
    long: searchTerm =>
      `Names less than 6 characters have been reserved for when the permanent registrar has been released.`
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
        <ShortError onClick={this.toggleError} show={this.state.show}>
          <ShortErrorMessage>
            {errorData[error].short(searchTerm)}
          </ShortErrorMessage>
          <SmallCaret />
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
        <ErrorH2>
          Warning
          <Warning />
        </ErrorH2>
        {errors.map(e => (
          <SingleError error={e} searchTerm={searchTerm} />
        ))}
      </SearchErrorsContainer>
    )
  }
}

const SearchErrorsContainer = styled('div')``

const SingleErrorContainer = styled('div')``

const ShortError = styled('div')`
  background: #fff1f1;
  padding: 25px 30px;
  border-radius: ${({ show }) => (show ? '6px 6px 0 0 ' : '6px')};
  border: 1px solid #dc2e2e;
  color: #dc2e2e;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`

const ShortErrorMessage = styled('div')``

const LongError = styled('div')`
  display: ${({ show }) => (show ? 'block' : 'none')};
  background: #fff1f1;
  padding: 25px 30px;
  border-radius: 0 0 6px 6px;
  border: 1px solid #dc2e2e;
  border-top: none;
  color: black;
  font-size: 18px;
`

const ErrorH2 = styled(H2)`
  color: #dc2e2e;
`

const Warning = styled(WarningDefault)`
  margin-left: 5px;
`

export default SearchErrors

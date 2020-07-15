import React, { Component, Fragment } from 'react'
import styled from '@emotion/styled/macro'
import { H2 } from '../Typography/Basic'
import WarningDefault from '../Icons/Warning'
import { ReactComponent as DefaultSmallCaret } from '../Icons/SmallCaret.svg'
import { withTranslation } from 'react-i18next'

const SmallCaret = styled(DefaultSmallCaret)`
  path {
    fill: #2b2b2b;
  }
`

class SingleError extends Component {
  state = {
    show: false
  }

  toggleError = () => {
    this.setState(state => ({ show: !state.show }))
  }

  render() {
    const { error, searchTerm, t } = this.props

    const errorData = {
      domainMalformed: {
        short: searchTerm =>
          t('searchErrors.domainMalformed.short', { searchTerm }),
        long: searchTerm => t('searchErrors.domainMalformed.long')
      },
      unsupported: {
        short: searchTerm => {
          const tld = searchTerm
            .split('.')
            .splice(-1, 1)[0]
            .toUpperCase()
          return t('searchErrors.unsupported.short', { tld })
        },
        long: searchTerm => t('searchErrors.unsupported.long')
      },
      tooShort: {
        short: searchTerm => (
          <Fragment>
            <strong>{t('searchErrors.tooShort.short1')}</strong>
            {t('searchErrors.tooShort.short2')}
          </Fragment>
        ),
        long: searchTerm => {
          t('searchErrors.tooShort.long')
        }
      }
    }

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
    const { errors, searchTerm, t } = this.props
    return (
      <SearchErrorsContainer>
        <ErrorH2>
          {t('c.warning')}
          <Warning />
        </ErrorH2>
        {errors.map((e, i) => (
          <SingleError t={t} key={i} error={e} searchTerm={searchTerm} />
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

const SearchErrorsWithTranslation = withTranslation()(SearchErrors)

export default SearchErrorsWithTranslation

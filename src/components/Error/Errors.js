import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled/macro'

import warningImage from '../../assets/warning.svg'

const ErrorContainer = styled('div')`
  color: black;
  padding: 40px 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto 0;
`

const Warning = styled('img')`
  width: 40px;
`

const H2 = styled('h2')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 28px;
  color: #2b2b2b;
  text-align: center;
`

const Message = styled('div')``

export const NetworkError = ({ message }) => (
  <ErrorContainer data-testid="network-error">
    <Message>
      <Warning src={warningImage} />
      <H2>{message}</H2>
      <br />
      Please change your dapp browser to Mainnet, Ropsten, Rinkeby or Goerli
    </Message>
  </ErrorContainer>
)

export const InvalidCharacterError = ({ message }) => (
  <ErrorContainer>
    <Message>
      <Warning src={warningImage} />
      <H2>{message}</H2>
      One or more domain names contain UTS46 forbidden characters.{' '}
      <Link to="/">Click here</Link> to go back to the home page.
    </Message>
  </ErrorContainer>
)

export const Error404 = () => (
  <ErrorContainer>
    <Message>
      <Warning src={warningImage} />
      <H2>404</H2>
      We couldn't find what you were looking for!
    </Message>
  </ErrorContainer>
)

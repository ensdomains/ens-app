import React from 'react'
import styled from 'react-emotion'

import WarningImage from '../../assets/warning.svg'

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
  <ErrorContainer>
    {message}
    <br />
    Please change your dapp browser to Mainnet, Ropsten, Rinkeby or Goerli
  </ErrorContainer>
)

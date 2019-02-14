import React from 'react'
import styled from 'react-emotion'

const ErrorContainer = styled('div')`
  color: white;
  padding: 20px;
  text-align: center;
  background: red;
`

export const NetworkError = ({ message }) => (
  <ErrorContainer>
    {message}
    <br />
    Please change your dapp browser to Mainnet, Ropsten, Rinkeby or Goerli
  </ErrorContainer>
)

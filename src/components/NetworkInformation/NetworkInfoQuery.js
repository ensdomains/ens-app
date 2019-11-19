import React from 'react'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Loader from '../Loader'

export const GET_WEB3 = gql`
  query web3 {
    web3 @client {
      accounts
      network
    }
  }
`

const Waiting = styled('div')`
  color: #ccc;
  display: flex;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
`

const WaitingText = styled('span')`
  margin-right: 5px;
`

const NetworkInfoQuery = ({ noLoader, children }) => (
  <Query query={GET_WEB3}>
    {({ data, loading, error }) => {
      if (loading)
        return noLoader ? (
          ''
        ) : (
          <Waiting>
            <WaitingText>Waiting for accounts</WaitingText> <Loader />
          </Waiting>
        )
      const {
        web3: { accounts, network }
      } = data
      return children({ accounts, network })
    }}
  </Query>
)

export default NetworkInfoQuery

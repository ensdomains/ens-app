import React, { Component } from 'react'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
//import { GET_WEB3 } from '../../graphql/queries'
import Loader from '../Loader'

const NetworkInformationContainer = styled('div')``

export const GET_WEB3 = gql`
  query web3 {
    web3 @client {
      accounts
      network
    }
  }
`

class NetworkInformation extends Component {
  render() {
    return (
      <Query query={GET_WEB3}>
        {({ data, loading }) => {
          if (loading) return <Loader />
          const {
            web3: { accounts, network }
          } = data
          return (
            <NetworkInformationContainer>
              {accounts[0]}
              <br />
              {network} network
            </NetworkInformationContainer>
          )
        }}
      </Query>
    )
  }
}
export default NetworkInformation

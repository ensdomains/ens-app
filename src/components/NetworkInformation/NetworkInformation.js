import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
//import { GET_WEB3 } from '../../graphql/queries'
import NetworkInfoQuery from './NetworkInfoQuery'
import UnstyledBlockies from '../Blockies'
import ReverseResolution from '../ReverseResolution'

const NetworkInformationContainer = styled('div')`
  position: relative;
  padding-left: 40px;
  margin-bottom: 50px;
`

const Blockies = styled(UnstyledBlockies)`
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-15px, 5px);
  box-shadow: 3px 5px 24px 0 #d5e2ec;
`

const NetworkStatus = styled('div')`
  color: #cacaca;
  font-size: 14px;
  text-transform: capitalize;
  font-weight: 100;
  margin-top: -2px;
  margin-left: 1px;
`

const Account = styled('div')`
  color: #adbbcd;
  font-size: 18px;
  font-weight: 200;
  width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    overflow: visible;
    white-space: normal;
  }
`

const NoAccountContainer = styled('div')``

class NoAccount extends Component {
  render() {
    return <NoAccountContainer>No Account</NoAccountContainer>
  }
}

class NetworkInformation extends Component {
  render() {
    return (
      <NetworkInfoQuery>
        {({ accounts, network }) => (
          <NetworkInformationContainer>
            {accounts.length > 0 ? (
              <Fragment>
                <Blockies address={accounts[0]} imageSize={47} />
                <Account>
                  <ReverseResolution address={accounts[0]} />
                </Account>
                <NetworkStatus>{network} network</NetworkStatus>
              </Fragment>
            ) : (
              <NoAccount />
            )}
          </NetworkInformationContainer>
        )}
      </NetworkInfoQuery>
    )
  }
}
export default NetworkInformation

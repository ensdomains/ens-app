import React, { Component } from 'react'
import styled from '@emotion/styled'

import mq from 'mediaQuery'

import NetworkInfoQuery from './NetworkInfoQuery'
import UnstyledBlockies from '../Blockies'
import ReverseRecord from '../ReverseRecord'
import NoAccountsModal from '../NoAccounts/NoAccountsModal'

const NetworkInformationContainer = styled('div')`
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 20px;
  ${mq.medium`
    margin-bottom: 50px;
    display: block;
    border: none;
  `}
`

const Blockies = styled(UnstyledBlockies)`
  border-radius: 50%;
  position: absolute;
  left: 10px;
  top: 10px;
  ${mq.medium`
    box-shadow: 3px 5px 24px 0 #d5e2ec;
  `}
`

const NetworkStatus = styled('div')`
  color: #cacaca;
  font-size: 14px;
  text-transform: capitalize;
  font-weight: 100;
  margin-top: -2px;
  margin-left: 1px;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: flex;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: #5284ff;
    margin-right: 5px;
  }
`

const Account = styled('div')`
  color: #adbbcd;
  font-size: 18px;
  font-weight: 200;
  width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AccountContainer = styled('div')`
  padding: 10px 10px 10px 65px;
  position: relative;
  ${mq.medium`
    transform: translate(-25px, 5px);
    width: 200px;
    &:hover {
      width: 475px;
      background: white;
      box-shadow: -4px 18px 70px 0 rgba(108, 143, 167, 0.32);
      border-radius: 6px;
      .account {
        width: 200px;
        overflow: visible;
        white-space: normal;
      }
    }
  `}
`

class NetworkInformation extends Component {
  render() {
    return (
      <NetworkInfoQuery>
        {({ accounts, network }) => (
          <NetworkInformationContainer hasAccount={accounts.length > 0}>
            {accounts.length > 0 ? (
              <AccountContainer>
                <Blockies address={accounts[0]} imageSize={47} />
                <Account data-testid="account" className="account">
                  <ReverseRecord address={accounts[0]} />
                </Account>
                <NetworkStatus>{network} Network</NetworkStatus>
              </AccountContainer>
            ) : (
              <NoAccountsModal colour={'#F5A623'} />
            )}
          </NetworkInformationContainer>
        )}
      </NetworkInfoQuery>
    )
  }
}
export default NetworkInformation

import React, { Component } from 'react'
import styled from 'react-emotion'
import NetworkInfoQuery from './NetworkInfoQuery'
import UnstyledBlockies from '../Blockies'
import ReverseResolution from '../ReverseResolution'
import NoAccount from '../NoAccounts'

const NetworkInformationContainer = styled('div')`
  position: relative;
  margin-bottom: 50px;
`

const Blockies = styled(UnstyledBlockies)`
  border-radius: 50%;
  position: absolute;
  left: 10px;
  top: 10px;
  box-shadow: 3px 5px 24px 0 #d5e2ec;
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
`

const NoAccountContainer = styled('div')`
  position: relative;
`

const NoAccountExplanation = styled('div')`
  box-shadow: -4px 18px 70px 0 rgba(108, 143, 167, 0.32);
  position: absolute;
  top: 100%;
  left: 0;
  transform: translateX(${p => (p.show ? 0 : '-400px')});
  opacity: ${p => (p.show ? 1 : 0)};
  background: white;
  padding: 20px;
  font-size: 18px;
  width: 305px;
  z-index: 10;
  border-radius: 0 0 6px 6px;
  transition: 0.2s;
`

const Point = styled('div')`
  position: relative;
  padding-left: 25px;
  font-weight: 300;
  margin-bottom: 25px;
  &:before {
    content: '${({ number }) => number}';
    font-size: 10px;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background: #C7D3E3;
    left: 0;
    top: 5px;
    position: absolute;
  }
`

class NetworkInformation extends Component {
  state = {
    showModal: false
  }
  render() {
    return (
      <NetworkInfoQuery>
        {({ accounts, network }) => (
          <NetworkInformationContainer hasAccount={accounts.length > 0}>
            {accounts.length > 0 ? (
              <AccountContainer>
                <Blockies address={accounts[0]} imageSize={47} />
                <Account className="account">
                  <ReverseResolution address={accounts[0]} />
                </Account>
                <NetworkStatus>{network} network</NetworkStatus>
              </AccountContainer>
            ) : (
              <NoAccountContainer>
                <NoAccount
                  colour={'#F5A623'}
                  active={this.state.showModal}
                  onClick={() =>
                    this.setState(state => ({ showModal: !state.showModal }))
                  }
                />
                <NoAccountExplanation
                  show={this.state.showModal}
                  onClick={() =>
                    this.setState(state => ({ showModal: !state.showModal }))
                  }
                >
                  <Point number="1">
                    Install Metamask or use another Dapp browser to search the
                    ENS registry.
                  </Point>
                  <Point number="2">
                    Login to Metamask and unlock your wallet to use all the
                    features of ENS.
                  </Point>
                </NoAccountExplanation>
              </NoAccountContainer>
            )}
          </NetworkInformationContainer>
        )}
      </NetworkInfoQuery>
    )
  }
}
export default NetworkInformation

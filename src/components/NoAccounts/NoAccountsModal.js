import React from 'react'
import styled from '@emotion/styled/macro'
import NoAccounts from './NoAccounts'

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

class NoAccountsModal extends React.Component {
  state = {
    showModal: false
  }
  toggleModal = () => this.setState(state => ({ showModal: !state.showModal }))
  render = () => {
    const { colour, textColour, className } = this.props
    const { showModal } = this.state

    return (
      <NoAccountContainer className={className}>
        <NoAccounts
          colour={colour}
          textColour={textColour}
          active={showModal}
          onClick={this.toggleModal}
        />
        <NoAccountExplanation show={showModal} onClick={this.toggleModal}>
          <Point number="1">
            Install Metamask or use another Dapp browser to search the ENS
            registry.
          </Point>
          <Point number="2">
            Login to Metamask and unlock your wallet to use all the features of
            ENS.
          </Point>
        </NoAccountExplanation>
      </NoAccountContainer>
    )
  }
}

export default NoAccountsModal

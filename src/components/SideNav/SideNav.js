import React, { useState, useContext } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'

import NetworkInformation from '../NetworkInformation/NetworkInformation'
import useNetworkInfo from '../NetworkInformation/useNetworkInfo'
import Heart from '../Icons/Heart'
import File from '../Icons/File'
import SpeechBubble from '../Icons/SpeechBubble'

import mq from 'mediaQuery'
import { Link, withRouter } from 'react-router-dom'
import { setupENS } from '@ensdomains/ui'
import LoginWithEthereum from '@enslogin/login-with-ethereum'
import GlobalState from '../../globalState'

const Select = styled('select')`
  width: 150px;
  background-color: 'white',
  text-transform: 'uppercase',
  font-weight: '700',
  font-size: '12px',
  color: '#2B2B2B',
  letterSpacing: '0.5px'
`

const SideNavContainer = styled('nav')`
  display: ${p => (p.isMenuOpen ? 'block' : 'none')};
  position: fixed;
  z-index: 10000000;
  left: 0;
  top: 50px;
  height: auto;
  background: #121d46;
  width: 100%;
  margin-top: -10px;
  ${mq.medium`
    padding: 0;
    left: 35px;
    top: 100px;
    margin-top: 50px;
    height: auto;
    background: transparent;
    width: 165px;
    display: block;
  `}

  ul {
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
  }
`

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 200;
  font-size: 22px;
  color: ${p => (p.active ? '#5284FF' : '#C7D3E3')};
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  ${mq.medium`
    justify-content: start;
    border-bottom: 0;
  `}

  &:visited {
    color: #c7d3e3;
  }

  span {
    transition: 0.2s;
    margin-left: 15px;
    color: ${p => (p.active ? '#5284FF' : '#C7D3E3')};
  }

  &:hover {
    span {
      color: #5284ff;
    }
    path {
      fill: #5284ff;
    }
    g {
      fill: #5284ff;
    }
  }
`

function SideNav({ match, isMenuOpen, toggleMenu }) {
  const { switchNetwork, currentNetwork } = useContext(GlobalState)
  const { url } = match
  const { t } = useTranslation()
  const {
    accounts,
    network,
    networkId,
    loading,
    error,
    refetch
  } = useNetworkInfo()
  const [targetNetwork, setTargetNetwork] = useState(network)
  const config = {
    _infura: {
      key: 'xxx'
    },
    provider: {
      resolutionNetwork: 'ropsten',
      network: network === 'main' ? 'mainnet' : 'ropsten'
    }
  }
  const handleConnect = async web3 => {
    // web3.autoRefreshOnNetworkChange = false
    let {
      network: { name: networkName }
    } = await setupENS({
      customProvider: web3,
      reloadOnAccountsChange: true,
      enforceReload: true
    })
    switchNetwork(networkName)
    refetch()
  }

  const handleDisconnect = async () => {
    let res = await setupENS({
      reloadOnAccountsChange: true,
      enforceReadOnly: true
    })
    switchNetwork('mainnet')
    refetch()
  }

  return (
    <SideNavContainer isMenuOpen={isMenuOpen}>
      <NetworkInformation />
      <ul data-testid="sitenav">
        <LoginWithEthereum
          config={config}
          connect={handleConnect}
          disconnect={handleDisconnect}
          noInjected={true}
          networks={[
            { name: 'mainnet' },
            { name: 'ropsten' },
            { name: 'rinkeby' }
          ]}
        />
        {/* <button onClick={handleDisconnect}> Disconnect</button> */}
        {accounts && accounts.length > 0 ? (
          <li>
            <NavLink
              onClick={toggleMenu}
              active={url === '/address/' + accounts[0]}
              to={'/address/' + accounts[0]}
            >
              <File active={url === '/address/' + accounts[0]} />
              <span>{t('c.mynames')}</span>
            </NavLink>
          </li>
        ) : null}
        <li>
          <NavLink
            onClick={toggleMenu}
            active={url === '/favourites'}
            to="/favourites"
          >
            <Heart active={url === '/favourites'} />
            <span>{t('c.favourites')}</span>
          </NavLink>
        </li>
        <li>
          <NavLink onClick={toggleMenu} active={url === '/about'} to="/about">
            <SpeechBubble active={url === '/about'} />
            <span>{t('c.about')}</span>
          </NavLink>
        </li>
      </ul>
    </SideNavContainer>
  )
}
export default withRouter(SideNav)

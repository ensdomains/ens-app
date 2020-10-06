import React, { useCallback, useContext, useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import GlobalState from '../../globalState'
import { Web3Provider, getDefaultProvider } from '@ethersproject/providers'

import NetworkInformation from '../NetworkInformation/NetworkInformation'
import useNetworkInfo from '../NetworkInformation/useNetworkInfo'
import Heart from '../Icons/Heart'
import File from '../Icons/File'
import { abougPageURL } from '../../utils/utils'

import mq from 'mediaQuery'
import { Link, withRouter } from 'react-router-dom'
import { setupENS } from '@ensdomains/ui'
import LoginWithEthereum from '@enslogin/login-with-ethereum'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import DefaultButton from '../Forms/Button'

const Button = styled(DefaultButton)``

const config = {
  provider: {
    network: 'ropsten'
  }
}

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

const ThirdPartyLink = styled('a')`
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
  const { url } = match
  const { t } = useTranslation()
  const { accounts, network, loading, error, refetch } = useNetworkInfo()

  const context = useContext(GlobalState)
  let [networkSwitched, setNetworkSwitched] = useState(null)
  let [provider, setProvider] = useState()

  console.log('***GlobalState', { context, networkSwitched })
  console.log('** SideNav', { config, accounts })
  let [showOriginBannerFlag, setShowOriginBannerFlag] = useState(true)
  const handleConnect = async web3 => {
    web3.autoRefreshOnNetworkChange = false
    console.log('*** handleConnect1', web3)
    let s = await setupENS({
      customProvider: web3,
      reloadOnAccountsChange: true
    })
    // This is not firing
    web3.on('accountsChanged', accounts =>
      console.log('*** accountsChanged', { accounts })
    )
    // This is not firing
    web3.on('networkChanged', network =>
      console.log('*** networkChanged', { network })
    )
    console.log('*** handleConnect2', s)
    console.log('*** refetch')
    refetch()
    setNetworkSwitched(new Date())
  }

  const handleDisconnect = async () => {
    console.log('*** handleDisconnect1')
    let res = await setupENS({
      reloadOnAccountsChange: true,
      enforceReadOnly: true
    })
    setNetworkSwitched(new Date())
    refetch()
    console.log('*** handleDisconnect2', { res })
  }

  const INFURA_ID = 'INVALID_INFURA_KEY'

  // Web3Modal also supports many other wallets.
  // You can see other options at https://github.com/Web3Modal/web3modal
  const web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: INFURA_ID
        }
      }
    }
  })

  const logoutOfWeb3Modal = async function() {
    await web3Modal.clearCachedProvider()
    window.location.reload()
  }

  function WalletButton({ provider, loadWeb3Modal }) {
    return (
      <Button
        onClick={() => {
          if (!provider) {
            loadWeb3Modal()
          } else {
            logoutOfWeb3Modal()
          }
        }}
      >
        {!provider ? 'Connect Wallet' : 'Disconnect Wallet'}
      </Button>
    )
  }

  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect()
    const _provider = new Web3Provider(newProvider)
    setProvider(_provider)
  }, [])

  return (
    <SideNavContainer isMenuOpen={isMenuOpen}>
      <NetworkInformation
        accounts={accounts}
        network={network}
        loading={loading}
        error={error}
      />
      <ul data-testid="sitenav">
        <li>
          <LoginWithEthereum
            config={config}
            connect={handleConnect}
            disconnect={handleDisconnect}
            startVisible={false}
            noInjected={true}
            // networks     = { [{'name':'goerli'}, {'name':'ropsten'}, {'name':'rinkeby'}] }
          />
        </li>
        <li>
          <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} />
        </li>
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
          <ThirdPartyLink href={abougPageURL()}>
            <span>{t('c.about')}</span>
          </ThirdPartyLink>
        </li>
      </ul>
    </SideNavContainer>
  )
}
export default withRouter(SideNav)

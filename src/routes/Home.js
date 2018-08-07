import React, { Fragment } from 'react'
import styled from 'react-emotion'

import Container from '../components/Container'
import SearchDefault from '../components/SearchName/Search'
import NoAccounts from '../components/NoAccounts'
import bg from '../assets/heroBG.jpg'
import DefaultLogo from '../components/Logo'
import NetworkInfoQuery from '../components/NetworkInformation/NetworkInfoQuery'

const Hero = styled('section')`
  background: url(${bg});
  height: 500px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SearchContainer = styled('div')`
  margin: 0 auto 0;
  display: flex;
`

const Search = styled(SearchDefault)`
  min-width: 700px;
  &:before {
    left: 20px;
  }

  input {
    border-radius: 6px 0 0 6px;
    padding-left: 55px;
  }

  button {
    border-radius: 0 6px 6px 0;
  }
`

const Logo = styled(DefaultLogo)`
  padding-top: 20px;
  position: absolute;
  left: 0;
  top: 0;
`

const NetworkStatus = styled('div')`
  position: absolute;
  top: 20px;
  right: 40px;
  color: white;
  font-weight: 200;
  text-transform: capitalize;
`

export default props => (
  <Fragment>
    <Hero>
      <Logo color="#ffffff" />
      <NetworkInfoQuery>
        {({ accounts, network }) =>
          accounts.length > 0 && network ? (
            <NetworkStatus>{network} network</NetworkStatus>
          ) : (
            <NoAccounts />
          )
        }
      </NetworkInfoQuery>
      <SearchContainer>
        <Search />
      </SearchContainer>
    </Hero>

    <h2>What it is</h2>
    <p>
      The Ethereum Name Service is a distributed, open and extensible naming
      system based on the Ethereum blockchain. ENS eliminates the need to copy
      or type long addresses.
    </p>
    <h2>How it works</h2>
    <p>
      The ENS App is a Graphical User Interface for non-technical users. It
      allows you to search any name, manage their addresses or resources it
      points to and create subdomains for each name.
    </p>
  </Fragment>
)

import React, { Fragment } from 'react'
import styled from 'react-emotion'

import SearchDefault from '../components/SearchName/Search'
import NoAccounts from '../components/NoAccounts'
import bg from '../assets/heroBG.jpg'
import DefaultLogo from '../components/Logo'
import NetworkInfoQuery from '../components/NetworkInformation/NetworkInfoQuery'
import Button from '../components/Forms/Button'
import SearchIcon from '../components/HomePage/SearchIcon'
import Loader from '../components/Loader'
import SpeechBubbleDefault from '../components/Icons/SpeechBubble'
import QuestionMarkDefault from '../components/Icons/QuestionMark'

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

const Explanation = styled('div')`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 50px;
`

const H2 = styled('h2')`
  font-size: 30px;
  font-weight: 500;
`

const Section = styled('section')`
  display: flex;
  justify-content: center;
  align-items: center;
`

const WhatItIs = styled(Section)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Inner = styled('div')`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 350px;
`
const NameAnimation = styled(Section)``

const SpeechBubble = styled(SpeechBubbleDefault)`
  transform: scale(1.18);
  margin-right: 10px;
`

const QuestionMark = styled(QuestionMarkDefault)`
  transform: scale(1.18);
  margin-right: 10px;
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
    <Loader />
    <Explanation>
      <WhatItIs>
        <Inner>
          <H2>
            <SpeechBubble color="#2B2B2B" scale={1.18} />What it is
          </H2>
          <p>
            The Ethereum Name Service is a distributed, open and extensible
            naming system based on the Ethereum blockchain. ENS eliminates the
            need to copy or type long addresses.
          </p>
          <Button type="primary">Learn more</Button>
        </Inner>
      </WhatItIs>
      <NameAnimation>alice.eth</NameAnimation>
      <Section>
        <SearchIcon />
        Search Icon
      </Section>
      <Section>
        <Inner>
          <H2>
            <QuestionMark color="#2B2B2B" />How it works
          </H2>
          <p>
            The ENS App is a Graphical User Interface for non-technical users.
            It allows you to search any name, manage their addresses or
            resources it points to and create subdomains for each name.
          </p>
          <Button type="primary">Learn more</Button>
        </Inner>
      </Section>
    </Explanation>
  </Fragment>
)

import React, { Fragment } from 'react'
import styled from 'react-emotion'
import { Spring } from 'react-spring'

import SearchDefault from '../components/SearchName/Search'
import NoAccountsDefault from '../components/NoAccounts'
import bg from '../assets/heroBG.jpg'
import NetworkInfoQuery from '../components/NetworkInformation/NetworkInfoQuery'
import Button from '../components/Forms/Button'
import SpeechBubbleDefault from '../components/Icons/SpeechBubble'
import QuestionMarkDefault from '../components/Icons/QuestionMark'
import mq from '../mediaQuery'

import favourite from '../components/HomePage/images/favourite.svg'
import manage from '../components/HomePage/images/manage.svg'
import search from '../components/HomePage/images/search.svg'
import tag from '../components/HomePage/images/tag.svg'
import Alice from '../components/HomePage/Alice'

import ENSLogo from '../components/HomePage/images/ENSLogo.svg'

const Hero = styled('section')`
  background: url(${bg});
  height: 600px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const NoAccounts = styled(NoAccountsDefault)`
  position: absolute;
  top: 20px;
  right: 40px;
`

const SearchContainer = styled('div')`
  margin: 0 auto 0;
  display: flex;
  flex-direction: column;
  width: 60%;

  > h2 {
    color: white;
    font-size: 38px;
    font-weight: 100;
    margin-bottom: 10px;
  }

  > h3 {
    color: white;
    font-weight: 100;
    font-size: 24px;
    margin-top: 0;
  }
`

const Search = styled(SearchDefault)`
  min-width: 780px;

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

const NetworkStatus = styled('div')`
  position: absolute;
  top: 20px;
  right: 40px;
  color: white;
  font-weight: 200;
  text-transform: capitalize;

  &:before {
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translate(-5px, -50%);
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }
`

const Explanation = styled('div')`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 0;
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

const WhatItIs = styled(Section)``

const HowItWorks = styled(Section)`
  background: #f0f6fa;
  z-index: 100;
`

const Inner = styled('div')`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 350px;

  > p {
    font-weight: 300;
    font-size: 20px;
    margin-bottom: 1.5em;
  }
`
const NameAnimation = styled(Section)`
  display: block;
  height: 100%;
`

const SpeechBubble = styled(SpeechBubbleDefault)`
  transform: scale(1.18);
  margin-right: 10px;
`

const QuestionMark = styled(QuestionMarkDefault)`
  transform: scale(1.18);
  margin-right: 10px;
`

const IconsSection = styled(Section)`
  background: #fff;
  padding: 70px;
`

const Icons = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 50px;

  ${mq.medium`
    grid-gap: 50px;
  `};
`

const IconContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    margin: 0;
    margin-top: 20px;
  }
`

const LogoLarge = styled('img')`
  width: 223px;
  margin: 0 auto 50px;
`

const Icon = ({ src, text }) => (
  <IconContainer>
    <img src={src} alt="ENS Logo" />
    <p>{text}</p>
  </IconContainer>
)

export default props => (
  <Fragment>
    <Hero>
      <NetworkInfoQuery noLoader={true}>
        {({ accounts, network }) =>
          accounts.length > 0 && network ? (
            <NetworkStatus>{network} network</NetworkStatus>
          ) : (
            <NoAccounts />
          )
        }
      </NetworkInfoQuery>
      {/* <Logo color="#ffffff" /> */}

      <SearchContainer>
        <Spring
          from={{
            opacity: 0,
            scale: 0
          }}
          to={{ opacity: 1, scale: 1 }}
          config={{ duration: 400 }}
        >
          {({ opacity, scale, height }) => (
            <Fragment>
              <LogoLarge
                style={{
                  opacity,
                  transform: `scale(${scale})`
                }}
                src={ENSLogo}
              />
              <Search />
            </Fragment>
          )}
        </Spring>
      </SearchContainer>
    </Hero>
    <Explanation>
      <WhatItIs>
        <Inner>
          <H2>
            <SpeechBubble color="#2B2B2B" scale={1.18} />
            What it is
          </H2>
          <p>
            The Ethereum Name Service is a distributed, open and extensible
            naming system based on the Ethereum blockchain. ENS eliminates the
            need to copy or type long addresses.
          </p>
          <Button type="primary">Learn more</Button>
        </Inner>
      </WhatItIs>
      <NameAnimation>
        <Alice />
      </NameAnimation>
      <IconsSection>
        <Icons>
          <Icon src={search} text="Search for names" />
          <Icon src={favourite} text="Save favourite names" />
          <Icon src={tag} text="Bid for names" />
          <Icon src={manage} text="Manage names" />
        </Icons>
      </IconsSection>
      <HowItWorks>
        <Inner>
          <H2>
            <QuestionMark color="#2B2B2B" />
            How it works
          </H2>
          <p>
            The ENS App is a Graphical User Interface for non-technical users.
            It allows you to search any name, manage their addresses or
            resources it points to and create subdomains for each name.
          </p>
          <Button type="primary">Learn more</Button>
        </Inner>
      </HowItWorks>
    </Explanation>
  </Fragment>
)

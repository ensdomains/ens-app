import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { Spring } from 'react-spring'

import mq from 'mediaQuery'

import SearchDefault from '../components/SearchName/Search'
import NoAccountsDefault from '../components/NoAccounts/NoAccountsModal'
import bg from '../assets/heroBG.jpg'
import NetworkInfoQuery from '../components/NetworkInformation/NetworkInfoQuery'
import { ExternalButtonLink, ButtonLink } from '../components/Forms/Button'
import TextBubbleDefault from '../components/Icons/TextBubble'
import QuestionMarkDefault from '../components/Icons/QuestionMark'
import HowToUseDefault from '../components/HowToUse/HowToUse'
import Alice from '../components/HomePage/Alice'
import ENSLogo from '../components/HomePage/images/ENSLogo.svg'
import { ReactComponent as DefaultPermanentRegistrarIcon } from '../components/Icons/PermanentRegistrar.svg'

const Favourites = styled('div')`
  position: absolute;
  right: 40px;
  top: 20px;
  a {
    font-weight: 300;
    color: white;
  }
`

const HowToUse = styled(HowToUseDefault)`
  padding: 70px;
`

const Hero = styled('section')`
  background: url(${bg});
  background-size: cover;
  padding: 60px 20px 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ${mq.medium`
    padding: 0 20px 0;
    height: 600px;
  `}
`

const NoAccounts = styled(NoAccountsDefault)`
  position: absolute;
  top: 20px;
  left: 20px;
  ${mq.small`
    left: 40px;
  `}
`

const SearchContainer = styled('div')`
  margin: 0 auto 0;
  display: flex;
  flex-direction: column;
  min-width: 100%;
  ${mq.medium`
    min-width: 60%;
  `}
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
  min-width: 90%;
  ${mq.medium`
    min-width: 780px;
  `}

  input {
    width: 100%;
    border-radius: 6px;
    ${mq.medium`
      border-radius: 6px 0 0 6px;
      font-size: 28px;
    `}
  }

  button {
    border-radius: 0 6px 6px 0;
  }
`

const NetworkStatus = styled('div')`
  position: absolute;
  top: 20px;
  left: 30px;
  color: white;
  font-weight: 200;
  text-transform: capitalize;
  ${mq.medium`
    left: 40px;
  `}

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

  grid-template-columns: 1fr;
  grid-template-rows: auto;
  ${mq.medium`
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  `}
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

const WhatItIs = styled(Section)`
  padding: 40px 20px 80px;
  p {
    font-size: 18px;
  }
`

const HowItWorks = styled(Section)`
  background: #f0f6fa;
  z-index: 100;
  padding: 40px 20px 80px;
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

const TextBubble = styled(TextBubbleDefault)`
  margin-right: 10px;
`

const QuestionMark = styled(QuestionMarkDefault)`
  transform: scale(1.18);
  margin-right: 10px;
`

const LogoLarge = styled('img')`
  width: 50%;
  margin: 0 auto 0;
  ${mq.medium`
    width: 223px;
  `}
`

const PermanentRegistrarLogo = styled('h1')`
  font-family: Overpass;
  font-weight: 800;
  font-size: 18px;
  text-transform: uppercase;
  color: #4258d3;
  letter-spacing: 1.8px;
  text-align: right;
  line-height: 24px;
  margin-top: 10px;
  margin-bottom: 50px;
  text-align: center;
`

const PermanentRegistrar = styled('div')`
  background-image: linear-gradient(24deg, #52e5ff 0%, #513eff 100%);
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PermanentRegistrarIcon = styled(DefaultPermanentRegistrarIcon)`
  margin-left: 15px;
`

const PermanentRegistrarTitle = styled('h2')`
  font-family: Overpass;
  font-weight: 500;
  font-size: 22px;
  color: #ffffff;
  text-align: center;
  line-height: 38px;
  max-width: 500px;
  padding: 0 20px;

  ${mq.medium`
    font-size: 30px;
  `}
`

export default props => (
  <Fragment>
    <Hero>
      <NetworkInfoQuery noLoader={true}>
        {({ accounts, network }) =>
          accounts.length > 0 && network ? (
            <NetworkStatus>{network} network</NetworkStatus>
          ) : (
            <NoAccounts textColour={'white'} />
          )
        }
      </NetworkInfoQuery>
      <Favourites>
        <Link to="/favourites">Favourites</Link>
      </Favourites>

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
              <PermanentRegistrarLogo
                style={{
                  opacity,
                  transform: `scale(${scale})`
                }}
              >
                Permanent Registrar
              </PermanentRegistrarLogo>
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
            <TextBubble color="#2B2B2B" />
            What it is
          </H2>
          <p>
            The Ethereum Name Service is a distributed, open and extensible
            naming system based on the Ethereum blockchain. ENS eliminates the
            need to copy or type long addresses.
          </p>
          <ButtonLink type="primary" to="/about">
            Learn more
          </ButtonLink>
        </Inner>
      </WhatItIs>
      <NameAnimation>
        <Alice />
      </NameAnimation>
      <HowToUse />
      <HowItWorks>
        <Inner>
          <H2>
            <QuestionMark color="#2B2B2B" />
            How to use ENS
          </H2>
          <p>
            The ENS App is a Graphical User Interface for non-technical users.
            It allows you to search any name, manage their addresses or
            resources it points to and create subdomains for each name.
          </p>
          <ButtonLink type="primary" to="/about">
            Learn more
          </ButtonLink>
        </Inner>
      </HowItWorks>
    </Explanation>
    <PermanentRegistrar>
      <PermanentRegistrarIcon />
      <PermanentRegistrarTitle>
        Learn about the Permanent Registrar and the migration process.
      </PermanentRegistrarTitle>
      <ExternalButtonLink
        type="hollow-white"
        href="https://docs.ens.domains/permanent-registrar-faq"
      >
        Learn more
      </ExternalButtonLink>
    </PermanentRegistrar>
  </Fragment>
)

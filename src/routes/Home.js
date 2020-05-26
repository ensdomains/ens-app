import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import warning from '../assets/whiteWarning.svg'

import mq from 'mediaQuery'

import SearchDefault from '../components/SearchName/Search'
import NoAccountsDefault from '../components/NoAccounts/NoAccountsModal'
import bg from '../assets/heroBG.jpg'
import useNetworkInfo from '../components/NetworkInformation/useNetworkInfo'
import { ExternalButtonLink, ButtonLink } from '../components/Forms/Button'
import TextBubbleDefault from '../components/Icons/TextBubble'
import QuestionMarkDefault from '../components/Icons/QuestionMark'
import HowToUseDefault from '../components/HowToUse/HowToUse'
import Alice from '../components/HomePage/Alice'
import ENSLogo from '../components/HomePage/images/ENSLogo.svg'
import { ReactComponent as DefaultPermanentRegistrarIcon } from '../components/Icons/PermanentRegistrar.svg'

const HeroTop = styled('div')`
  display: grid;
  padding: 20px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  grid-template-columns: 1fr;
  ${mq.small`
     grid-template-columns: 1fr 1fr;
  `}
`

const NoAccounts = styled(NoAccountsDefault)`
  ${mq.small`
    left: 40px;
  `}
`

const NetworkStatus = styled('div')`
  color: white;
  font-weight: 200;
  text-transform: capitalize;
  display: none;
  ${mq.small`
    display: block;
  `}
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

const Nav = styled('div')`
  display: flex;
  justify-content: center;
  ${mq.small`
    justify-content: flex-end;
  `}
  a {
    font-weight: 300;
    color: white;
  }
`

const NavLink = styled(Link)`
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
`

const Announcement = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #5284ff;
  padding: 0 10px;
  border-bottom: #5284ff solid 3px;
  h3 {
    color: white;
    font-weight: 400;
    text-align: center;
    padding: 0 20px;
    margin-bottom: 10px;
  }
  p {
    text-align: center;
    color: white;
    margin-top: 0;
  }
  a {
    color: white;
    text-decoration: underline;
  }
`

const PreviousUpdates = styled('div')`
  display: flex;
  justify-content: center;
  background: #5284ff;
  border-bottom: #5284ff solid 3px;
  h3 {
    color: white;
    font-weight: 400;
    text-align: center;
    padding: 0 20px;
  }
  a {
    color: white;
    text-decoration: underline;
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
    border-radius: 0px;
    ${mq.medium`
      border-radius: 6px 0 0 6px;
      font-size: 28px;
    `}
  }

  button {
    border-radius: 0 6px 6px 0;
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

const LogoLarge = styled(motion.img)`
  width: 50%;
  margin: 0 auto 0;
  ${mq.medium`
    width: 223px;
  `}
`

const PermanentRegistrarLogo = styled(motion.h1)`
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

export default ({ match }) => {
  const { url } = match
  const { t } = useTranslation()

  const animation = {
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: {
      opacity: 1,
      scale: 1
    }
  }

  const { accounts, network, loading } = useNetworkInfo()
  return (
    <>
      <Hero>
        <HeroTop>
          {loading ? null : accounts.length > 0 && network ? (
            <NetworkStatus>
              {network} {t('c.network')}
            </NetworkStatus>
          ) : (
            <NoAccounts textColour={'white'} />
          )}
          <Nav>
            {accounts?.length > 0 && (
              <NavLink
                active={url === '/address/' + accounts[0]}
                to={'/address/' + accounts[0]}
              >
                {t('c.mynames')}
              </NavLink>
            )}
            <NavLink to="/favourites">{t('c.favourites')}</NavLink>
            <NavLink to="/about">{t('c.about')}</NavLink>
          </Nav>
        </HeroTop>
        <SearchContainer>
          <>
            <LogoLarge
              initial={animation.initial}
              animate={animation.animate}
              src={ENSLogo}
            />
            <PermanentRegistrarLogo
              initial={animation.initial}
              animate={animation.animate}
            >
              {t('c.permanentregistrar')}
            </PermanentRegistrarLogo>
            <Search />
          </>
        </SearchContainer>
      </Hero>
      <Announcement>
        <h3>
          <img src={warning} alt="warning" />
          &nbsp; {t('home.announcements.renew.title')}
        </h3>
        <p>
          {t('home.announcements.renew.body.0')}
          {accounts?.length > 0 ? (
            <Link to={'/address/' + accounts[0]}>
              {' '}
              {t('home.announcements.renew.body.1')}
            </Link>
          ) : (
            'address page'
          )}{' '}
          {t('home.announcements.renew.body.2')}
        </p>
      </Announcement>
      <Explanation>
        <WhatItIs>
          <Inner>
            <H2>
              <TextBubble color="#2B2B2B" />
              {t('home.whatisens.title')}
            </H2>
            <p>{t('home.whatisens.body')}</p>
            <ButtonLink type="primary" to="/about">
              {t('c.learnmore')}
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
              {t('home.howtouse.title')}
            </H2>
            <p>{t('home.howtouse.body')}</p>
            <ButtonLink type="primary" to="/about">
              {t('c.learnmore')}
            </ButtonLink>
          </Inner>
        </HowItWorks>
      </Explanation>
      <PreviousUpdates>
        <h3>
          <img src={warning} alt="warning" />
          &nbsp; {t('home.announcements.migrationOver')}&nbsp;
          <a href="https://medium.com/the-ethereum-name-service/ens-registry-migration-is-over-now-what-a-few-things-to-know-fb05f921872a">
            ({t('c.learnmore')})
          </a>
        </h3>
      </PreviousUpdates>
      <PermanentRegistrar>
        <PermanentRegistrarIcon />
        <PermanentRegistrarTitle>
          {t('home.permanentRegistrar.title')}
        </PermanentRegistrarTitle>
        <ExternalButtonLink
          type="hollow-white"
          href="https://docs.ens.domains/permanent-registrar-faq"
        >
          {t('c.learnmore')}
        </ExternalButtonLink>
      </PermanentRegistrar>
    </>
  )
}

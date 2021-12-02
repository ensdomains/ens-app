import React from 'react'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'

import { theme, H1, H5 } from '@ensdomains/thorin'

import SearchDefault from '../components/SearchName/Search'
import NoAccountsDefault from '../components/NoAccounts/NoAccountsModal'
import bg from '../assets/heroBG.jpg'
import ENSLogo from '../components/HomePage/images/ENSLogo.svg'
import { aboutPageURL } from '../utils/utils'
import { connectProvider, disconnectProvider } from '../utils/providerUtils'
import { gql } from '@apollo/client'
import {
  MainPageBannerContainer,
  DAOBannerContent
} from '../components/Banner/DAOBanner'

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

const NoAccounts = styled(NoAccountsDefault)``

const Network = styled('div')`
  margin-bottom: 5px;
`
const Name = styled('span')`
  margin-left: 5px;
  text-transform: none;
  display: inline-block;
  width: 100px;
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

const ExternalLink = styled('a')`
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
`

const Hero = styled('section')`
  background: url(${bg});
  background-size: cover;
  padding: 60px 20px 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  ${mq.medium`
    padding: 0 20px 0;
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

const ReadOnly = styled('span')`
  margin-left: 1em;
`

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

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

// export default ({ match }) => {
//   const { url } = match
//   const { t } = useTranslation()
//
//   const {
//     data: { accounts }
//   } = useQuery(GET_ACCOUNT)
//
//   const {
//     data: { network, displayName, isReadOnly, isSafeApp }
//   } = useQuery(HOME_DATA, {
//     variables: { address: accounts?.[0] }
//   })
//
//   return (
//     <Hero>
//       <HeroTop>
//         <NetworkStatus>
//           <Network>
//             {`${network} ${t('c.network')}`}
//             {isReadOnly && <ReadOnly>({t('c.readonly')})</ReadOnly>}
//             {!isReadOnly && displayName && (
//               <Name data-testid="display-name">({displayName})</Name>
//             )}
//           </Network>
//           {!isSafeApp && (
//             <NoAccounts
//               onClick={isReadOnly ? connectProvider : disconnectProvider}
//               buttonText={isReadOnly ? t('c.connect') : t('c.disconnect')}
//             />
//           )}
//         </NetworkStatus>
//         <Nav>
//           {accounts?.length > 0 && !isReadOnly && (
//             <NavLink
//               active={url === '/address/' + accounts[0]}
//               to={'/address/' + accounts[0]}
//             >
//               {t('c.mynames')}
//             </NavLink>
//           )}
//           <NavLink to="/favourites">{t('c.favourites')}</NavLink>
//           <ExternalLink href={aboutPageURL()}>{t('c.about')}</ExternalLink>
//         </Nav>
//         <MainPageBannerContainer>
//           <DAOBannerContent />
//         </MainPageBannerContainer>
//       </HeroTop>
//       <SearchContainer>
//         <>
//           <LogoLarge
//             initial={animation.initial}
//             animate={animation.animate}
//             src={ENSLogo}
//             alt="ENS logo"
//           />
//           <PermanentRegistrarLogo
//             initial={animation.initial}
//             animate={animation.animate}
//           />
//           <Search />
//         </>
//       </SearchContainer>
//     </Hero>
//   )
// }

const HomeContainer = styled.div`
  text-align: center;
  max-width: 580px;
`

export default () => {
  return (
    <HomeContainer>
      <H1 blue>Your web3 username</H1>
      <H5>
        It’s your identity across web3, one name for all your crypto addresses,
        and your decentralized website.
      </H5>
    </HomeContainer>
  )
}

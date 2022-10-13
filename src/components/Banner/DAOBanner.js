import { gql, useQuery } from '@apollo/client'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'
import { useTranslation } from 'react-i18next'
import Arrow from './images/Arrow.svg'
import ENSIcon from './images/ENSIcon.svg'

const SHOULD_DELEGATE_QUERY = gql`
  query shouldDelegateQuery @client {
    shouldDelegate
  }
`

const LogoSmall = styled.img`
  width: 48px;
  height: 48px;
  padding: 10px;
  border-radius: 50%;
  margin: auto;
  display: block;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.06);
  background: linear-gradient(
    330.4deg,
    #44bcf0 4.54%,
    #7298f8 59.2%,
    #a099ff 148.85%
  );

  ${({ $daoGradient }) =>
    $daoGradient &&
    `
    background: linear-gradient(323.31deg, #DE82FF -15.56%, #7F6AFF 108.43%);
  `}
`

const Link = styled(`a`)`
  display: block;
`

const ArrowSmall = styled.img`
  margin: auto;
  display: block;
  width: 22px;
  color: #b3b3b3;
`

const BannerTitle = styled(`div`)`
  color: #0e0e0e;
  letter-spacing: -0.01em;
  font-weight: bold;
  font-size: 18px;
`

const BannerContent = styled(`div`)`
  color: #787878;
  font-size: 18px;
  letter-spacing: -0.01em;
  font-weight: 500;
  font-size: 15px;
`

const BannerContentWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
`

export const MainPageBannerContainer = styled(`div`)`
  position: absolute;
  top: 50px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 14px;
  max-width: 90%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 0;
  a {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 73px 1fr 50px;
  }
  ${mq.medium`
    width: 700px;
  `}
`

export const NonMainPageBannerContainer = styled(`div`)`
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 14px;
  display: grid;
  padding: 15px 0px;
  a {
    display: grid;
    grid-template-columns: 73px 1fr 50px;
  }
  ${mq.medium`
    height: 78px;
  `}
`

export const NonMainPageBannerContainerWithMarginBottom = styled(
  NonMainPageBannerContainer
)`
  margin-bottom: 20px;
`

export function DAOBannerContent() {
  const { t } = useTranslation()
  const {
    data: { shouldDelegate }
  } = useQuery(SHOULD_DELEGATE_QUERY)

  return (
    <Link
      target="_blank"
      rel="noreferrer"
      href={
        shouldDelegate
          ? 'https://claim.ens.domains/delegate-ranking'
          : 'https://constitution.ens.domains/'
      }
    >
      <LogoSmall $daoGradient={!shouldDelegate} src={ENSIcon} alt="ENS logo" />
      <BannerContentWrapper>
        <BannerTitle>
          {shouldDelegate
            ? t('banners.undelegatedTokens.title')
            : t('banners.constitution.title')}
        </BannerTitle>
        <BannerContent>
          {shouldDelegate
            ? t('banners.undelegatedTokens.description')
            : t('banners.constitution.description')}
        </BannerContent>
      </BannerContentWrapper>
      <ArrowSmall src={Arrow} alt="Arrow right icon" />
    </Link>
  )
}

import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'

import { useDocumentTitle, useScrollTo } from '../components/hooks'

import mq, { useMediaMin } from 'mediaQuery'

import { H2 as DefaultH2 } from '../components/Typography/Basic'
import Map from '../components/Icons/Map'
import ReverseArrows from '../components/Icons/ReverseArrows'
import subdomainExplainer from '../assets/subdomainExplainer.png'
import subdomainExplainerMobile from '../assets/subdomainExplainer-mobile.png'
import nameToAddress from '../assets/nameToAddress.png'
import addressToName from '../assets/addressToName.png'
import HowToUseDefault from '../components/HowToUse/HowToUse'
import Registry from '../components/Icons/Registry'
import Registrar from '../components/Icons/Registrar'

const HowToUse = styled(HowToUseDefault)`
  .icons {
    max-width: 600px;
  }
`

const AboutContainer = styled('div')`
  background: #ffffff;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 60px;

  &:before {
    content: '';
    display: block;
    top: 0;
    left: 0;
    height: 6px;
    width: 100%;
    background: #5e74aa;
    background: linear-gradient(to right, #52c5ff 0%, #5284ff 100%);
  }
`

const ElevatorPitch = styled('div')`
  padding: 70px 0;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(181, 177, 177, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 70px;
`

const H2 = styled(DefaultH2)`
  font-weight: 300;
  font-size: 20px;
  color: #2b2b2b;
  text-align: center;
  line-height: 37px;
  max-width: 530px;
  padding: 0 20px 0;

  ${mq.small`
    font-size: 24px;
  `}
`

const SubTitle = styled('h3')`
  text-transform: uppercase;
  font-weight: 600;
  font-size: 16px;
  color: #2b2b2b;
  letter-spacing: 0.1px;
  text-align: center;
  margin: 0 0 30px;
`

const AboutENSImgContainer = styled('div')`
  height: 20px;
  display: flex;
`

const Card = styled('div')`
  background: #ffffff;
  box-shadow: 3px 3px 18px 0 #eff2f5;
  border-radius: 6px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  margin-bottom: 20px;
  ${mq.medium`
    margin-bottom: 0;
  `}
`

const CardImg = styled('img')`
  max-width: 100%;
`

const CardText = styled('p')`
  font-size: 16px;
  font-weight: 200;
  line-height: 28px;
  text-align: left;
`

const AboutENSText = styled(CardText)``

const AboutENSContainer = styled('section')`
  display: flex;
  align-items: center;
  max-width: ${45 + 320 + 320}px;
  margin: 0 auto 80px;
  flex-direction: column;
  ${mq.medium`
    justify-content: space-between;
    flex-direction: row;
  `}
`
const CardTitle = styled('h3')`
  font-weight: 400;
  margin-bottom: 0;
`

const SubDomainContent = styled('div')`
  display: flex;
  flex-direction: column;
`

const SubDomainExplainerWrapper = styled('div')`
  max-width: 565px;
  margin: 0 auto 0;
  padding: 0 20px;
  order: 2;
  ${mq.medium`
    order: 1
  `};
`

const SubDomainExplainer = styled('img')`
  max-width: 100%;
  margin: 0 auto 40px;
  display: block;
`

const SubDomainText = styled('p')`
  font-weight: 300;
  font-size: 20px;
  color: #2b2b2b;
  text-align: center;
  line-height: 32px;
  max-width: 540px;
  margin: 0 auto 80px;
  padding: 0 20px;
  order: 1;
  ${mq.medium`
    order: 2
  `};
`

const UnderTheSurface = styled('section')`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  justify-items: center;
  max-width: 685px;
  grid-gap: 45px;
  margin: 0 auto 100px;
  padding: 0 20px;

  ${mq.medium`
    align-items: start;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1.5fr;
  `};
`

const UnderTheSurfaceImgContainer = styled('div')`
  height: 30px;
  display: flex;
`

function About() {
  const { t } = useTranslation()
  useDocumentTitle('About ENS')
  useScrollTo(0)
  const mediumBP = useMediaMin('medium')
  return (
    <AboutContainer>
      <ElevatorPitch>
        <H2>{t('about.elevatorpitch')}</H2>
        <div>
          <a href="https://ens.domains">{t('c.learnmore')}(English Only)</a>
        </div>
      </ElevatorPitch>
      <SubTitle>{t('about.subtitles.0')}</SubTitle>
      <AboutENSContainer>
        <Card>
          <AboutENSImgContainer>
            <Map />
          </AboutENSImgContainer>
          <AboutENSText>{t('about.card1')}</AboutENSText>
        </Card>
        <Card>
          <AboutENSImgContainer>
            <ReverseArrows />
          </AboutENSImgContainer>
          <AboutENSText>{t('about.card2')}</AboutENSText>
        </Card>
      </AboutENSContainer>
      <SubTitle>{t('about.subtitles.1')}</SubTitle>
      <SubDomainContent>
        <SubDomainExplainerWrapper>
          {mediumBP ? (
            <SubDomainExplainer src={subdomainExplainer} />
          ) : (
            <SubDomainExplainer src={subdomainExplainerMobile} />
          )}
        </SubDomainExplainerWrapper>

        <SubDomainText>{t('about.subdomainText')}</SubDomainText>
      </SubDomainContent>

      <SubTitle>{t('about.subtitles.2')}</SubTitle>
      <HowToUse text={true} />
      <SubTitle>{t('about.subtitles.3')}</SubTitle>
      <UnderTheSurface>
        <Card>
          <UnderTheSurfaceImgContainer>
            <Registrar />
          </UnderTheSurfaceImgContainer>
          <CardTitle>{t('about.underTheSurface.titles.0')}</CardTitle>
          <CardText>{t('about.underTheSurface.registrar')}</CardText>
        </Card>
        <Card>
          <UnderTheSurfaceImgContainer>
            <Registry />
          </UnderTheSurfaceImgContainer>
          <CardTitle>{t('about.underTheSurface.titles.1')}</CardTitle>
          <CardText>{t('about.underTheSurface.registry')}</CardText>
        </Card>
        <Card>
          <CardImg src={nameToAddress} />
          <CardTitle>{t('about.underTheSurface.titles.2')}</CardTitle>
          <CardText>{t('about.underTheSurface.resolver')}</CardText>
        </Card>
        <Card>
          <CardImg src={addressToName} />
          <CardTitle>{t('about.underTheSurface.titles.3')}</CardTitle>
          <CardText>{t('about.underTheSurface.reverse')}</CardText>
        </Card>
      </UnderTheSurface>
    </AboutContainer>
  )
}

export default About

import React from 'react'
import styled from '@emotion/styled'

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
  useDocumentTitle('About ENS')
  useScrollTo(0)
  const mediumBP = useMediaMin('medium')
  return (
    <AboutContainer>
      <ElevatorPitch>
        <H2>
          The Ethereum Name Service is a distributed, open and extensible naming
          system based on the Ethereum blockchain. ENS eliminates the need to
          copy or type long addresses.
        </H2>
      </ElevatorPitch>

      <SubTitle>About ENS</SubTitle>
      <AboutENSContainer>
        <Card>
          <AboutENSImgContainer>
            <Map />
          </AboutENSImgContainer>
          <AboutENSText>
            Map simple names like ‘alice.eth’ to Ethereum addresses, content
            hashes, and metadata.
          </AboutENSText>
        </Card>
        <Card>
          <AboutENSImgContainer>
            <ReverseArrows />
          </AboutENSImgContainer>
          <AboutENSText>
            Improve usability of Dapps by returning human readable names instead
            of long hashes through 'reverse resolution'
          </AboutENSText>
        </Card>
      </AboutENSContainer>
      <SubTitle>TLDs &amp; SUBDOMAINS</SubTitle>
      <SubDomainContent>
        <SubDomainExplainerWrapper>
          {mediumBP ? (
            <SubDomainExplainer src={subdomainExplainer} />
          ) : (
            <SubDomainExplainer src={subdomainExplainerMobile} />
          )}
        </SubDomainExplainerWrapper>

        <SubDomainText>
          Like DNS, ENS operates on a system of dot-separated hierarchial names
          called domains, with the owner of a domain having full control over
          the allocation of subdomains.
        </SubDomainText>
      </SubDomainContent>

      <SubTitle>HOW TO USE ENS</SubTitle>
      <HowToUse text={true} />
      <SubTitle>Under the surface</SubTitle>
      <UnderTheSurface>
        <Card>
          <UnderTheSurfaceImgContainer>
            <Registrar />
          </UnderTheSurfaceImgContainer>
          <CardTitle>The Registrar</CardTitle>
          <CardText>
            The Registrar is the Smart Contract that allows you to buy or
            register a domain. Today it uses an auction process, but in the
            future you will have an instant buy option.
          </CardText>
        </Card>
        <Card>
          <UnderTheSurfaceImgContainer>
            <Registry />
          </UnderTheSurfaceImgContainer>
          <CardTitle>The Registry</CardTitle>
          <CardText>
            The Registry is a Smart Contract that contains a list of all domains
            and subdomains, storing for each two pieces of information: the
            owner of the name and the Resolver.
          </CardText>
        </Card>
        <Card>
          <CardImg src={nameToAddress} />
          <CardTitle>Resolvers</CardTitle>
          <CardText>
            Resolvers are Smart Contracts responsible for the process of
            translating names into addresses, or other types of hashes and
            resources.
          </CardText>
        </Card>
        <Card>
          <CardImg src={addressToName} />
          <CardTitle>Reverse Resolution</CardTitle>
          <CardText>
            The Resolver can optionally perform the opposite functionality of
            "Reverse Resolving": translating an address into an associated name.
          </CardText>
        </Card>
      </UnderTheSurface>
    </AboutContainer>
  )
}

export default About

import React from 'react'
import styled from 'react-emotion'
import { H2 as DefaultH2 } from '../components/Typography/Basic'
import Map from '../components/Icons/Map'
import ReverseArrows from '../components/Icons/ReverseArrows'
import subdomainExplainer from '../assets/subdomainExplainer.png'
import nameToAddress from '../assets/nameToAddress.png'
import addressToName from '../assets/addressToName.png'
import HowToUseDefault from '../components/HowToUse/HowToUse'

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
  font-size: 24px;
  color: #2b2b2b;
  text-align: center;
  line-height: 37px;
  max-width: 530px;
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
const Card = styled('div')`
  background: #ffffff;
  box-shadow: 3px 3px 18px 0 #eff2f5;
  border-radius: 6px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  padding: 30px;
`

const AboutENSContainer = styled('section')`
  display: flex;
  justify-content: space-between;
  width: ${45 + 320 + 320}px;
  margin: 0 auto 80px;
`
const CardTitle = styled('h3')``

const SubDomainExplainer = styled('img')`
  max-width: 565px;
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
  margin: 0 auto 0;
`

const About = ({}) => (
  <AboutContainer>
    <ElevatorPitch>
      <H2>
        The Ethereum Name Service is a distributed, open and extensible naming
        system based on the Ethereum blockchain. ENS eliminates the need to copy
        or type long addresses.
      </H2>
    </ElevatorPitch>

    <SubTitle>About ENS</SubTitle>
    <AboutENSContainer>
      <Card>
        <Map />
        Map simple names like ‘alice.eth’ to Ethereum addresses, content hashes,
        and metadata.
      </Card>
      <Card>
        <ReverseArrows />
        Improve usability of Dapps by returning human readable names instead of
        long hashes through 'reverse resolution'
      </Card>
    </AboutENSContainer>
    <SubTitle>TLD’S &amp; SUBDOMAINS</SubTitle>
    <SubDomainExplainer src={subdomainExplainer} />
    <SubDomainText>
      Like DNS, ENS operates on a system of dot-separated hierarchial names
      called domains, with the owner of a domain having full control over the
      allocation of subdomains.
    </SubDomainText>

    <SubTitle>HOW TO USE ENS</SubTitle>
    <HowToUse text={true} />
    <SubTitle>Under the surface</SubTitle>
    <Card>
      <CardTitle>The Registrar</CardTitle>
    </Card>
    <Card>
      <CardTitle>The Registry</CardTitle>
    </Card>
    <Card>
      <img src={nameToAddress} />
      <CardTitle>The Resolver</CardTitle>
    </Card>
    <Card>
      <img src={addressToName} />
      <CardTitle>The Registry</CardTitle>
    </Card>
  </AboutContainer>
)

export default About

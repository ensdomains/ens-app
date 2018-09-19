import React from 'react'
import styled from 'react-emotion'
import { H2 } from '../components/Typography/Basic'
import Map from '../components/Icons/Map'
import ReverseArrows from '../components/Icons/ReverseArrows'
import subdomainExplainer from '../assets/subdomainExplainer.png'

const AboutContainer = styled('div')``
const ElevatorPitch = styled('div')`
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(181, 177, 177, 0.5);
`

const SubTitle = styled('h3')``
const SmallCard = styled('div')``
const SubDomainExplainer = styled('img')`
  max-width: 565px;
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
    <SmallCard>
      <Map />
      Map simple names like ‘alice.eth’ to Ethereum addresses, content hashes,
      and metadata.
    </SmallCard>
    <SmallCard>
      <ReverseArrows />
      Improve usability of Dapps by returning human readable names instead of
      long hashes through 'reverse resolution'
    </SmallCard>
    <SubTitle>TLD’S &amp; SUBDOMAINS</SubTitle>
    <p>
      Like DNS, ENS operates on a system of dot-separated hierarchial names
      called domains, with the owner of a domain having full control over the
      allocation of subdomains.
    </p>
    <SubDomainExplainer src={subdomainExplainer} />
    <SubTitle>HOW TO USE ENS</SubTitle>
  </AboutContainer>
)

export default About

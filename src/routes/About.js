import React from 'react'
import styled from 'react-emotion'
import { H2 } from '../components/Typography/Basic'

const AboutContainer = styled('div')``
const ElevatorPitch = styled('div')`
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(181, 177, 177, 0.5);
`

const SubTitle = styled('h3')``
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
    <SubTitle>TLD’S &amp; SUBDOMAINS</SubTitle>
  </AboutContainer>
)

export default About

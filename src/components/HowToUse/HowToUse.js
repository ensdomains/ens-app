import React from 'react'
import styled from 'react-emotion'
import favourite from '../HomePage/images/favourite.svg'
import manage from '../HomePage/images/manage.svg'
import search from '../HomePage/images/search.svg'
import tag from '../HomePage/images/tag.svg'

import mq from '../../mediaQuery'

const HowToUseContainer = styled('div')``

const IconsSection = styled('section')`
  display: flex;
  justify-content: center;
  align-items: center;
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

  h3 {
    margin: 0;
    margin-top: 20px;
  }
`

const Icon = ({ src, title, text }) => (
  <IconContainer>
    <img src={src} alt="ENS Logo" />
    <h3>{title}</h3>
    {text.length > 0 && <p>{text}</p>}
  </IconContainer>
)

const HowToUse = ({ text }) => (
  <HowToUseContainer>
    <IconsSection>
      <Icons>
        <Icon src={search} title="Search for names" />
        <Icon src={favourite} title="Save favourite names" />
        <Icon src={tag} title="Bid for names" />
        <Icon src={manage} title="Manage names" />
      </Icons>
    </IconsSection>
  </HowToUseContainer>
)

export default HowToUse

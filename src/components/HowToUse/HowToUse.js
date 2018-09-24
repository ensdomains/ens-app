import React from 'react'
import styled from 'react-emotion'
import favourite from '../HomePage/images/favourite.svg'
import manage from '../HomePage/images/manage.svg'
import search from '../HomePage/images/search.svg'
import tag from '../HomePage/images/tag.svg'

import mq from '../../mediaQuery'

const HowToUseContainer = styled('section')`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 70px;
  padding-top: 0;
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
  justify-content: start;
  align-items: center;

  img {
    height: ;
  }

  h3 {
    margin: 0;
    margin-top: 20px;
  }

  p {
    font-size: 16px;
    font-weight: 300;
    text-align: center;
  }
`

const ImgContainer = styled('div')`
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const H3 = styled('h3')`
  font-size: 20px;
  font-weight: 400;
`

const Icon = ({ src, title, text }) => (
  <IconContainer>
    <ImgContainer>
      <img src={src} alt="ENS Logo" />
    </ImgContainer>
    <H3>{title}</H3>
    {text.length > 0 && <p>{text}</p>}
  </IconContainer>
)

const HowToUse = ({ text = false, className }) => (
  <HowToUseContainer className={className}>
    <Icons className="icons">
      <Icon
        src={search}
        title="Search for names"
        text={
          text
            ? 'Find domains and subdomains that you can register or learn more about.'
            : ''
        }
      />
      <Icon
        src={favourite}
        title="Save favourite names"
        text={
          text
            ? 'Keep track of domains and subdomains that you own or that you want to follow.'
            : ''
        }
      />
      <Icon
        src={tag}
        title="Bid for names"
        text={
          text
            ? 'Open auctions, or participate in auctions opened by others, to secure the name you want.'
            : ''
        }
      />
      <Icon
        src={manage}
        title="Manage names"
        text={
          text
            ? 'Point domains to your ethereum addresses, transfer ownership to other people and more.'
            : ''
        }
      />
    </Icons>
  </HowToUseContainer>
)

export default HowToUse

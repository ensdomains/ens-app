import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'

import favourite from '../HomePage/images/favourite.svg'
import manage from '../HomePage/images/manage.svg'
import search from '../HomePage/images/search.svg'
import register from '../HomePage/images/register.svg'

import mq from 'mediaQuery'

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
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 50px;

  ${mq.medium`
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 50px;
  `};
`

const IconContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  ${mq.medium`
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 50px;
  `};

  img {
    height: ;
  }

  h3 {
    margin: 0;
    margin-top: 20px;
    text-align: center;
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
      <img src={src} alt="ANS Logo" />
    </ImgContainer>
    <H3>{title}</H3>
    {text.length > 0 && <p>{text}</p>}
  </IconContainer>
)

const HowToUse = ({ text = false, className }) => {
  const { t } = useTranslation()
  return (
    <HowToUseContainer className={className}>
      <Icons className="icons">
        <Icon
          src={search}
          title={t('howtouse.search.title')}
          text={text ? t('howtouse.search.text') : ''}
        />
        <Icon
          src={favourite}
          title={t('howtouse.favourite.title')}
          text={text ? t('howtouse.favourite.text') : ''}
        />
        <Icon
          src={register}
          title={t('howtouse.register.title')}
          text={text ? t('howtouse.register.text') : ''}
        />
        <Icon
          src={manage}
          title={t('howtouse.manage.title')}
          text={text ? t('howtouse.manage.text') : ''}
        />
      </Icons>
    </HowToUseContainer>
  )
}

export default HowToUse

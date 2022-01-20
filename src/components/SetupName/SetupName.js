import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import mq from '../../mediaQuery'
import { ReactComponent as BookPen } from '../Icons/BookPen.svg'
import DefaultRotatingSmallCaret from '../Icons/RotatingSmallCaret'

const SetupNameContainer = styled('div')`
  background: #f0f6fa;
  padding: 20px 40px;
  margin-bottom: 40px;
`

const Header = styled('header')`
  display: flex;
  position: relative;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`

const RotatingSmallCaret = styled(DefaultRotatingSmallCaret)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%)
    ${p => (p.rotated ? 'rotate(0)' : 'rotate(-90deg)')};
`

const H2 = styled('h2')`
  margin: 0;
  margin-left: 10px;
  font-size: 20px;
  font-weight: 300;
`

const Content = styled('div')`
  display: ${p => (p.open ? 'flex' : 'none')};
  flex-direction: column;
  ${mq.large`
    flex-direction: row;
  `}
`

const Block = styled('section')`
  margin-right: 40px;
  &:last-child {
    margin-right: 0;
  }
  h3 {
    font-size: 18px;
    font-weight: 300;
  }

  p {
    font-size: 14px;
    font-weight: 300;
  }
`

function SetupName({ initialState = false }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(initialState)
  const [initial, setInitial] = useState(initialState)
  // Change the open state when resolver is set/unset
  if (initial !== initialState) {
    setInitial(initialState)
    setOpen(initialState)
  }

  const toggleOpen = () => setOpen(!open)
  return (
    <SetupNameContainer>
      <Header onClick={toggleOpen}>
        <BookPen />
        <H2>{t('singleName.learnmore.title')}</H2>
        <RotatingSmallCaret rotated={open ? 1 : 0} />
      </Header>
      <Content open={open}>
        <Block>
          <h3>{t('singleName.learnmore.step1.title')}</h3>
          <p>{t('singleName.learnmore.step1.text')}</p>
        </Block>
        <Block>
          <h3>{t('singleName.learnmore.step2.title')}</h3>
          <p>{t('singleName.learnmore.step2.text')}</p>
        </Block>
        <Block>
          <h3>{t('singleName.learnmore.step3.title')}</h3>
          <p>{t('singleName.learnmore.step3.text')}</p>
        </Block>
      </Content>{' '}
    </SetupNameContainer>
  )
}

export default SetupName

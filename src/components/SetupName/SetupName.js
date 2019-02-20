import React, { useState } from 'react'
import styled from 'react-emotion'
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
  const [open, setOpen] = useState(initialState)
  const toggleOpen = () => setOpen(!open)
  return (
    <SetupNameContainer>
      <Header onClick={toggleOpen}>
        <BookPen />
        <H2>Learn how to manage your name.</H2>
        <RotatingSmallCaret rotated={open} />
      </Header>
      <Content open={open}>
        <Block>
          <h3>1. Set Resolver</h3>
          <p>
            The Resolver is a Smart Contract responsible for the process of
            translating names into addresses. In the Resolver area click ‘Set’.
            Then click the ‘use public resolver’ link, and ‘save’ to launch the
            transaction.
          </p>
        </Block>
        <Block>
          <h3>2. Set Address</h3>
          <p>
            Once you have set the Resolver, you can then add records by clicking
            the ‘+’ in the ‘records’ field. Adding your ethereum address will
            allow you to point your wallet to your name in the next step.
          </p>
        </Block>
        <Block>
          <h3>3. Set Reverse Record</h3>
          <p>
            Once you set your address, you will see a message saying the reverse
            pointer is not set. Click the arrow in the field to expand, then
            click the button ‘point’. This will translate your address into your
            new name.
          </p>
        </Block>
      </Content>{' '}
    </SetupNameContainer>
  )
}

export default SetupName

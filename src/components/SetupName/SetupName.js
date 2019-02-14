import React, { useState } from 'react'
import styled from 'react-emotion'
import { ReactComponent as BookPen } from '../Icons/BookPen.svg'
import RotatingSmallCaret from '../Icons/RotatingSmallCaret'

const SetupNameContainer = styled('div')`
  background: #f0f6fa;
  padding: 20px 40px;
`

const Header = styled('header')`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`

const H2 = styled('h2')`
  margin-left: 10px;
  font-size: 20px;
  font-weight: 300;
`

const Content = styled('div')`
  display: ${p => (p.open ? 'block' : 'none')};
`

const Block = styled('section')``

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
          <h3>Set Resolver</h3>
          <p>
            The Resolver is a Smart Contract responsible for the process of
            translating names into addresses. In the Resolver area click ‘Set’.
            Then click the ‘use public resolver’ link, and ‘save’ to launch the
            transaction.
          </p>
        </Block>
        <Block>
          <h3>Set Address</h3>
          <p>
            Once you have set the Resolver, you can then add records by clicking
            the ‘+’ in the ‘records’ field. Adding your ethereum address will
            allow you to point your wallet to your name in the next step.
          </p>
        </Block>
        <Block>
          <h3>Set Reverse Record</h3>
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

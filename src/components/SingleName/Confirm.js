import React from 'react'
import styled from '@emotion/styled'
import Button from '../Forms/Button'
import warning from '../../assets/warning.svg'
import write from '../../assets/Write.svg'

import mq from 'mediaQuery'

const ConfirmContainer = styled('div')`
  &:before {
    display: none;
    background: url(${write});
    content: '';
    height: 43px;
    width: 42px;
    float: right;
    ${mq.large`
      display: block;
      flex-direction: row;
    `}
  }
`
const Content = styled('div')`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

const Title = styled('h3')`
  margin: 0 0 0 1.5em;
  font-size: 16px;
  font-weight: 300;
  ${mq.small`
    font-size: 22px;
  `}
  &:before {
    background: url(${warning});
    content: '';
    height: 17px;
    width: 19px;
    position: absolute;
    margin-left: -1.4em;
    margin-top: 0.2em;
  }
`

const SubTitle = styled('p')`
  margin: 0;
  margin-bottom: 1em;
  font-size: 12px;
  ${mq.small`
    font-size: 14px;
  `}
`

const Values = styled('ul')`
  list-style-type: none;
  padding: 4px 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Value = styled('li')`
  font-size: 12px;
  font-weight: bold;
  font-family: Overpass Mono;
  display: flex;
  justify-content: space-between;
  color: ${({ old }) => (old ? 'grey' : 'black')};
  margin-bottom: 10px;

  ${mq.large`
    justify-content: flex-start;
  `}

  span:first-child {
    width: 75px;
  }
`

const Buttons = styled('div')`
  height: 100%;
  margin-top: 1em;
  display: flex;
`

const Action = styled(Button)``

const Cancel = styled(Button)`
  margin-right: 20px;
`

const Confirm = ({
  mutation,
  cancel,
  disabled,
  className,
  value,
  newValue,
  explanation
}) => (
  <ConfirmContainer className={className}>
    <Title>Are you sure you want to do this?</Title>
    <SubTitle>This action will modify the state of the blockchain.</SubTitle>
    <Content>
      {explanation ? <p>{explanation}</p> : ''}
      {value || newValue ? (
        <Values>
          <Value old={true}>
            <span>PREVIOUS</span>
            <span>{value}</span>
          </Value>
          <Value>
            <span>FUTURE</span>
            <span>{newValue}</span>
          </Value>
        </Values>
      ) : (
        ''
      )}
      <Buttons>
        <Cancel type="hollow" onClick={cancel}>
          Cancel
        </Cancel>
        {disabled ? (
          <Action type="disabled">Confirm</Action>
        ) : (
          <Action
            onClick={() => {
              mutation()
              cancel()
            }}
          >
            Confirm
          </Action>
        )}
      </Buttons>
    </Content>
  </ConfirmContainer>
)

export default Confirm

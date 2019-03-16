import React from 'react'
import styled from '@emotion/styled'
import Button from '../Forms/Button'
import warning from '../../assets/warning.svg'
import write  from '../../assets/Write.svg'

const ConfirmContainer = styled('div')`
  &:before {
    background: url(${write});
    content: '';
    height: 43px;
    width: 42px;
    float: right;
  }
`
const Content = styled('div')`
  display: flex;
  justify-content: space-between;
`

const Title = styled('h3')`
  margin:0 0 0 1.5em;
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
  margin:0;
  margin-bottom:1em;
`

const Values = styled('ul')`
  list-style-type: none;
  width:30em;
  padding: 4px 0;
  margin:0;
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
`

const Buttons = styled('div')`
  height:100%;
  margin-top:1em;
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
  newValue
}) => (
  <ConfirmContainer className={className}>
    <Title>Are you sure you want to do this?</Title>
    <SubTitle>This action will modify the state of the blockchain.</SubTitle>
    <Content>
      <Values>
        <Value old={true} ><span>PREVIOUS</span><span>{value}</span></Value>
        <Value><span>FUTURE</span><span>{newValue}</span></Value>
      </Values>
      <Buttons>
        <Cancel type="hollow" onClick={cancel}>
        Cancel
        </Cancel>
        {disabled ? (
        <Action type="disabled">Confirm</Action>
        ) : (
        <Action onClick={()=>{
          mutation()
          cancel()
        }}>Confirm</Action>
        )}
      </Buttons>
    </Content>
  </ConfirmContainer>
)

export default Confirm

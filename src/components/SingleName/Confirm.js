import React from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'

const ConfirmContainer = styled('div')`
`

const Action = styled(Button)``

const Cancel = styled(Button)`
  margin-right: 20px;
`

const Confirm = ({
  name,
  mutation,
  mutationButton,
  cancel,
  disabled,
  className
}) => (
  <ConfirmContainer className={className}>
    <h2>Are you sure you want to do this?</h2>
    <p>This action will modify the state of the blockchain.</p>
    <ul>
      <li>PREVIOUS: foo</li>
      <li>FUTURE: bar</li>    
    </ul>
    <Cancel type="hollow" onClick={cancel}>
      Cancel
    </Cancel>
    {disabled ? (
      <Action type="disabled">{mutationButton ? mutationButton : 'Save'}</Action>
    ) : (
      <Action onClick={mutation}>{mutationButton ? mutationButton : 'Save'}</Action>
    )}
  </ConfirmContainer>
)

export default Confirm

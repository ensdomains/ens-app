import React from 'react'
import styled from 'react-emotion'
import Button from '../Forms/Button'

const SaveCancelContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const Save = styled(Button)``

const Cancel = styled(Button)`
  margin-right: 20px;
`

const SaveCancel = ({ mutation, mutationButton, stopEditing, disabled }) => (
  <SaveCancelContainer>
    <Cancel type="hollow" onClick={stopEditing}>
      Cancel
    </Cancel>
    {disabled ? (
      <Save type="disabled">{mutationButton ? mutationButton : 'Save'}</Save>
    ) : (
      <Save onClick={mutation}>{mutationButton ? mutationButton : 'Save'}</Save>
    )}
  </SaveCancelContainer>
)

export default SaveCancel

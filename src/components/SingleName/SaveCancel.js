import React, { useContext } from 'react'
import styled from '@emotion/styled'
import Button from '../Forms/Button'
import GlobalState from '../../globalState'

const SaveCancelContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const Save = styled(Button)``

const Cancel = styled(Button)`
  margin-right: 20px;
`

const Warning = styled('div')`
  color:#F5A623;
  align-self:center;
  margin-right: 20px;
`

const ActionButton = ({
  disabled,
  mutation,
  mutationButton,
  value,
  newValue,
  confirm,
  isValid
}) => {
  const { toggleModal } = useContext(GlobalState)
  // Ignore isValid == undefined
  if (disabled || isValid === false) {
    return (
      <Save data-testid="save" type="disabled">{mutationButton ? mutationButton : 'Save'}</Save>
    )
  }
  if (confirm) {
    return (
      <Button
        onClick={() =>
          toggleModal({
            name: 'confirm',
            mutation: mutation,
            mutationButton: mutationButton,
            value: value,
            newValue: newValue,
            cancel: () => {
              toggleModal({ name: 'confirm' })
            }
          })
        }
      >
        {mutationButton}
      </Button>
    )
  }
  return (
    <Save onClick={mutation}>{mutationButton ? mutationButton : 'Save'}</Save>
  )
}

const SaveCancel = ({
  mutation,
  mutationButton,
  stopEditing,
  disabled,
  className,
  value,
  newValue,
  confirm,
  warningMessage,
  isValid = true
}) => (
  <SaveCancelContainer className={className}>
    {
      warningMessage ? (
        <Warning>{warningMessage}</Warning>
      ): null
    }
    <Cancel data-testid="cancel" type="hollow" onClick={stopEditing}>
      Cancel
    </Cancel>
    <ActionButton
      disabled={disabled}
      mutation={mutation}
      mutationButton={mutationButton}
      value={value}
      newValue={newValue}
      confirm={confirm}
      isValid={isValid}
    />
  </SaveCancelContainer>
)

export default SaveCancel

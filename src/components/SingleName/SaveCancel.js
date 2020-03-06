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

const Switch = styled(Button)`
  margin-right: 20px;
`

const Warning = styled('div')`
  color: #f5a623;
  align-self: center;
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
      <Save data-testid="action" type="disabled">
        {mutationButton ? mutationButton : 'Save'}
      </Save>
    )
  }
  if (confirm) {
    return (
      <Button
        data-testid="action"
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
    <Save data-testid="action" onClick={mutation}>
      {mutationButton ? mutationButton : 'Save'}
    </Save>
  )
}

export const SaveCancel = ({
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
    {warningMessage ? <Warning>{warningMessage}</Warning> : null}
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
      data-testid="action"
    />
  </SaveCancelContainer>
)

export const SaveCancelSwitch = ({
  mutation,
  mutationButton,
  stopUpdating,
  stopAuthorizing,
  disabled,
  className,
  value,
  newValue,
  confirm,
  warningMessage,
  isValid = true
}) => (
  <SaveCancelContainer className={className}>
    {warningMessage ? <Warning>{warningMessage}</Warning> : null}
    <Switch data-testid="switch" type="hollow" onClick={stopAuthorizing}>
      Switch Providers
    </Switch>
    <Cancel data-testid="cancel" type="hollow" onClick={stopUpdating}>
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
      data-testid="action"
    />
  </SaveCancelContainer>
)

export default SaveCancel

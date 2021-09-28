import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import Button from '../Forms/Button'
import GlobalState from '../../globalState'
import mq from 'mediaQuery'
import Modal from '../Modal/Modal'
import Confirm from '../SingleName/Confirm'
import ExpiryNotificationModal from '../ExpiryNotification/ExpiryNotificationModal'

const SaveCancelSwitchContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  felx-wrap: wrap;
  align-items: flex-start;
  ${mq.small`
    flex-direction: row;
  `}
`
const SaveCancelContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-self: flex-end;
  ${mq.small`
    justify-content: flex-end;
  `}
`

const Save = styled(Button)``

const Cancel = styled(Button)`
  margin-right: 20px;
`

const Switch = styled(Button)`
  margin-bottom: 5px;
  ${mq.small`
    margin-right: 20px;
    margin-bottom: 0px; 
  `}
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
  extraDataComponent,
  confirm,
  isValid
}) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  // Ignore isValid == undefined
  if (disabled || isValid === false) {
    return (
      <Save data-testid="action" type="disabled">
        {mutationButton ? mutationButton : t('c.save')}
      </Save>
    )
  }
  if (confirm) {
    return (
      <>
        <Button data-testid="action" onClick={handleOpenModal}>
          {mutationButton}
        </Button>
        {isModalOpen && (
          <Modal closeModal={handleCloseModal}>
            <Confirm
              {...{
                name: 'confirm',
                mutation: mutation,
                mutationButton: mutationButton,
                value: value,
                newValue: newValue,
                extraDataComponent,
                cancel: handleCloseModal
              }}
            />
          </Modal>
        )}
      </>
    )
  }
  return (
    <Save data-testid="action" onClick={mutation}>
      {mutationButton ? mutationButton : 'Save'}
    </Save>
  )
}

export const SaveCancel = React.forwardRef(
  (
    {
      mutation,
      mutationButton,
      stopEditing,
      disabled,
      className,
      value,
      newValue,
      confirm,
      warningMessage,
      extraDataComponent,
      isValid = true
    },
    ref
  ) => {
    const { t } = useTranslation()
    return (
      <SaveCancelContainer className={className} ref={ref}>
        {warningMessage ? <Warning>{warningMessage}</Warning> : null}
        <Cancel data-testid="cancel" type="hollow" onClick={stopEditing}>
          {t('c.cancel')}
        </Cancel>
        <ActionButton
          disabled={disabled}
          mutation={mutation}
          mutationButton={mutationButton}
          value={value}
          newValue={newValue}
          confirm={confirm}
          isValid={isValid}
          extraDataComponent={extraDataComponent}
          data-testid="action"
        />
      </SaveCancelContainer>
    )
  }
)

export const SaveCancelSwitch = ({
  mutation,
  mutationButton,
  startUploading,
  stopUploading,
  stopAuthorizing,
  disabled,
  className,
  value,
  newValue,
  confirm,
  warningMessage,
  isValid = true
}) => (
  <SaveCancelSwitchContainer className={className}>
    {warningMessage ? <Warning>{warningMessage}</Warning> : null}
    {newValue !== '' && (
      <Switch data-testid="reset" type="hollow" onClick={startUploading}>
        New Upload
      </Switch>
    )}
    <Switch data-testid="switch" type="hollow" onClick={stopAuthorizing}>
      Logout
    </Switch>
    <Switch data-testid="cancel" type="hollow" onClick={stopUploading}>
      Cancel
    </Switch>
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
  </SaveCancelSwitchContainer>
)

export default SaveCancel

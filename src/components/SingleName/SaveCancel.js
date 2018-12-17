import React from 'react'
import styled from 'react-emotion'
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


const ActionButton = ({
  disabled,
  mutation,
  mutationButton,
  value,
  newValue,
  confirm,
  isValid
}) =>{
  // Ignore isValid == undefined
  if(disabled || isValid == false){
    return (<Save type="disabled">{mutationButton ? mutationButton : 'Save'}</Save>)
  }
  if(confirm){
    return (
      <GlobalState.Consumer>
        {({ toggleModal }) => (
          <Button
            onClick={() => toggleModal({
              name: 'confirm',
              mutation:mutation,
              mutationButton:mutationButton,
              value:value,
              newValue:newValue,
              cancel:() => { toggleModal({name:'confirm'})  }
            })}
          >
            {mutationButton}
          </Button>
        )}
      </GlobalState.Consumer>  
    )
  }
  return (<Save onClick={mutation}>{mutationButton ? mutationButton : 'Save'}</Save>)
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
  isValid
}) => (
  <SaveCancelContainer className={className}>
    <Cancel type="hollow" onClick={stopEditing}>
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
    ></ActionButton>
  </SaveCancelContainer>
)

export default SaveCancel

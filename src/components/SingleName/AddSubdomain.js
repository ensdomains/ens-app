import React, { Component } from 'react'
import styled from 'react-emotion'

import { validateName } from '../../utils/utils'

import Button from '../Forms/Button'
import DefaultInput from '../Forms/Input'
import Editable from './Editable'
import SaveCancel from './SaveCancel'

const AddSubdomainContainer = styled('section')`
  margin-top: 30px;
`

const AddSubdomainContent = styled('div')`
  display: flex;
`

const Input = styled(DefaultInput)`
  width: 100%;
  margin-right: 20px;
`

class AddSubdomain extends Component {
  render() {
    return (
      <AddSubdomainContainer>
        <Editable>
          {({
            editing,
            startEditing,
            stopEditing,
            newValue,
            updateValue,
            startPending,
            setConfirmed,
            pending,
            confirmed
          }) => {
            const isValid = validateName(newValue)
            const isInvalid = !isValid && newValue.length > 0
            return (
              <>
                {!editing && (
                  <Button onClick={startEditing}>+ Add Subdomain</Button>
                )}
                {editing && (
                  <AddSubdomainContent>
                    <Input
                      value={newValue}
                      onChange={updateValue}
                      valid={isValid}
                      invalid={isInvalid}
                      placeholder="Type in a label for your subdomain"
                      large
                    />
                    <SaveCancel
                      stopEditing={stopEditing}
                      mutation={() => {
                        // const variables = {
                        //   name: domain.name,
                        //   [variableName ? variableName : 'address']: newValue
                        // }
                        // mutation({
                        //   variables
                        // })
                      }}
                    />
                  </AddSubdomainContent>
                )}
              </>
            )
          }}
        </Editable>
      </AddSubdomainContainer>
    )
  }
}

export default AddSubdomain

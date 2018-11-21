import React, { Component } from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'

import { isLabelValid } from '../../utils/utils'
import { CREATE_SUBDOMAIN } from '../../graphql/mutations'

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
    const { domain, refetch } = this.props
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
            const isValid = newValue.length > 0 && isLabelValid(newValue)
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
                    {isValid ? (
                      <Mutation
                        mutation={CREATE_SUBDOMAIN}
                        onCompleted={() => {
                          setConfirmed()
                          refetch()
                        }}
                      >
                        {mutation => (
                          <SaveCancel
                            stopEditing={stopEditing}
                            mutation={() => {
                              mutation({
                                variables: {
                                  name: domain.name,
                                  label: newValue
                                }
                              })
                              startPending()
                            }}
                          />
                        )}
                      </Mutation>
                    ) : (
                      <SaveCancel stopEditing={stopEditing} disabled />
                    )}
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

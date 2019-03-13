import React from 'react'
import styled from 'react-emotion'
import { Mutation } from 'react-apollo'

import { isLabelValid } from '../../utils/utils'
import { CREATE_SUBDOMAIN } from '../../graphql/mutations'
import mq from 'mediaQuery'
import { useEditable } from '../hooks'

import Button from '../Forms/Button'
import DefaultInput from '../Forms/Input'
import SaveCancel from './SaveCancel'
import PendingTx from '../PendingTx'

const AddSubdomainContainer = styled('section')`
  margin-top: 30px;
`

const AddSubdomainContent = styled('div')`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  ${mq.small`
    margin-bottom: 0;
    flex-direction: row;
  `}
`

const Input = styled(DefaultInput)`
  width: 100%;
  margin-right: 20px;
  margin-bottom: 20px;
  ${mq.small`
    margin-bottom: 0;
  `}
`

function AddSubdomain({ domain, refetch }) {
  const { state, actions } = useEditable()
  const { editing, newValue, txHash, pending, confirmed } = state

  const {
    startEditing,
    stopEditing,
    updateValue,
    startPending,
    setConfirmed
  } = actions

  const isValid = newValue.length > 0 && isLabelValid(newValue)
  const isInvalid = !isValid && newValue.length > 0

  return (
    <AddSubdomainContainer>
      <>
        {!editing ? (
          pending && !confirmed ? (
            <PendingTx
              txHash={txHash}
              setConfirmed={setConfirmed}
              onCompleted={refetch}
            />
          ) : (
            <Button onClick={startEditing}>+ Add Subdomain</Button>
          )
        ) : null}
        {editing && (
          <AddSubdomainContent>
            <Input
              value={newValue}
              onChange={e => updateValue(e.target.value)}
              valid={isValid}
              invalid={isInvalid}
              placeholder="Type in a label for your subdomain"
              large
            />
            {isValid ? (
              <Mutation
                mutation={CREATE_SUBDOMAIN}
                onCompleted={data => {
                  startPending(Object.values(data)[0])
                }}
              >
                {mutation => (
                  <SaveCancel
                    stopEditing={stopEditing}
                    isValid={isValid}
                    mutation={() => {
                      mutation({
                        variables: {
                          name: domain.name,
                          label: newValue
                        }
                      }).then(() => {
                        refetch()
                      })
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
    </AddSubdomainContainer>
  )
}

export default AddSubdomain

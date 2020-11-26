import React, { useState, useCallback } from 'react'
import _ from 'lodash'
import { useQuery } from 'react-apollo'
import styled from '@emotion/styled/macro'
import { Mutation } from 'react-apollo'
import { useTranslation, Trans } from 'react-i18next'
//import { getAddress } from 'ui-ethers5023'
import getENS from 'api/ens'

import { SET_NAME } from 'graphql/mutations'
import mq from 'mediaQuery'
import { useEditable } from './hooks'

import { GET_REVERSE_RECORD } from 'graphql/queries'
import SaveCancel from './SingleName/SaveCancel'
import PendingTx from './PendingTx'
import DefaultInput from './Forms/Input'

import { ReactComponent as DefaultCheck } from './Icons/Check.svg'
import { ReactComponent as DefaultBlueWarning } from './Icons/BlueWarning.svg'
import RotatingSmallCaret from './Icons/RotatingSmallCaret'

const Loading = styled('span')`
  color: #adbbcd;
`

const AddReverseRecordContainer = styled('div')`
  background: #f0f6fa;
  border: 1px solid #ededed;
  border-radius: 8px;
  margin: 20px 30px 20px;
  padding: 10px 15px;

  ${mq.medium`
    margin: 20px 40px 20px;
  `}
`

const SetReverseContainer = styled('div')`
  margin-top: 15px;
  padding: 10px;
`

const ErrorMessage = styled('div')`
  font-weight: 300;
  font-size: 14px;
`

const Message = styled('div')`
  font-family: Overpass Mono;
  font-weight: 700;
  font-size: 14px;
  color: #adbbcd;
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
`

const MessageContent = styled('div')`
  display: flex;
  align-items: center;
`

const IconStyles = () => `margin-right: 10px;
  flex-shrink: 0;
`

const BlueWarning = styled(DefaultBlueWarning)`
  ${IconStyles()};
`

const Check = styled(DefaultCheck)`
  ${IconStyles()};
`

const Explanation = styled('div')`
  font-family: Overpass;
  font-weight: 300;
  font-size: 14px;
  color: #2b2b2b;
  letter-spacing: 0;
  line-height: 25px;
  margin-bottom: 10px;
  max-width: 768px;
  hyphens: auto;
`

const Account = styled('div')`
  font-family: Overpass Mono;
  font-weight: 300;
  font-size: 14px;
  color: #adbbcd;
  letter-spacing: 0;
  border: 1px dashed #adbbcd;
  border-radius: 6px;
  padding: 8px 20px;
  margin-bottom: 20px;
  whitespace: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${mq.small`
    font-size: 18px;
  `}
`

const Name = styled('div')`
  font-family: Overpass Mono;
  font-weight: 300;
  font-size: 14px;
  color: #2b2b2b;
  letter-spacing: 0;
  border: 1px dashed #2b2b2b;
  border-radius: 6px;
  padding: 8px 20px;
  margin-bottom: 20px;
  ${mq.small`
    font-size: 18px;
  `}
`

const Input = styled(DefaultInput)`
  margin-bottom: 20px;
`

function AddReverseRecord({ account, name }) {
  const { t } = useTranslation()
  const { state, actions } = useEditable()
  const [newName, setNewName] = useState('')
  const [isValid, setIsValid] = useState(null)
  const [address, setAddress] = useState(null)

  const { editing, txHash, pending, confirmed } = state

  const { startEditing, stopEditing, startPending, setConfirmed } = actions
  const { data: { getReverseRecord } = {}, loading, refetch } = useQuery(
    GET_REVERSE_RECORD,
    {
      variables: {
        address: account
      }
    }
  )

  const delayedQuery = useCallback(_.debounce(q => sendQuery(q), 500), [])

  async function sendQuery(newName) {
    const ens = getENS()
    try {
      const address = await ens.getAddress(newName)
      setAddress(address)
      if (address?.toLowerCase() === account.toLowerCase()) {
        setIsValid(true)
      } else {
        setIsValid(false)
      }
    } catch (e) {
      setIsValid(false)
    }
  }

  const isInvalid = !isValid && newName.length > 0

  return (
    <AddReverseRecordContainer>
      {loading ? (
        <Loading>Loading reverse record...</Loading>
      ) : (
        <>
          <Message onClick={editing ? stopEditing : startEditing}>
            {getReverseRecord && getReverseRecord.name !== null ? (
              <MessageContent>
                <Check />
                {t('singleName.record.messages.setTo') + getReverseRecord.name}
              </MessageContent>
            ) : (
              t('singleName.record.messages.notSet')
            )}
            {pending && !confirmed && txHash ? (
              <PendingTx
                txHash={txHash}
                onConfirmed={() => {
                  setConfirmed()
                  refetch()
                }}
              />
            ) : (
              <RotatingSmallCaret rotated={editing} testid="open-reverse" />
            )}
          </Message>
          {editing && (
            <SetReverseContainer>
              <Explanation>
                <Trans i18nKey="singleName.record.messages.explanation">
                  The Reverse Resolution translates an address into a name. It
                  allows Dapps to show in their interfaces '{{ name }}' rather
                  than the long address '{{ account }}'. If you would like to
                  set up your reverse for a different account, please switch
                  accounts in your dapp browser.
                </Trans>
              </Explanation>
              <Account>{account}</Account>
              <Input
                testId="reverse-input"
                valid={isValid}
                invalid={isInvalid}
                value={newName}
                onChange={e => {
                  setNewName(e.target.value)
                  delayedQuery(e.target.value)
                }}
              />

              <Mutation
                mutation={SET_NAME}
                variables={{
                  name: newName
                }}
                onCompleted={data => {
                  startPending(Object.values(data)[0])
                }}
              >
                {mutation => (
                  <SaveCancel
                    mutation={mutation}
                    stopEditing={stopEditing}
                    isValid={isValid}
                  />
                )}
              </Mutation>
              {isInvalid && (
                <ErrorMessage>
                  Forward resolution must match your account
                </ErrorMessage>
              )}
            </SetReverseContainer>
          )}
        </>
      )}
    </AddReverseRecordContainer>
  )
}

export default AddReverseRecord

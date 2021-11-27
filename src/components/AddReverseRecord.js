import React, { useState, useEffect } from 'react'
import uniq from 'lodash/uniq'
import { useQuery, useMutation } from '@apollo/client'
import styled from '@emotion/styled/macro'
import { useTranslation, Trans } from 'react-i18next'

import { emptyAddress, hasValidReverseRecord } from '../utils/utils'

import { SET_NAME } from 'graphql/mutations'
import mq from 'mediaQuery'
import { useEditable } from './hooks'

import {
  GET_REVERSE_RECORD,
  GET_ETH_RECORD_AVAILABLE_NAMES_FROM_SUBGRAPH
} from 'graphql/queries'

import SaveCancel from './SingleName/SaveCancel'
import PendingTx from './PendingTx'

import { ReactComponent as DefaultCheck } from './Icons/Check.svg'
import RotatingSmallCaret from './Icons/RotatingSmallCaret'
import { decryptName, checkIsDecrypted } from '../api/labels'
import Select from 'react-select'
import Modal from './Modal/Modal'
import Bin from '../components/Forms/Bin'
import Gap from '../components/Utils/Gap'
import { gql } from '@apollo/client'

const Loading = styled('span')`
  color: #adbbcd;
`

const Warning = styled('div')`
  color: #f5a623;
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

const Message = styled('div')`
  font-family: Overpass Mono;
  font-weight: 700;
  font-size: 14px;
  color: ${p => (p.nameSet ? '#747f8c' : '#adbbcd')};
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    cursor: ${p => (p.pending ? 'default' : 'pointer')};
  }
`

const ReadOnlyMessage = styled(Message)`
  &:hover {
    cursor: default;
  }
`

const MessageContent = styled('div')`
  display: flex;
  align-items: center;
`

const IconStyles = () => `margin-right: 10px;
  flex-shrink: 0;
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

const EditableNotSet = styled('div')`
  color: #5384fe;
`

const ButtonsContainer = styled('div')`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
`

export const SINGLE_NAME = gql`
  query singleNameQuery @client {
    isENSReady
    networkId
  }
`

function AddReverseRecord({ account, currentAddress }) {
  const { t } = useTranslation()
  const { state, actions } = useEditable()
  const [newName, setNewName] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { editing, txHash, pending, confirmed } = state

  const { startEditing, stopEditing, startPending, setConfirmed } = actions
  let options

  const { data: { getReverseRecord } = {}, loading, refetch } = useQuery(
    GET_REVERSE_RECORD,
    {
      variables: {
        address: currentAddress
      },
      skip: !currentAddress,
      fetchPolicy: 'no-cache'
    }
  )

  const [setName] = useMutation(SET_NAME, {
    onCompleted: data => {
      if (Object.values(data)[0]) {
        startPending(Object.values(data)[0])
      }
    }
  })

  useEffect(() => {
    if (!getReverseRecord) return
    if (!hasValidReverseRecord(getReverseRecord)) {
      startEditing()
      return
    }
  }, [loading])

  const {
    data: { networkId }
  } = useQuery(SINGLE_NAME)

  console.log('networkId: ', networkId)

  const { data: { domains } = {}, refetch: refetchNames } = useQuery(
    GET_ETH_RECORD_AVAILABLE_NAMES_FROM_SUBGRAPH,
    {
      variables: {
        address: currentAddress
      },
      fetchPolicy: 'no-cache',
      context: {
        queryDeduplication: false
      }
    }
  )

  useEffect(() => {
    refetchNames()
  }, [account, currentAddress, networkId])

  const isAccountMatched =
    account &&
    currentAddress &&
    account.toLowerCase() === currentAddress.toLowerCase()

  if (domains) {
    options = uniq(
      domains
        .map(domain => {
          if (checkIsDecrypted(domain?.name)) {
            return domain?.name
          } else {
            let decrypted = decryptName(domain?.name)
            // Ignore if label is not found
            if (checkIsDecrypted(decrypted)) {
              return decrypted
            } else {
              return null
            }
          }
        })
        .filter(d => !!d)
        .sort()
    ).map(d => {
      return { value: d, label: d }
    })
  }

  function handleSelect(e) {
    if (e && e.label) {
      setNewName(e)
    } else {
      setNewName('')
    }
  }

  function ReverseRecordEditor() {
    return (
      <>
        <Message
          onClick={e =>
            editing
              ? stopEditing()
              : pending
              ? e.preventDefault()
              : startEditing()
          }
          pending={pending}
          nameSet={hasValidReverseRecord(getReverseRecord)}
        >
          {hasValidReverseRecord(getReverseRecord) ? (
            <MessageContent data-testid="editable-reverse-record-set">
              <Check />
              {t('singleName.record.messages.setTo') + getReverseRecord.name}
            </MessageContent>
          ) : (
            <EditableNotSet data-testid="editable-reverse-record-not-set">
              {t('singleName.record.messages.notSet')}
            </EditableNotSet>
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
            <RotatingSmallCaret
              rotated={editing ? 1 : 0}
              testid="open-reverse"
            />
          )}
        </Message>
        {editing && (
          <SetReverseContainer>
            <Explanation>
              <Trans i18nKey="singleName.record.messages.explanation">
                The Reverse Resolution translates an address into a name. It
                allows Dapps to show in their interfaces '
                {{
                  name:
                    (hasValidReverseRecord(getReverseRecord) &&
                      getReverseRecord.name) ||
                    'example.eth'
                }}
                ' rather than the long address '{{ account }}'. If you would
                like to set up your reverse for a different account, please
                switch accounts in your dapp browser.
              </Trans>
            </Explanation>
            {options?.length > 0 ? (
              <Select
                placeholder={t('singleName.record.messages.selectPlaceholder')}
                isClearable={true}
                value={newName}
                onChange={handleSelect}
                options={options}
              />
            ) : (
              <Warning>
                {t('singleName.record.messages.noForwardRecordAavilable')}
              </Warning>
            )}
            <Explanation>
              <p>
                <Trans i18nKey="singleName.record.messages.explanation2">
                  You can only select names you set this Ethereum Address as.
                </Trans>
              </p>
            </Explanation>
            <ButtonsContainer>
              <SaveCancel
                mutation={() => {
                  setName({ variables: { name: newName?.value } })
                }}
                stopEditing={stopEditing}
                isValid={!!newName}
              />
              {hasValidReverseRecord(getReverseRecord) && (
                <>
                  <Bin onClick={() => setIsDeleteModalOpen(true)} />
                  {isDeleteModalOpen && (
                    <Modal closeModal={() => setIsDeleteModalOpen(false)}>
                      {t('singleName.record.messages.reverseRecordRemoval')}
                      <Gap size={5} />
                      <SaveCancel
                        mutation={() => {
                          setName({ variables: { name: emptyAddress } })
                          setIsDeleteModalOpen(false)
                        }}
                        stopEditing={e => {
                          stopEditing(e)
                          setIsDeleteModalOpen(false)
                        }}
                        isValid
                      />
                    </Modal>
                  )}
                </>
              )}
            </ButtonsContainer>
          </SetReverseContainer>
        )}
      </>
    )
  }

  return (
    <AddReverseRecordContainer>
      {loading ? (
        <Loading>Loading reverse record...</Loading>
      ) : (
        <>
          {isAccountMatched ? (
            <ReverseRecordEditor />
          ) : (
            <ReadOnlyMessage>
              {hasValidReverseRecord(getReverseRecord) ? (
                <MessageContent data-testid="readonly-reverse-record-set">
                  {t('singleName.record.messages.setTo') +
                    getReverseRecord.name}
                </MessageContent>
              ) : (
                <div data-testid="readonly-reverse-record-not-set">
                  {t('singleName.record.messages.notSet')}
                </div>
              )}
            </ReadOnlyMessage>
          )}
        </>
      )}
    </AddReverseRecordContainer>
  )
}

export default AddReverseRecord

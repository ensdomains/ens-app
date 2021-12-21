import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import styled from '@emotion/styled/macro'
import { REGISTER_TESTDOMAIN } from '../../graphql/mutations'
import { useMutation } from '@apollo/client'
import Button from '../Forms/Button'
import { useEditable } from '../hooks'
import PendingTx from '../PendingTx'
import mq from 'mediaQuery'

const NameClaimTestDomainContainer = styled('div')`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${mq.medium`
    flex-direction: row-reverse;
  `};
  border-top: 1px dashed #d3d3d3;
`
const ClaimButton = styled(Button)`
  max-width: 8em;
`

const Note = styled('p')`
  color: #2829291;
  size: 14pt;
`

const Tld = styled('pre')`
  display: inline;
  background-color: #eee;
  padding: 3px;
`

function NameClaimTestDomain({ domain, refetch }) {
  const { t } = useTranslation()
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state

  const { startPending, setConfirmed } = actions
  const [mutation] = useMutation(REGISTER_TESTDOMAIN, {
    onCompleted: data => {
      startPending(Object.values(data)[0])
      refetch()
    }
  })

  return (
    <NameClaimTestDomainContainer>
      {pending && !confirmed ? (
        <PendingTx
          txHash={txHash}
          onConfirmed={() => {
            setConfirmed()
            refetch()
          }}
        />
      ) : (
        <ClaimButton
          onClick={() => {
            mutation({
              variables: {
                label: domain.label
              }
            })
          }}
        >
          {t('c.claim')}
        </ClaimButton>
      )}
      <Note>
        <Trans i18nKey="singleName.test.note">
          Note: <Tld>.test</Tld> domain allows anyone to claim an unused name
          for test purposes, which expires after 28 days
        </Trans>
      </Note>
    </NameClaimTestDomainContainer>
  )
}

export default NameClaimTestDomain

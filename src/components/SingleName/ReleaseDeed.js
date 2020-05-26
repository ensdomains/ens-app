import React from 'react'
import { useMutation } from 'react-apollo'
import { RELEASE_DEED } from 'graphql/mutations'
import styled from '@emotion/styled/macro'
import PendingTx from '../PendingTx'
import { ExternalButtonLink } from '../Forms/Button'

import { useEditable } from '../hooks'

const LinkToLearnMore = styled('a')`
  margin-right: ${props => (props.outOfSync ? '' : '2em')};
  font-size: 14px;
  letter-spacing: 0.58px;
  text-align: center;
  margin-left: auto;
  min-width: 130px;
`

const WarningBox = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 100;
  color: #2b2b2b;
  padding: 20px 35px;
  background: #f0f6fa;
  margin-bottom: 20px;
`

const WarningContent = styled('div')`
  width: calc(100% - 120px);
  padding-right: 20px;
`

const SubWarning = styled('p')`
  font-size: 14px;
  color: #2b2b2b;
  font-weight: 500;
`

const Return = styled(ExternalButtonLink)`
  flex: 2 1 auto;
`

export default function MigrationWarning({ domain, refetch }) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  const [releaseDeed] = useMutation(RELEASE_DEED, {
    variables: { label: domain.label },
    onCompleted: data => {
      startPending(Object.values(data)[0])
    }
  })
  return confirmed ? (
    <WarningBox>
      <WarningContent>Your deposit is now returned.</WarningContent>
    </WarningBox>
  ) : (
    <WarningBox>
      <WarningContent>
        Your name was automatically migrated to the new Registrar. To get your
        deposited eth back, click the ‘return’ button.
        <SubWarning>
          *To understand why your name was migrated
          <LinkToLearnMore
            href="https://medium.com/the-ethereum-name-service"
            target="_blank"
          >
            {' '}
            Learn More
          </LinkToLearnMore>
        </SubWarning>
      </WarningContent>
      {pending && !confirmed && txHash ? (
        <PendingTx
          txHash={txHash}
          onConfirmed={() => {
            setConfirmed()
          }}
        />
      ) : (
        <Return onClick={releaseDeed} type={'hollow-primary'} href="#">
          Return
        </Return>
      )}
    </WarningBox>
  )
}

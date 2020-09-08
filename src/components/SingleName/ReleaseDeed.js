import React from 'react'
import { useMutation } from 'react-apollo'
import { RELEASE_DEED } from 'graphql/mutations'
import styled from '@emotion/styled/macro'
import PendingTx from '../PendingTx'
import { ExternalButtonLink } from '../Forms/Button'
import Button from '../Forms/Button'
import { useTranslation } from 'react-i18next'
import { useEditable } from '../hooks'

const LinkToLearnMore = styled('a')`
  margin-right: ${props => (props.outOfSync ? '' : '2em')};
  font-size: 14px;
  letter-spacing: 0.58px;
  text-align: center;
  margin-left: auto;
  min-width: 130px;
`

const LinkToReclaim = styled('a')`
  margin-right: ${props => (props.outOfSync ? '' : '2em')};
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

export default function MigrationWarning({ domain, isDeedOwner }) {
  const { t } = useTranslation()
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  const [releaseDeed] = useMutation(RELEASE_DEED, {
    variables: { label: domain.label },
    onCompleted: data => {
      startPending(Object.values(data)[0])
    }
  })
  return (
    <WarningBox>
      <WarningContent>
        {t('releaseDeed.returnDeposit')}
        <LinkToReclaim href="https://reclaim.ens.domains" target="_blank">
          {' '}
          {'https://reclaim.ens.domains'}
        </LinkToReclaim>
      </WarningContent>
    </WarningBox>
  )
}

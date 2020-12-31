import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import moment from 'moment'
import { css } from 'emotion'
import { useHistory } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import { useTranslation } from 'react-i18next'
import EthVal from 'ethval'

import { trackReferral } from '../../../utils/analytics'
import { COMMIT, REGISTER } from '../../../graphql/mutations'

import Tooltip from 'components/Tooltip/Tooltip'
import PendingTx from '../../PendingTx'
import Button from '../../Forms/Button'
import AddToCalendar from '../../Calendar/RenewalCalendar'
import { ReactComponent as DefaultPencil } from '../../Icons/SmallPencil.svg'
import { ReactComponent as DefaultOrangeExclamation } from '../../Icons/OrangeExclamation.svg'
import { useAccount } from '../../QueryAccount'

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Pencil = styled(DefaultPencil)`
  margin-right: 5px;
`

const Prompt = styled('span')`
  color: #ffa600;
  margin-right: 10px;
`

const OrangeExclamation = styled(DefaultOrangeExclamation)`
  margin-right: 5px;
  height: 12px;
  width: 12px;
`

const SetReverseRecord = styled(Link)`
  margin-right: 20px;
`

function getCTA({
  step,
  incrementStep,
  secret,
  duration,
  label,
  hasSufficientBalance,
  txHash,
  setTxHash,
  setTimerRunning,
  setCommitmentTimerRunning,
  commitmentTimerRunning,
  setBlockCreatedAt,
  isAboveMinDuration,
  refetch,
  refetchIsMigrated,
  readOnly,
  price,
  history,
  t,
  ethUsdPrice,
  account
}) {
  const CTAs = {
    PRICE_DECISION: (
      <Mutation
        mutation={COMMIT}
        variables={{ label, secret, commitmentTimerRunning }}
        onCompleted={data => {
          const txHash = Object.values(data)[0]
          setTxHash(txHash)
          setCommitmentTimerRunning(true)
          incrementStep()
        }}
      >
        {mutate =>
          isAboveMinDuration && !readOnly ? (
            hasSufficientBalance ? (
              <Button data-testid="request-register-button" onClick={mutate}>
                {t('register.buttons.request')}
              </Button>
            ) : (
              <>
                <Prompt>
                  <OrangeExclamation />
                  {t('register.buttons.insufficient')}
                </Prompt>
                <Button data-testid="request-register-button" type="disabled">
                  {t('register.buttons.request')}
                </Button>
              </>
            )
          ) : readOnly ? (
            <Tooltip
              text="<p>You are not connected to a web3 browser. Please connect to a web3 browser and try again</p>"
              position="top"
              border={true}
              offset={{ left: -30, top: 10 }}
            >
              {({ tooltipElement, showTooltip, hideTooltip }) => {
                return (
                  <Button
                    data-testid="request-register-button"
                    type="disabled"
                    onMouseOver={() => {
                      showTooltip()
                    }}
                    onMouseLeave={() => {
                      hideTooltip()
                    }}
                  >
                    {t('register.buttons.request')}
                  </Button>
                )
              }}
            </Tooltip>
          ) : (
            <Button data-testid="request-register-button" type="disabled">
              {t('register.buttons.request')}
            </Button>
          )
        }
      </Mutation>
    ),
    COMMIT_SENT: <PendingTx txHash={txHash} />,
    COMMIT_CONFIRMED: (
      <Button data-testid="disabled-register-button" type="disabled">
        {t('register.buttons.register')}
      </Button>
    ),
    AWAITING_REGISTER: (
      <Mutation
        mutation={REGISTER}
        variables={{ label, duration, secret }}
        onCompleted={data => {
          const txHash = Object.values(data)[0]
          setTxHash(txHash)
          if (ethUsdPrice) {
            // this is not set on local test env
            trackReferral({
              transactionId: txHash,
              labels: [label],
              type: 'register', // renew/register
              price: new EthVal(`${price._hex}`)
                .toEth()
                .mul(ethUsdPrice)
                .toFixed(2) // in wei, // in wei
            })
          }
          incrementStep()
        }}
      >
        {mutate => (
          <>
            {hasSufficientBalance ? (
              <>
                <Prompt>
                  <OrangeExclamation />
                  {t('register.buttons.warning')}
                </Prompt>
                <Button data-testid="register-button" onClick={mutate}>
                  {t('register.buttons.register')}
                </Button>
              </>
            ) : (
              <>
                <Prompt>
                  <OrangeExclamation />
                  {t('register.buttons.insufficient')}
                </Prompt>
                <Button data-testid="register-button" type="disabled">
                  {t('register.buttons.register')}
                </Button>
              </>
            )}
          </>
        )}
      </Mutation>
    ),
    REVEAL_SENT: (
      <PendingTx
        txHash={txHash}
        onConfirmed={async () => {
          incrementStep()
        }}
      />
    ),
    REVEAL_CONFIRMED: (
      <>
        <SetReverseRecord to={`/address/${account}`}>
          Set reverse record
        </SetReverseRecord>
        <AddToCalendar
          css={css`
            margin-right: 20px;
          `}
          name={`${label}.eth`}
          startDatetime={moment()
            .utc()
            .add(duration, 'seconds')
            .subtract(30, 'days')}
        />
        <Button
          data-testid="manage-name-button"
          onClick={async () => {
            await Promise.all([refetch(), refetchIsMigrated()])
            history.push(`/name/${label}.eth`)
          }}
        >
          <Pencil />
          {t('register.buttons.manage')}
        </Button>
      </>
    )
  }
  return CTAs[step]
}

const CTA = ({
  step,
  incrementStep,
  secret,
  duration,
  label,
  hasSufficientBalance,
  setTimerRunning,
  setCommitmentTimerRunning,
  commitmentTimerRunning,
  setBlockCreatedAt,
  isAboveMinDuration,
  refetch,
  refetchIsMigrated,
  readOnly,
  price,
  ethUsdPrice
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const account = useAccount()
  const [txHash, setTxHash] = useState(undefined)
  return (
    <CTAContainer>
      {getCTA({
        step,
        incrementStep,
        secret,
        duration,
        label,
        hasSufficientBalance,
        txHash,
        setTxHash,
        setTimerRunning,
        setBlockCreatedAt,
        setCommitmentTimerRunning,
        commitmentTimerRunning,
        isAboveMinDuration,
        refetch,
        refetchIsMigrated,
        readOnly,
        price,
        history,
        t,
        ethUsdPrice,
        account
      })}
    </CTAContainer>
  )
}

export default CTA

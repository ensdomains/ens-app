import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'

import { COMMIT, REGISTER } from '../../../graphql/mutations'

import Tooltip from 'components/Tooltip/Tooltip'
import PendingTx from '../../PendingTx'
import Button from '../../Forms/Button'
import { ReactComponent as DefaultPencil } from '../../Icons/SmallPencil.svg'
import { ReactComponent as DefaultOrangeExclamation } from '../../Icons/OrangeExclamation.svg'
import { ReactComponent as ExternalLinkIcon } from '../../Icons/externalLink.svg'

const EtherScanLinkContainer = styled('span')`
  display: inline-block;
  transform: translate(25%, 20%);
`

const CTAContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 20px;
`

const LinkToLearnMore = styled('a')`
  margin-right: 1em;
  font-size: 14px;
  letter-spacing: 0.58px;
  text-align: center;
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
`

function getCTA({
  step,
  incrementStep,
  label,
  txHash,
  setTxHash,
  refetch,
  readOnly
}) {
  const CTAs = {
    ENABLE_DNSSEC: (
      <Button onClick={() => window.location.reload()}>Refresh</Button>
    ),
    ADD_TEXT: <Button onClick={() => window.location.reload()}>Refresh</Button>,
    SUBMIT_PROOF: (
      <Button
        onClick={() => {
          incrementStep()
          setTimeout(() => {
            incrementStep()
          }, 2000)
        }}
      >
        Register
      </Button>
    ),
    SUBMIT_SENT: (
      <PendingTx
        txHash={txHash}
        onConfirmed={() => {
          incrementStep()
        }}
      />
    ),
    SUBMIT_CONFIRMED: (
      <Button onClick={() => refetch()}>
        <Pencil />
        View in Manager
      </Button>
    )
  }
  return CTAs[step]
}

const CTA = ({ step, incrementStep, label, refetch, readOnly }) => {
  const [txHash, setTxHash] = useState(undefined)
  return (
    <CTAContainer>
      <LinkToLearnMore
        href="https://medium.com/the-ethereum-name-service/how-to-claim-your-dns-domain-on-ens-e600ef2d92ca"
        target="_blank"
      >
        Learn More{' '}
        <EtherScanLinkContainer>
          <ExternalLinkIcon />
        </EtherScanLinkContainer>
      </LinkToLearnMore>
      {getCTA({
        step,
        incrementStep,
        label,
        txHash,
        setTxHash,
        refetch,
        readOnly
      })}
    </CTAContainer>
  )
}

export default CTA

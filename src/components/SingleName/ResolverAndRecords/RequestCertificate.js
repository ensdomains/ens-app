import React, { useEffect, useState } from 'react'
import { emptyAddress } from 'utils/utils'
import {
  requestCertificate,
  checkCertificate,
  isEthSubdomain
} from './Certificate.js'
import { useInterval } from 'components/hooks'
import PendingTx from 'components/PendingTx'
import styled from '@emotion/styled/macro'
import Button from '../../Forms/Button'
import mq from 'mediaQuery'
import { useTranslation } from 'react-i18next'
import useNetworkInfo from '../../NetworkInformation/useNetworkInfo'

const Warning = styled('span')`
  margin-right: 1em;
  color: #f5a623;
`

const Action = styled('div')`
  margin-left: 0;
  ${mq.small`
    margin-left: auto;
  `};
`

export default function RequestCertificate({ domain }) {
  const { networkId } = useNetworkInfo()
  // CloudFlaire only creates certificate if the domain exists on Mainnet
  if (networkId !== 1) return ''

  const [requireCertificate, setRequireCertificate] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const handleRequestCertificate = () => {
    requestCertificate(domain.name)
    setTimerRunning(true)
  }
  useInterval(
    () => {
      // Make sure that the requested certificate for subdomain is created
      checkCertificate(domain.name).then(({ status }) => {
        if (status === 200) {
          setRequireCertificate(false)
          setTimerRunning(false)
        }
      })
    },
    timerRunning ? 3000 : null
  )

  useEffect(() => {
    if (
      isEthSubdomain(domain.parent) &&
      domain.contentType === 'contenthash' &&
      domain.content !== emptyAddress
    ) {
      checkCertificate(domain.name).then(({ status }) => {
        setRequireCertificate(status === 404)
      })
    }
  })

  if (requireCertificate) {
    if (timerRunning) {
      return (
        <Action>
          <PendingTx>Pending</PendingTx>
        </Action>
      )
    } else {
      return (
        <Action>
          <Warning>
            SSL certificate for {domain.name}.link is not created yet
          </Warning>
          <Button onClick={handleRequestCertificate}>
            Request SSL certificate
          </Button>
        </Action>
      )
    }
  }
  return ''
}

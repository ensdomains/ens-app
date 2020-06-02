import React from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { formatDate, calculateIsExpiredSoon, GRACE_PERIOD } from 'utils/dates'

const ExpiryDateContainer = styled('p')`
  font-size: 18px;
  font-weight: 100;
  color: ${({ isExpiredSoon }) => (isExpiredSoon ? 'red' : '#adbbcd')};
`

const ExpiryDate = ({ expiryDate, domain }) => {
  let isExpiredSoon, isExpired, gracePeriodEndDate
  let { t } = useTranslation()
  if (expiryDate) {
    isExpiredSoon = calculateIsExpiredSoon(expiryDate)
    isExpired = new Date() > new Date(parseInt(expiryDate * 1000))
    gracePeriodEndDate = new Date((parseInt(expiryDate) + GRACE_PERIOD) * 1000)
  } else {
    return <span>&nbsp;</span>
  }
  return (
    <ExpiryDateContainer isExpiredSoon={isExpiredSoon}>
      {isExpired
        ? `${t('singleName.expiry.gracePeriodEnds')} ${formatDate(
            gracePeriodEndDate
          )}`
        : `${t('c.expires')} ${formatDate(parseInt(expiryDate * 1000))}`}
    </ExpiryDateContainer>
  )
}

export default ExpiryDate

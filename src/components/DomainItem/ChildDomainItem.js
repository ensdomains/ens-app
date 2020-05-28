import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { SingleNameBlockies } from '../Blockies'
import { formatDate, calculateIsExpiredSoon, GRACE_PERIOD } from 'utils/dates'
import Checkbox from '../Forms/Checkbox'
import mq, { useMediaMin } from 'mediaQuery'
import Tooltip from '../Tooltip/Tooltip'
import QuestionMark from '../Icons/QuestionMark'
import { checkIsDecrypted, truncateUndecryptedName } from '../../api/labels'

const DomainLink = styled(Link)`
  display: grid;
  grid-template-columns: 250px 23px;
  grid-template-rows: 50px 50px;
  grid-gap: 10px;
  width: 100%;
  padding: 30px 0;
  background-color: ${props => (props.warning ? 'hsla(37,91%,55%,0.1)' : '')};
  color: #2b2b2b;
  font-size: 22px;
  font-weight: 100;
  border-bottom: 1px dashed #d3d3d3;

  ${p =>
    !p.showBlockies &&
    mq.small`
        grid-template-columns: 1fr minmax(150px, 350px) 23px;
        grid-template-rows: 50px
      `}

  &:last-child {
    border: none;
  }

  span {
    align-self: center;
  }

  h3 {
    align-self: center;
    margin: 0;
    font-weight: 100;
    font-size: 28px;
  }

  p {
    grid-row-start: 2;
    margin: 0;
    align-self: center;

    ${mq.small`
      grid-row-start: auto;
    `}
  }
`

const ExpiryDate = styled('p')`
  font-size: 18px;
  color: ${({ isExpiredSoon }) => (isExpiredSoon ? 'red' : '#adbbcd')};
`

export default function ChildDomainItem({
  name,
  domain,
  labelhash,
  owner,
  labelName,
  parent,
  expiryDate,
  isMigrated,
  checkedBoxes,
  setCheckedBoxes,
  setSelectAll,
  showBlockies = true
}) {
  console.log({ expiryDate })
  let { t } = useTranslation()
  const smallBP = useMediaMin('small')
  const isDecrypted = checkIsDecrypted(name)
  let label = isDecrypted ? `${name}` : truncateUndecryptedName(name)
  if (isMigrated === false)
    label = label + ` (${t('childDomainItem.notmigrated')})`
  const isExpiredSoon = calculateIsExpiredSoon(expiryDate)
  const isExpired = new Date() > new Date(parseInt(expiryDate * 1000))
  const gracePeriodEndDate = new Date(
    (parseInt(expiryDate) + GRACE_PERIOD) * 1000
  )
  return (
    <DomainLink
      showBlockies={showBlockies}
      data-testid={`${name}`}
      warning={isMigrated === false ? true : false}
      key={name}
      to={`/name/${name}`}
    >
      {showBlockies && smallBP && (
        <SingleNameBlockies imageSize={24} address={owner} />
      )}
      <h3>{label}</h3>
      {expiryDate && (
        <ExpiryDate isExpiredSoon={isExpiredSoon}>
          {isExpired
            ? `${t('singleName.expiry.gracePeriodEnds')} ${formatDate(
                gracePeriodEndDate
              )}`
            : `${t('c.expires')} ${formatDate(parseInt(expiryDate * 1000))}`}
        </ExpiryDate>
      )}
      {!isDecrypted && (
        <Tooltip
          text="<p>This name is only partially decoded. If you know the name, you can search for it in the search bar to decrypt it and renew</p>"
          position="top"
          border={true}
          offset={{ left: 0, top: 10 }}
        >
          {({ tooltipElement, showTooltip, hideTooltip }) => {
            return (
              <div style={{ position: 'relative' }}>
                <QuestionMark
                  onMouseOver={() => {
                    showTooltip()
                  }}
                  onMouseLeave={() => {
                    hideTooltip()
                  }}
                />
                &nbsp;
                {tooltipElement}
              </div>
            )
          }}
        </Tooltip>
      )}
      {checkedBoxes && isDecrypted && (
        <Checkbox
          testid={`checkbox-${name}`}
          checked={checkedBoxes[name]}
          onClick={e => {
            e.preventDefault()
            setCheckedBoxes(prevState => {
              return { ...prevState, [name]: !prevState[name] }
            })
            if (checkedBoxes[name]) {
              setSelectAll(false)
            }
          }}
        />
      )}
    </DomainLink>
  )
}

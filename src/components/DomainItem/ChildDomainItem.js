import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { SingleNameBlockies } from '../SingleName/SingleNameBlockies'
import { formatDate, calculateIsExpiredSoon } from 'utils/dates'
import Checkbox from '../Forms/Checkbox'
import mq, { useMediaMin } from 'mediaQuery'

const DomainLink = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 23px;
  grid-template-rows: 50px 50px;
  grid-gap: 10px;
  width: 100%;
  padding: 30px 0;
  background-color: ${props => (props.warning ? 'hsla(37,91%,55%,0.1)' : '')};
  color: #2b2b2b;
  font-size: 22px;
  font-weight: 100;
  border-bottom: 1px dashed #d3d3d3;

  ${mq.small`
    grid-template-columns: 30px 1fr minmax(150px, 300px) 23px;
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
  setSelectAll
}) {
  let { t } = useTranslation()
  const smallBP = useMediaMin('small')
  let label =
    labelName !== null
      ? `${name}`
      : `[unknown${labelhash.slice(2, 10)}].${parent}`
  if (isMigrated === false)
    label = label + ` (${t('childDomainItem.notmigrated')})`
  const isExpiredSoon = calculateIsExpiredSoon(expiryDate)
  return (
    <DomainLink
      data-testid={`${name}`}
      warning={isMigrated === false ? true : false}
      key={name}
      to={`/name/${name}`}
    >
      {smallBP && <SingleNameBlockies imageSize={24} address={owner} />}
      <h3>{label}</h3>
      {expiryDate && (
        <ExpiryDate isExpiredSoon={isExpiredSoon}>
          {t('c.expires')} {formatDate(parseInt(expiryDate * 1000))}
        </ExpiryDate>
      )}
      {checkedBoxes && labelName !== null && (
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

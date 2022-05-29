import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DELETE_SUBDOMAIN } from 'graphql/mutations'
import { SingleNameBlockies } from '../Blockies'
import Checkbox from '../Forms/Checkbox'
import mq, { useMediaMin } from 'mediaQuery'
import Tooltip from '../Tooltip/Tooltip'
import QuestionMark from '../Icons/QuestionMark'
import {
  checkIsDecrypted,
  truncateUndecryptedName,
  parseName
} from '../../api/labels'
import ExpiryDate from './ExpiryDate'
import { useMutation } from '@apollo/client'
import Bin from '../Forms/Bin'
import { useEditable } from '../hooks'
import PendingTx from '../PendingTx'
import AddFavourite from '../AddFavourite/AddFavourite'

import warningImage from '../../assets/warning.svg'

const ChildDomainItemContainer = styled('div')`
  padding: 30px 0;
  border-bottom: 1px dashed #d3d3d3;
  &:last-child {
    border: none;
  }
`

const DomainLink = styled(Link)`
  display: grid;
  grid-template-columns: 250px auto 50px;
  grid-gap: 10px;
  width: 100%;
  background-color: ${props => (props.warning ? 'hsla(37,91%,55%,0.1)' : '')};
  color: #2b2b2b;
  font-size: 22px;
  font-weight: 100;
  align-items: center;

  ${p =>
    !p.showBlockies &&
    mq.small`
        grid-template-columns: 1fr minmax(150px, 350px) 35px 23px;
        grid-template-rows: 50px
      `}

  span {
    align-self: center;
  }

  h3 {
    margin: 0;
    font-weight: 100;
    font-size: 28px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    min-width: 100px;
  }

  ${p =>
    p.isInvalid &&
    `
    pointer-events: none;
    h3 {
      margin-top: 35px;
    }
    h3, h3:visited {
      transition: 0.2s;
      color: #DC2E2E;
    }
    &:hover h3 {
      color: #2C46A6;
    }
  `}

  p {
    grid-row-start: 2;
    margin: 0;
    align-self: center;

    ${mq.small`
      grid-row-start: auto;
    `}
  }
`

const WarningImg = styled('img')`
  width: 16px;
  height: 16px;
  margin-bottom: 4px;
  margin-right: 4px;
`

const WarningContainer = styled.div`
  font-size: 16px;
  display: flex;
  position: absolute;
  background-color: white;
  margin-top: -10px;
  margin-left: 2px;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: 100;

  & a:hover {
    color: #2c46a6;
  }
`

export default function ChildDomainItem({
  name,
  owner,
  expiryDate,
  isMigrated,
  isFavourite,
  checkedBoxes,
  setCheckedBoxes,
  setSelectAll,
  showBlockies = true,
  canDeleteSubdomain,
  refetch,
  hasInvalidCharacter
}) {
  const { state, actions } = useEditable()
  const { txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions

  let { t } = useTranslation()
  const smallBP = useMediaMin('small')
  const isDecrypted = checkIsDecrypted(name)
  let label = isDecrypted ? `${name}` : truncateUndecryptedName(name)
  if (isMigrated === false)
    label = label + ` (${t('childDomainItem.notmigrated')})`
  const [mutate] = useMutation(DELETE_SUBDOMAIN, {
    onCompleted: data => {
      if (Object.values(data)[0]) {
        startPending(Object.values(data)[0])
      }
    },
    variables: {
      name: parseName(name)
    }
  })

  return (
    <ChildDomainItemContainer>
      {pending && !confirmed ? (
        <PendingTx
          txHash={txHash}
          onConfirmed={() => {
            setConfirmed()
            refetch()
          }}
        />
      ) : (
        <React.Fragment>
          {hasInvalidCharacter && (
            <WarningContainer>
              <WarningImg
                src={warningImage}
                onClick={e => e.preventDefault()}
              />
              <span>
                <span onClick={e => e.preventDefault()}>
                  This name is invalid.{' '}
                </span>
                <a href="https://docs.ens.domains/frequently-asked-questions#what-about-foreign-characters-what-about-upper-case-letters-is-any-unicode-character-valid">
                  Learn more
                </a>
              </span>
            </WarningContainer>
          )}
          <DomainLink
            showBlockies={showBlockies}
            data-testid={`${name}`}
            warning={isMigrated === false ? true : false}
            isInvalid={hasInvalidCharacter}
            key={name}
            to={`/name/${name}`}
          >
            {showBlockies && smallBP && (
              <SingleNameBlockies imageSize={24} address={owner} />
            )}
            <h3>{label}</h3>
            {canDeleteSubdomain ? (
              <Bin
                data-testid={'delete-name'}
                onClick={e => {
                  e.preventDefault()
                  mutate()
                }}
              />
            ) : (
              <>
                <ExpiryDate name={name} expiryDate={expiryDate} />
                <AddFavourite
                  domain={{ name }}
                  isSubDomain={false}
                  isFavourite={isFavourite}
                />
              </>
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
        </React.Fragment>
      )}
    </ChildDomainItemContainer>
  )
}

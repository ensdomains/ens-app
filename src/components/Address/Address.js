import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from 'react-apollo'

import { GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH } from '../../graphql/queries'

import mq from 'mediaQuery'

import AddressContainer from '../Basic/MainContainer'
import DefaultTopBar from '../Basic/TopBar'
import { Title } from '../Typography/Basic'
import EtherScanLink from '../Links/EtherScanLink'
import { getEtherScanAddr } from '../../utils/utils'
import { calculateIsExpiredSoon } from '../../utils/dates'
import DomainList from './DomainList'
import RenewAll from './RenewAll'
import Sorting from './Sorting'
import Filtering from './Filtering'
import Loader from '../Loader'
import Banner from '../Banner'
import Checkbox from '../Forms/Checkbox'

import warning from '../../assets/yellowwarning.svg'
import close from '../../assets/close.svg'

const TopBar = styled(DefaultTopBar)`
  margin-bottom: 40px;
`

const Close = styled('img')`
  position: absolute;
  right: 20px;
  top: 20px;
  &:hover {
    cursor: pointer;
  }
`

const Controls = styled('div')`
  padding-left: 30px;
  display: grid;
  align-content: center;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'filters'
    'sorting'
    'renew'
    'selectall';
  grid-gap: 20px 10px;

  ${mq.small`
    margin: 20px 30px;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
    'filters sorting'
    'renew renew'
    '. selectall'
    ;
  `}
`

const SelectAll = styled('div')`
  grid-area: selectall;
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;

  ${mq.small`
    padding-right: 10px;
  `}
`

function filterOutReverse(domains) {
  return domains.filter(
    domain => domain.parent && domain.parent.name !== 'addr.reverse'
  )
}

function normaliseAddress(address) {
  return address.toLowerCase()
}

function getSortFunc(activeSort) {
  function alphabetical(a, b) {
    if (
      a.domain.name &&
      a.domain.name[0] === '[' &&
      b.domain.name &&
      b.domain.name[0] === '['
    )
      return a.domain.name > b.domain.name ? 1 : -1
    if (a.domain.name && a.domain.name[0] === '[') return 1
    if (b.domain.name && b.domain.name[0] === '[') return -1
    return a.domain.name > b.domain.name ? 1 : -1
  }
  switch (activeSort) {
    case 'alphabetical':
      return alphabetical
    case 'alphabeticalDesc':
      return (a, b) => {
        if (
          a.domain.name &&
          a.domain.name[0] === '[' &&
          b.domain.name &&
          b.domain.name[0] === '['
        )
          return a.domain.name > b.domain.name ? 1 : -1
        if (a.domain.name && a.domain.name[0] === '[') return 1
        if (b.domain.name && b.domain.name[0] === '[') return -1
        return a.domain.name < b.domain.name ? 1 : -1
      }
    case 'expiryDate':
      return (a, b) => a.expiryDate - b.expiryDate

    case 'expiryDateDesc':
      return (a, b) => b.expiryDate - a.expiryDate
    default:
      return alphabetical
  }
}

export default function Address({
  url,
  address,
  showOriginBanner,
  domainType = 'registrant'
}) {
  const normalisedAddress = normaliseAddress(address)
  const { loading, data, error, refetch } = useQuery(
    GET_DOMAINS_OWNED_BY_ADDRESS_FROM_SUBGRAPH,
    { variables: { id: normalisedAddress } }
  )

  let [showOriginBannerFlag, setShowOriginBannerFlag] = useState(true)
  let [etherScanAddr, setEtherScanAddr] = useState(null)
  let [activeSort, setActiveSort] = useState('alphabetical')
  let [checkedBoxes, setCheckedBoxes] = useState({})
  let [years, setYears] = useState(1)
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    getEtherScanAddr().then(setEtherScanAddr)
  }, [])

  if (error) {
    return 'Error getting domains'
  }

  if (loading) {
    return <Loader withWrap large />
  }

  let domains = []

  if (domainType === 'registrant') {
    domains = [...data.account.registrations?.sort(getSortFunc(activeSort))]
  } else if (domainType === 'controller') {
    domains = [
      ...filterOutReverse(data.account.domains)
        .map(domain => ({ domain }))
        .sort(getSortFunc(activeSort))
    ]
  }

  const selectedNames = Object.entries(checkedBoxes)
    .filter(([key, value]) => value)
    .map(([key]) => key)

  const allNames = domains
    .filter(d => d.domain.labelName)
    .map(d => d.domain.name)

  const selectAllNames = () => {
    const obj = allNames.reduce((acc, name) => {
      acc[name] = true
      return acc
    }, {})

    setCheckedBoxes(obj)
  }

  const hasNamesExpiringSoon = !!domains.find(domain =>
    calculateIsExpiredSoon(domain.expiryDate)
  )

  return (
    <>
      {showOriginBanner && showOriginBannerFlag && (
        <Banner>
          <Close onClick={() => setShowOriginBannerFlag(false)} src={close} />
          You are here because of a transaction we sent you. This transaction
          was to remind you to renew your ENS names below.
        </Banner>
      )}
      {hasNamesExpiringSoon && (
        <Banner>
          <h3>
            <img alt="exclamation mark" src={warning} />
            &nbsp; Names in May are expiring soon
            <p>
              One of more names are expiring soon, renew them all in one
              transaction!
            </p>
          </h3>
        </Banner>
      )}

      <AddressContainer>
        <TopBar>
          <Title>{address}</Title>
          {etherScanAddr && (
            <EtherScanLink
              target="_blank"
              href={`${etherScanAddr}/address/${address}`}
            >
              View on EtherScan
            </EtherScanLink>
          )}
        </TopBar>
        <Controls>
          <Filtering
            activeFilter={domainType}
            setActiveSort={setActiveSort}
            url={url}
          />
          <Sorting
            activeSort={activeSort}
            setActiveSort={setActiveSort}
            activeFilter={domainType}
          />
          <RenewAll
            years={years}
            setYears={setYears}
            activeFilter={domainType}
            selectedNames={selectedNames}
            allNames={allNames}
            data={data}
            refetch={refetch}
          />
          <SelectAll>
            <Checkbox
              checked={selectAll}
              onClick={() => {
                if (!selectAll) {
                  selectAllNames()
                } else {
                  setCheckedBoxes({})
                }
                setSelectAll(selectAll => !selectAll)
              }}
            />
          </SelectAll>
        </Controls>

        <DomainList
          setSelectAll={setSelectAll}
          address={address}
          domains={domains}
          activeSort={activeSort}
          activeFilter={domainType}
          checkedBoxes={checkedBoxes}
          setCheckedBoxes={setCheckedBoxes}
        />
      </AddressContainer>
    </>
  )
}

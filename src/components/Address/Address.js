import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from 'react-apollo'
import { useLocation } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import moment from 'moment'
import { useAccount } from '../QueryAccount'

import {
  GET_DOMAINS_SUBGRAPH,
  GET_REGISTRATIONS_SUBGRAPH
} from '../../graphql/queries'
import { decryptName, checkIsDecrypted } from '../../api/labels'

import mq from 'mediaQuery'

import AddressContainer from '../Basic/MainContainer'
import DefaultTopBar from '../Basic/TopBar'
import { Title as DefaultTitle } from '../Typography/Basic'
import DefaultEtherScanLink from '../Links/EtherScanLink'
import { getEtherScanAddr } from '../../utils/utils'
import { calculateIsExpiredSoon } from '../../utils/dates'
import DomainList from './DomainList'
import RenewAll from './RenewAll'
import Sorting from './Sorting'
import Filtering from './Filtering'
import Loader from '../Loader'
import Banner from '../Banner'
import Checkbox from '../Forms/Checkbox'
import { SingleNameBlockies } from '../Blockies'
import Pager from './Pager'
import AddReverseRecord from '../AddReverseRecord'

import warning from '../../assets/yellowwarning.svg'
import close from '../../assets/close.svg'
import { useBlock } from '../hooks'

const RESULTS_PER_PAGE = 30

const TopBar = styled(DefaultTopBar)`
  justify-content: flex-start;
  margin-bottom: 40px;
`

const Title = styled(DefaultTitle)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const EtherScanLink = styled(DefaultEtherScanLink)`
  min-width: 165px;
  margin-left: auto;
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
  padding-left: 8px;
  display: grid;
  align-content: center;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'filters'
    'actions'
    'renew'
    'sorting'
    'selectall';
  grid-gap: 20px 10px;
  margin: 20px;

  ${mq.large`
    margin: 20px 30px;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
    'filters actions'
    'renew renew'
    'sorting selectall'
    ;
  `}
`

const SelectAll = styled('div')`
  grid-area: selectall;
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;

  ${mq.large`
    padding-right: 10px;
  `}
`

function filterOutReverse(domains) {
  return domains.filter(domain => domain.parent)
}

function normaliseAddress(address) {
  return address.toLowerCase()
}

function decryptNames(domains) {
  return domains.map(d => {
    const name = decryptName(d.domain.name)
    return {
      ...d,
      domain: {
        ...d.domain,
        name: name,
        labelName: checkIsDecrypted(name[0]) ? name.split('.')[0] : null
      }
    }
  })
}

function useDomains({ domainType, address, sort, page, expiryDate }) {
  const skip = (page - 1) * RESULTS_PER_PAGE
  const registrationsQuery = useQuery(GET_REGISTRATIONS_SUBGRAPH, {
    variables: {
      id: address,
      first: RESULTS_PER_PAGE,
      skip,
      orderBy: sort.type,
      orderDirection: sort.direction,
      expiryDate
    },
    skip: domainType !== 'registrant'
  })

  const controllersQuery = useQuery(GET_DOMAINS_SUBGRAPH, {
    variables: {
      id: address,
      first: RESULTS_PER_PAGE,
      skip
    },
    skip: domainType !== 'controller'
  })

  if (domainType === 'registrant') {
    return registrationsQuery
  } else if (domainType === 'controller') {
    return controllersQuery
  } else {
    throw new Error('Unrecognised domainType')
  }
}

export default function Address({
  url,
  address,
  showOriginBanner,
  domainType = 'registrant'
}) {
  const normalisedAddress = normaliseAddress(address)
  const { search } = useLocation()
  const account = useAccount()
  const pageQuery = new URLSearchParams(search).get('page')
  const page = pageQuery ? parseInt(pageQuery) : 1
  const { block } = useBlock()

  let { t } = useTranslation()
  let [showOriginBannerFlag, setShowOriginBannerFlag] = useState(true)
  let [etherScanAddr, setEtherScanAddr] = useState(null)
  let [activeSort, setActiveSort] = useState({
    type: 'expiryDate',
    direction: 'asc'
  })
  let [checkedBoxes, setCheckedBoxes] = useState({})
  let [years, setYears] = useState(1)
  const [selectAll, setSelectAll] = useState(false)
  let expiryDate
  if (block) {
    expiryDate = moment(block.timestamp * 1000)
      .subtract(90, 'days')
      .unix()
  }

  const { loading, data, error, refetch } = useDomains({
    domainType,
    address: normalisedAddress,
    sort: activeSort,
    page,
    expiryDate
  })

  useEffect(() => {
    getEtherScanAddr().then(setEtherScanAddr)
  }, [])

  if (error) {
    console.log(error)
    return <>Error getting domains. {JSON.stringify(error)}</>
  }

  if (loading) {
    return <Loader withWrap large />
  }

  let normalisedDomains = []

  if (domainType === 'registrant' && data.account) {
    normalisedDomains = [...data.account.registrations]
  } else if (domainType === 'controller' && data.account) {
    normalisedDomains = [
      ...filterOutReverse(data.account.domains).map(domain => ({ domain }))
    ]
  }

  let decryptedDomains = decryptNames(normalisedDomains)
  // let sortedDomains = decryptedDomains.sort(getSortFunc(activeSort))
  let domains = decryptedDomains

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
          {t('address.transactionBanner')}
        </Banner>
      )}
      {hasNamesExpiringSoon && (
        <Banner>
          <h3>
            <img alt="exclamation mark" src={warning} />
            &nbsp; {t('address.namesExpiringSoonBanner.title')}
            <p>
              <Trans i18nKey="address.namesExpiringSoonBanner.text">
                One or more names are expiring soon, renew them all in one
                transaction by selecting multiple names and click "Renew"
              </Trans>
            </p>
          </h3>
        </Banner>
      )}

      <AddressContainer>
        <TopBar>
          <SingleNameBlockies address={address} />
          <Title>{address}</Title>
          {etherScanAddr && (
            <EtherScanLink address={address}>
              {t('address.etherscanButton')}
            </EtherScanLink>
          )}
        </TopBar>
        <AddReverseRecord account={account} currentAddress={address} />
        <Controls>
          <Filtering
            activeFilter={domainType}
            setActiveSort={setActiveSort}
            url={url}
          />

          {domainType === 'registrant' && (
            <RenewAll
              years={years}
              setYears={setYears}
              activeFilter={domainType}
              selectedNames={selectedNames}
              setCheckedBoxes={setCheckedBoxes}
              setSelectAll={setSelectAll}
              allNames={allNames}
              address={address}
              data={data}
              refetch={refetch}
            />
          )}
          <Sorting
            activeSort={activeSort}
            setActiveSort={setActiveSort}
            activeFilter={domainType}
          />

          {domainType === 'registrant' && (
            <>
              <SelectAll>
                <Checkbox
                  testid="checkbox-renewall"
                  type="double"
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
            </>
          )}
        </Controls>

        <DomainList
          setSelectAll={setSelectAll}
          address={address}
          domains={domains}
          activeSort={activeSort}
          activeFilter={domainType}
          checkedBoxes={checkedBoxes}
          setCheckedBoxes={setCheckedBoxes}
          showBlockies={false}
        />
        <Pager
          variables={{ id: address, expiryDate }}
          currentPage={page}
          resultsPerPage={RESULTS_PER_PAGE}
          pageLink={`/address/${address}/${domainType}`}
          query={
            domainType === 'registrant'
              ? GET_REGISTRATIONS_SUBGRAPH
              : GET_DOMAINS_SUBGRAPH
          }
        />
      </AddressContainer>
    </>
  )
}

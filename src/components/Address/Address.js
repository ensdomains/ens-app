import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

import mq from 'mediaQuery'

import AddressContainer from '../Basic/MainContainer'
import DefaultTopBar from '../Basic/TopBar'
import { Title } from '../Typography/Basic'
import { ExternalButtonLink as DefaultExternalButtonLink } from '../Forms/Button'
import { getEtherScanAddr } from '../../utils/utils'
import DomainList from './DomainList'
import RenewAll from './RenewAll'
import Sorting from './Sorting'
import Filtering from './Filtering'

const TopBar = styled(DefaultTopBar)`
  margin-bottom: 40px;
`

const ExternalButtonLink = styled(DefaultExternalButtonLink)`
  margin-left: 40px;
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
    'renew';
  grid-gap: 20px 10px;

  ${mq.small`
    margin: 20px 30px;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
    'filters renew'
    'sorting .'
    ;
  `}
`

export default function Address({ address }) {
  let [etherScanAddr, setEtherScanAddr] = useState(null)
  let [activeSort, setActiveSort] = useState('alphabetical')
  let [activeFilter, setActiveFilter] = useState('registrant')
  let [checkedBoxes, setCheckedBoxes] = useState({})
  let [years, setYears] = useState(1)

  useEffect(() => {
    getEtherScanAddr().then(setEtherScanAddr)
  }, [])

  return (
    <AddressContainer>
      <TopBar>
        <Title>{address}</Title>
        {etherScanAddr && (
          <ExternalButtonLink
            type="primary"
            target="_blank"
            href={`${etherScanAddr}/address/${address}`}
          >
            View on EtherScan
          </ExternalButtonLink>
        )}
      </TopBar>
      <Controls>
        <Filtering
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          setActiveSort={setActiveSort}
        />
        <Sorting
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          activeFilter={activeFilter}
        />
        <RenewAll
          years={years}
          setYears={setYears}
          selectedNames={Object.entries(checkedBoxes)
            .filter(([key, value]) => value)
            .map(([key]) => key)}
        />
      </Controls>

      <DomainList
        address={address}
        activeSort={activeSort}
        activeFilter={activeFilter}
        checkedBoxes={checkedBoxes}
        setCheckedBoxes={setCheckedBoxes}
      />
    </AddressContainer>
  )
}

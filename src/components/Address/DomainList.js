import React from 'react'
import styled from '@emotion/styled/macro'

import DomainItem from '../DomainItem/ChildDomainItem'

const NoDomainsContainer = styled('div')`
  display: flex;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 6px;
  margin-bottom: 40px;

  h2 {
    color: #adbbcd;
    font-weight: 100;
    margin-bottom: 0;
    padding: 0;
    margin-top: 20px;
    text-align: center;
    max-width: 500px;
  }

  p {
    color: #2b2b2b;
    font-size: 18px;
    font-weight: 300;
    margin-top: 20px;
    line-height: 1.3em;
    text-align: center;
    max-width: 400px;
  }
`

const DomainsContainer = styled('div')`
  margin-top: 20px;
  padding-bottom: 30px;
  padding-left: 40px;
  padding-right: 40px;
`

export default function DomainList({
  favourites = [],
  address,
  activeSort,
  activeFilter,
  checkedBoxes,
  setCheckedBoxes,
  setSelectAll,
  domains,
  showBlockies
}) {
  if (!domains || domains.length === 0) {
    return (
      <NoDomainsContainer>
        <h2>This address does not own any domains</h2>
      </NoDomainsContainer>
    )
  }

  return (
    <DomainsContainer>
      {domains.map(d => {
        const isFavourite = favourites.map(m => m.name).includes(d.domain.name)
        return (
          <DomainItem
            key={d.domain.name}
            name={d.domain.name}
            owner={address}
            domain={d.domain}
            expiryDate={d?.expiryDate}
            labelName={d.domain.labelName}
            labelhash={d.domain.labelhash}
            parent={d.domain.parent.name}
            checkedBoxes={activeFilter === 'registrant' ? checkedBoxes : null}
            setCheckedBoxes={
              activeFilter === 'registrant' ? setCheckedBoxes : null
            }
            setSelectAll={setSelectAll}
            showBlockies={showBlockies}
            isFavourite={isFavourite}
          />
        )
      })}
    </DomainsContainer>
  )
}

import React from 'react'
import styled from '@emotion/styled'

const SortContainer = styled('ul')`
  list-style: none;
  display: flex;
`

const SortButton = styled('li')`
  color: #adbbcd;
  font-size: 18px;
  padding: 5px 10px;
  border-bottom: 1px #d2d2d2 solid;

  &:hover,
  &.active {
    cursor: pointer;
    color: #2c46a6;
    border-bottom: 1px #2c46a6 solid;
  }
`

export default function Sorting({ activeSort, setActiveSort, activeFilter }) {
  return (
    <SortContainer>
      <SortButton
        className={
          activeSort === 'alphabetical' || activeSort === 'alphabeticalDesc'
            ? 'active'
            : ''
        }
        onClick={() => {
          switch (activeSort) {
            case 'alphabetical':
              return setActiveSort('alphabeticalDesc')
            case 'alphabeticalDesc':
              return setActiveSort('alphabetical')
            default:
              return setActiveSort('alphabetical')
          }
        }}
      >
        Alphabetical
      </SortButton>
      {activeFilter === 'registrant' && (
        <SortButton
          className={
            activeSort === 'expiryDate' || activeSort === 'expiryDateDesc'
              ? 'active'
              : ''
          }
          onClick={() => {
            switch (activeSort) {
              case 'expiryDate':
                return setActiveSort('expiryDateDesc')
              case 'expiryDateDesc':
                return setActiveSort('expiryDate')
              default:
                return setActiveSort('expiryDate')
            }
          }}
        >
          Expiry Date
        </SortButton>
      )}
    </SortContainer>
  )
}

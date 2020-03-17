import React from 'react'
import styled from '@emotion/styled'

const FilterContainer = styled('ul')`
  list-style: none;
  display: flex;
`

const FilterButton = styled('li')`
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

export default function Filtering({
  activeFilter,
  setActiveFilter,
  setActiveSort
}) {
  return (
    <FilterContainer>
      <FilterButton
        className={activeFilter === 'registrant' ? 'active' : ''}
        onClick={() => setActiveFilter('registrant')}
      >
        Registrant
      </FilterButton>
      <FilterButton
        className={activeFilter === 'controller' ? 'active' : ''}
        onClick={() => {
          setActiveFilter('controller')
          setActiveSort('alphabetical')
        }}
      >
        Controller
      </FilterButton>
    </FilterContainer>
  )
}

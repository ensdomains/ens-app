import React from 'react'
import styled from '@emotion/styled'
import { Tab, Tabs } from '../Tabs'

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
  setActiveSort,
  className
}) {
  return (
    <Tabs className={className}>
      <Tab
        active={activeFilter === 'registrant'}
        onClick={() => setActiveFilter('registrant')}
      >
        Registrant
      </Tab>
      <Tab
        active={activeFilter === 'controller'}
        onClick={() => {
          setActiveFilter('controller')
          setActiveSort('alphabetical')
        }}
      >
        Controller
      </Tab>
    </Tabs>
  )
}

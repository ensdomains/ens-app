import React from 'react'
import { Tab, Tabs } from '../Tabs'

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

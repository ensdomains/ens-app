import React from 'react'
import { useHistory } from 'react-router'
import { Tab, Tabs } from '../Tabs'

export default function Filtering({
  activeFilter,
  setActiveFilter,
  setActiveSort,
  className,
  url
}) {
  const history = useHistory()
  const baseUrl = url
    .split('/')
    .slice(0, -1)
    .join('/')
  return (
    <Tabs className={className}>
      <Tab
        active={activeFilter === 'registrant'}
        onClick={() => history.push(`${baseUrl}/registrant`)}
      >
        Registrant
      </Tab>
      <Tab
        active={activeFilter === 'controller'}
        onClick={() => {
          history.push(`${baseUrl}/controller`)
          setActiveSort('alphabetical')
        }}
      >
        Controller
      </Tab>
    </Tabs>
  )
}

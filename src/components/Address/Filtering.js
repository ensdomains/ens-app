import React from 'react'
import { useHistory } from 'react-router'
import { Tab, Tabs } from '../Tabs'

function getBaseUrl(url) {
  const urlArray = url.split('/')
  if (urlArray.length === 3) return url
  return urlArray.slice(0, -1).join('/')
}

export default function Filtering({
  activeFilter,
  setActiveFilter,
  setActiveSort,
  className,
  url
}) {
  const history = useHistory()
  const baseUrl = getBaseUrl(url)
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

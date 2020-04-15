import React from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'

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
  let { t } = useTranslation()
  const history = useHistory()
  const baseUrl = getBaseUrl(url)
  return (
    <Tabs className={className}>
      <Tab
        active={activeFilter === 'registrant'}
        onClick={() => history.push(`${baseUrl}/registrant`)}
      >
        {t('address.filter.registrant')}
      </Tab>
      <Tab
        active={activeFilter === 'controller'}
        onClick={() => {
          history.push(`${baseUrl}/controller`)
          setActiveSort('alphabetical')
        }}
      >
        {t('address.filter.controller')}
      </Tab>
    </Tabs>
  )
}

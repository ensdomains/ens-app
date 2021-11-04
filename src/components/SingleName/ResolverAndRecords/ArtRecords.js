import React from 'react'
import { Query } from '@apollo/client/react/components'
import styled from '@emotion/styled/macro'

import Loader from '../../Loader'

import {
  RecordsContent,
  RecordsItem,
  RecordsKey,
  RecordsValue
} from './RecordsItem'

const Records = styled('div')`
  border-radius: 6px;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 10px 0 rgba(235, 235, 235, 0.5);
  padding-bottom: 10px;
  display: block;
  margin-bottom: 20px;
`

const RecordsHeader = styled('div')`
  background: #f0f6fa;
`

const RecordsTitle = styled('h3')`
  font-family: Overpass;
  font-weight: 700;
  font-size: 12px;
  color: #adbbcd;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

function isArt(name) {
  return !!name?.match(/\.art$/)
}

function getArtRecordLabel(key) {
  const recordLabels = {
    title: 'Title',
    maker: 'Maker',
    type: 'Type of Object',
    subject: 'Subject',
    period: 'Period',
    dimensions: 'Measurements',
    materials: 'Materials & Techniques',
    markings: 'Inscriptions & Markings',
    features: 'Features',
    reference: 'Reference'
  }

  return recordLabels[key]
}

function isEmpty(records) {
  if (!records.length) {
    return true
  }

  return records.filter(record => record.value).length === 0
}

function decodeRecords(values) {
  let parsed = {}
  try {
    parsed = JSON.parse(values)
  } catch (e) {}

  return Object.keys(parsed).reduce(
    (decoded, key) =>
      decoded.concat({
        label: getArtRecordLabel(key),
        value: parsed[key]
      }),
    []
  )
}

function ArtRecordItem({ value, label }) {
  if (!value) return null

  return (
    <RecordsItem>
      <RecordsContent>
        <RecordsKey>{label}</RecordsKey>
        <RecordsValue>
          <div>{value}</div>
        </RecordsValue>
      </RecordsContent>
    </RecordsItem>
  )
}

export default function ArtRecords({ domain, query }) {
  if (!isArt(domain.name)) return null

  return (
    <Query query={query} variables={{ name: domain.name, key: 'artrecords' }}>
      {({ loading, data }) => {
        if (loading) return <Loader center />

        const { getText: encodedArtRecords } = data

        if (!encodedArtRecords) return null

        const records = decodeRecords(encodedArtRecords)

        if (isEmpty(records)) return null

        return (
          <Records>
            <RecordsHeader>
              <RecordsTitle>Art records</RecordsTitle>
            </RecordsHeader>

            {records.map((r, i) => (
              <ArtRecordItem key={i} value={r.value} label={r.label} />
            ))}
          </Records>
        )
      }}
    </Query>
  )
}

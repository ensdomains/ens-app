import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import styled from '@emotion/styled'

import Loader from '../Loader'

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

class ArtRecords extends Component {
  recordLabels = {
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

  _isEmpty(records) {
    if (!records.length) {
      return true
    }

    return records.filter(record => record.value).length === 0
  }

  _normalizeRecords(values) {
    let parsed = {}
    try {
      parsed = JSON.parse(values)
    } catch (e) {}

    return Object.keys(parsed).reduce(
      (normalized, key) =>
        normalized.concat({
          label: this.recordLabels[key],
          value: parsed[key]
        }),
      []
    )
  }

  _renderItem(record, index) {
    if (!record.value) return null

    return (
      <RecordsItem key={index}>
        <RecordsContent>
          <RecordsKey>{record.label}</RecordsKey>
          <RecordsValue>
            <div>{record.value}</div>
          </RecordsValue>
        </RecordsContent>
      </RecordsItem>
    )
  }

  render() {
    const { domain, query } = this.props

    return (
      <Query query={query} variables={{ name: domain.name, key: 'artrecords' }}>
        {({ loading, data }) => {
          if (loading) return <Loader center />

          const { getText: encodedArtRecords } = data

          if (!encodedArtRecords) return null

          const records = this._normalizeRecords(encodedArtRecords)

          if (this._isEmpty(records)) return null

          return (
            <Records>
              <RecordsHeader>
                <RecordsTitle>Art records</RecordsTitle>
              </RecordsHeader>

              {records.map((r, i) => this._renderItem(r, i))}
            </Records>
          )
        }}
      </Query>
    )
  }
}

ArtRecords.propTypes = {
  domain: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired
}

export default ArtRecords

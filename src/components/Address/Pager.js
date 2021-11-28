import React, { useEffect, useState } from 'react'
import getClient from '../../apollo/apolloClient'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import mq from 'mediaQuery'
import Select from 'react-select'
import { getQueryName } from '../../utils/graphql'

const PageNumber = styled(Link)`
  ${p =>
    p.currentPage === p.page &&
    `
      text-decoration: underline;
    `}
  margin: 0 5px;
`
const PagerContainer = styled('div')`
  margin: 0 20px 20px;

  ${mq.small`
    margin: 0 40px 20px;
  `}
`

const SelectPagerContainer = styled('span')`
  float: right;
`

const styles = {
  container: styles => ({
    ...styles,
    display: 'inline-block',
    width: '100px'
  }),
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    textTransform: 'lowercase',
    fontWeight: '700',
    fontSize: '12px',
    color: '#2B2B2B',
    letterSpacing: '0.5px'
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: 'white',
      textTransform: 'lowercase',
      fontWeight: isSelected ? 700 : 500,
      fontSize: '12px',
      letterSpacing: '0.5px',
      color: isDisabled ? '#ccc' : isSelected ? 'black' : '#666',
      cursor: isDisabled ? 'not-allowed' : 'default'
    }
  },
  input: styles => ({ ...styles }),
  placeholder: styles => ({ ...styles }),
  singleValue: (styles, { data }) => ({ ...styles })
}

const options = [
  { value: 25, label: 25 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
  { value: 200, label: 200 },
  { value: 300, label: 300 }
]

export function useTotalPages({ resultsPerPage, query, variables }) {
  const limit = 1000
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const client = getClient()
  const queryName = getQueryName(query)
  const supportedQueries = ['getRegistrations', 'getDomains']

  useEffect(() => {
    async function getResults(limit) {
      let skip = 0

      async function queryFunc(totalResults) {
        const { data } = await client.query({
          query,
          variables: {
            ...variables,
            skip,
            first: limit
          }
        })

        let resultsLength = 0

        if (queryName === 'getRegistrations') {
          resultsLength = data.account?.registrations?.length || 0
        }

        if (queryName === 'getDomains') {
          resultsLength = data.account?.domains?.length || 0
        }

        skip = skip + limit
        const cumulativeResults = totalResults + resultsLength

        if (resultsLength === limit) {
          return queryFunc(cumulativeResults)
        }
        return cumulativeResults
      }

      const total = await queryFunc(0)
      return total
    }

    if (!supportedQueries.includes(queryName)) {
      setTotalResults(0)
      setLoading(false)
    } else {
      getResults(limit).then(res => {
        setTotalResults(res)
        setLoading(false)
      })
    }
  }, [client, query, variables])

  return {
    totalPages: Math.ceil(totalResults / resultsPerPage),
    loading
  }
}

function Page({ page, pageLink, currentPage }) {
  return (
    <PageNumber
      currentPage={currentPage}
      page={page}
      to={`${pageLink}?page=${page}`}
    >
      {page}
    </PageNumber>
  )
}

export default function Pager({
  currentPage,
  setResultsPerPage,
  resultsPerPage,
  query,
  variables,
  pageLink
}) {
  const handleSelect = e => {
    setResultsPerPage(e.value)
  }

  const { totalPages } = useTotalPages({
    setResultsPerPage,
    resultsPerPage,
    variables,
    query
  })
  if (totalPages < 2) {
    return null
  }

  const pageArray = [...Array(totalPages).keys()]
  const pages = pageArray.map(index => {
    return (
      <Page currentPage={currentPage} page={index + 1} pageLink={pageLink} />
    )
  })

  return (
    <PagerContainer>
      {pages}
      <SelectPagerContainer>
        Show{' '}
        <Select
          defaultValue={options.filter(o => o.value === resultsPerPage)}
          styles={styles}
          menuPlacement="top"
          onChange={handleSelect}
          options={options}
        />{' '}
        Records
      </SelectPagerContainer>
    </PagerContainer>
  )
}

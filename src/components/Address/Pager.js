import React, { useEffect, useState } from 'react'
import getClient from '../../apolloClient'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import mq from 'mediaQuery'

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

function useTotalPages({ resultsPerPage, query, address, variables }) {
  const limit = 1000
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const client = getClient()

  useEffect(() => {
    async function getResults(skipAmount, limit) {
      let skip = skipAmount
      async function queryFunc(totalResults) {
        const { data } = await client.query({
          query,
          variables: {
            ...variables,
            skip,
            first: limit
          }
        })

        const label1 = Object.keys(data)[0]

        if (data[label1]) {
          const label2 = Object.keys(data[label1])[0]
          skip = skip + limit
          const resultsLength = data[label1][label2].length
          const cumulativeResults = totalResults + resultsLength

          if (resultsLength === limit) {
            return queryFunc(cumulativeResults)
          }
          return cumulativeResults
        } else {
          return 0
        }
      }

      const total = await queryFunc(0)

      return total
    }
    getResults(0, limit).then(res => {
      setTotalResults(res)
      setLoading(false)
    })
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
  resultsPerPage,
  query,
  variables,
  pageLink
}) {
  const { totalPages } = useTotalPages({
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
  return <PagerContainer>{pages}</PagerContainer>
}

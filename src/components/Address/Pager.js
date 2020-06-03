import React from 'react'
import { useQuery } from 'react-apollo'
import styled from '@emotion/styled/macro'
import { useLocation, Link } from 'react-router-dom'
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

function useTotalPages({ resultsPerPage, query, address }) {
  const { loading, data } = useQuery(query, {
    variables: {
      id: address,
      first: 1000,
      skip: 0
    }
  })
  if (data && !loading) {
    const totalNumber = Object.values(data.account)[0].length
    return {
      totalPages: Math.ceil(totalNumber / resultsPerPage)
    }
  }

  return { totalPages: undefined, loading }
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
  address,
  pageLink
}) {
  const { loading, totalPages } = useTotalPages({
    resultsPerPage,
    address,
    query
  })
  //const totalPages = 2
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

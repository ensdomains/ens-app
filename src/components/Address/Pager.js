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
  pageLink
}) {
  const totalPages = 2
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

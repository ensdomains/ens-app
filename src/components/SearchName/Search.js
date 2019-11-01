import React, { useState } from 'react'
import styled from '@emotion/styled'
import { parseSearchTerm } from '../../utils/utils'
import '../../api/subDomainRegistrar'
import { withRouter } from 'react-router'
import searchIcon from '../../assets/search.svg'
import mq from 'mediaQuery'
// import Caret from './Caret'
// import Filters from './Filters'

const SearchForm = styled('form')`
  display: flex;
  position: relative;
  z-index: 100;

  &:before {
    content: '';
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translate(0, -50%);
    display: block;
    width: 27px;
    height: 27px;
    background: url(${searchIcon}) no-repeat;
  }

  input {
    padding: 20px 0 20px 55px;
    width: 100%;
    border: none;
    border-radius: 0;
    font-size: 18px;
    font-family: Overpass;
    font-weight: 100;
    ${mq.medium`
      width: calc(100% - 162px);
      font-size: 28px;
    `}

    &:focus {
      outline: 0;
    }

    &::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      color: #ccd4da;
    }
  }

  button {
    background: #5284ff;
    color: white;
    font-size: 22px;
    font-family: Overpass;
    padding: 20px 0;
    height: 90px;
    width: 162px;
    border: none;
    display: none;
    ${mq.medium`
      display: block;
    `}

    &:hover {
      cursor: pointer;
    }
  }
`

function Search({ history, className, style }) {
  const [type, setType] = useState(null)
  //const [filterOpen, setFilterOpen] = useState(false)
  let input

  const handleParse = e => {
    const type = parseSearchTerm(e.target.value)
    setType(type)
  }

  return (
    <SearchForm
      className={className}
      style={style}
      action="#"
      onSubmit={e => {
        e.preventDefault()
        const searchTerm = input.value.toLowerCase()
        if (searchTerm.length < 1) {
          return
        }

        if (type === 'address') {
          history.push(`/address/${searchTerm}`)
          return
        }

        input.value = ''
        if (type === 'supported' || type === 'short') {
          history.push(`/name/${searchTerm}`)
          return
        } else {
          history.push(`/search/${searchTerm}`)
        }
      }}
    >
      <input
        placeholder="Search names or addresses"
        ref={el => (input = el)}
        onChange={handleParse}
      />
      {/* <Caret
          up={filterOpen}
          onClick={() =>
            setFilterOpen(!filterOpen)
          }
        /> */}
      {/* <Filters show={filterOpen} /> */}
      <button type="submit">Search</button>
    </SearchForm>
  )
}

const SearchWithRouter = withRouter(Search)

const SearchContainer = ({ searchDomain, className, style }) => {
  return (
    <SearchWithRouter
      searchDomain={searchDomain}
      className={className}
      style={style}
    />
  )
}

export { SearchWithRouter as Search }

export default SearchContainer

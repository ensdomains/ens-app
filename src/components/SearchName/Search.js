import React from 'react'
import styled from 'react-emotion'
import { parseSearchTerm } from '../../lib/utils'
import '../../api/subDomainRegistrar'
import { withRouter } from 'react-router'
import searchIcon from './search.svg'
// import Caret from './Caret'
// import Filters from './Filters'

const SearchForm = styled('form')`
  display: flex;
  position: relative;
  z-index: 10000;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
    display: block;
    width: 27px;
    height: 27px;
    background: url(${searchIcon});
  }

  input {
    padding-left: 35px;
    // width: calc(100% - 243px);
    width: calc(100% - 162px);
    border: none;
    font-size: 28px;
    font-family: Overpass;
    font-weight: 100;

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

    &:hover {
      cursor: pointer;
    }
  }
`

class Search extends React.Component {
  state = {
    type: null,
    filterOpen: false
  }
  handleParse = () => {
    const type = parseSearchTerm(this.input.value)
    this.setState({ type })
  }

  render() {
    const { history, className, style } = this.props
    return (
      <SearchForm
        className={className}
        style={style}
        onSubmit={e => {
          e.preventDefault()
          const searchTerm = this.input.value

          this.input.value = ''

          if (this.state.type === 'supported') {
            history.push(`/name/${searchTerm}`)
            return
          } else {
            history.push(`/search/${searchTerm}`)
          }
        }}
      >
        <input
          placeholder="Search names and addresses"
          ref={el => (this.input = el)}
          onChange={this.handleParse}
        />
        {/* <Caret
          up={this.state.filterOpen}
          onClick={() =>
            this.setState(state => ({ filterOpen: !state.filterOpen }))
          }
        /> */}
        {/* <Filters show={this.state.filterOpen} /> */}
        <button type="submit">Search</button>
      </SearchForm>
    )
  }
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

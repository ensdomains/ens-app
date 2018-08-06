import React, { Fragment } from 'react'
import styled from 'react-emotion'

import Container from '../components/Container'
import SearchDefault from '../components/SearchName/Search'
import bg from '../assets/heroBG.jpg'
import Logo from '../components/Logo'

const Hero = styled('section')`
  background: url(${bg});
  height: 500px;
`

const SearchContainer = styled('div')`
  margin: 0 auto 0;
  width: 50%;
`

const Search = styled(SearchDefault)`
  &:before {
    left: 20px;
  }

  input {
    border-radius: 6px 0 0 6px;
    padding-left: 55px;
  }

  button {
    border-radius: 0 6px 6px 0;
  }
`

export default props => (
  <Fragment>
    <Hero>
      <Logo color="#ffffff" />
      <SearchContainer>
        <Search />
      </SearchContainer>
    </Hero>

    <Container />
  </Fragment>
)

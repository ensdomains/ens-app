import React, { Fragment } from 'react'
import styled from 'react-emotion'

import Container from '../components/Container'
import SearchDefault from '../components/SearchName/Search'
import NoAccounts from '../components/NoAccounts'
import bg from '../assets/heroBG.jpg'
import DefaultLogo from '../components/Logo'

const Hero = styled('section')`
  background: url(${bg});
  height: 500px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const SearchContainer = styled('div')`
  margin: 0 auto 0;
  display: flex;
`

const Search = styled(SearchDefault)`
  min-width: 700px;
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

const Logo = styled(DefaultLogo)`
  padding-top: 20px;
  position: absolute;
  left: 0;
  top: 0;
`

export default props => (
  <Fragment>
    <Hero>
      <Logo color="#ffffff" />
      <NoAccounts />
      <SearchContainer>
        <Search />
      </SearchContainer>
    </Hero>
    <Container />
  </Fragment>
)

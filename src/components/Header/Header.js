import React, { Component } from 'react'
import styled from 'react-emotion'
import DefaultLogo from '../Logo'
import Search from '../SearchName/Search'

const Header = styled('header')`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const SearchHeader = styled(Search)`
  width: calc(100% - 200px);
`

const Logo = styled(DefaultLogo)`
  background: white;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  align-items: center;
  width: 200px;
`

class HeaderContainer extends Component {
  render() {
    return (
      <Header>
        <Logo />
        <SearchHeader />
      </Header>
    )
  }
}

export default HeaderContainer

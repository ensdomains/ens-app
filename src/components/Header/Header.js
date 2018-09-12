import React, { Component } from 'react'
import styled from 'react-emotion'
import DefaultLogo from '../Logo'
import Search from '../SearchName/Search'

const Header = styled('header')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 8px 24px 0 rgba(230, 240, 247, 0.8);
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
  position: relative;

  &:before {
    background: #d3d3d3;
    height: 32px;
    margin-top: 30px;
    content: '';
    width: 1px;
    right: 35px;
    top: 0;
    position: absolute;
  }
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

import React, { Component } from 'react'
import styled from 'react-emotion'

import mq, { MediaQuery } from '../../mediaQuery'

import DefaultLogo from '../Logo'
import Search from '../SearchName/Search'
import Hamburger from './Hamburger'
import SideNav from '../SideNav/SideNav'

const Header = styled('header')`
  ${p =>
    p.isMenuOpen
      ? `
    background: #121D46;
  `
      : ''}
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 100000;
  box-shadow: 0 8px 24px 0 rgba(230, 240, 247, 0.8);
  height: 50px;
  ${mq.small`
    height: auto;
  `}
`

const SearchHeader = styled(Search)`
  margin-top: 50px;
  width: 100%;
  ${mq.small`
    margin-top: 0;
    width: calc(100% - 200px);
  `}
`

const Logo = styled(DefaultLogo)`
  background: white;
  position: relative;
  display: flex;
  width: 100%;
  ${p =>
    p.isMenuOpen
      ? `
    opacity: 0;
  `
      : ``}

  ${mq.small`
    opacity: 1;
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
  `}
`

class HeaderContainer extends Component {
  state = {
    isMenuOpen: false
  }
  toggleMenu = () => this.setState(state => ({ isMenuOpen: !state.isMenuOpen }))
  render() {
    const { isMenuOpen } = this.state
    return (
      <>
        <Header isMenuOpen={isMenuOpen}>
          <Logo isMenuOpen={isMenuOpen} />
          <MediaQuery bp="small">
            {matches =>
              matches ? (
                <SearchHeader />
              ) : (
                <Hamburger isMenuOpen={isMenuOpen} openMenu={this.toggleMenu} />
              )
            }
          </MediaQuery>
        </Header>
        <MediaQuery bp="small">
          {matches =>
            matches ? null : (
              <>
                <SideNav isMenuOpen={isMenuOpen} toggleMenu={this.toggleMenu} />
                <SearchHeader />
              </>
            )
          }
        </MediaQuery>
      </>
    )
  }
}

export default HeaderContainer

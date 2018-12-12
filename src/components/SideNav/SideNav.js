import React, { Component } from 'react'
import styled from 'react-emotion'
import NetworkInformation from '../NetworkInformation/NetworkInformation'
import Heart from '../Icons/Heart'
import SpeechBubble from '../Icons/SpeechBubble'

import mq from '../../mediaQuery'
// import DogTag from '../Icons/DogTag'
import { Link, withRouter } from 'react-router-dom'

const SideNavContainer = styled('nav')`
  display: ${p => (p.isMenuOpen ? 'block' : 'none')};
  position: fixed;
  z-index: 10000000;
  left: 0;
  top: 50px;
  height: 200px;
  background: black;
  width: 100%;
  padding-left: 20px;
  ${mq.small`
    padding: 0;
    left: 35px;
    top: 100px;
    margin-top: 50px;
    height: auto;
    background: transparent;
    width: 165px;
    display: block;
  `}

  ul {
    padding: 0;
  }
  li {
    list-style: none;
    margin-bottom: 20px;
  }
`

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 200;
  font-size: 22px;
  color: ${p => (p.active ? '#5284FF' : '#C7D3E3')};

  ${mq.small`
    justify-content: start;
  `}

  &:visited {
    color: #c7d3e3;
  }

  span {
    transition: 0.2s;
    margin-left: 15px;
    color: ${p => (p.active ? '#5284FF' : '#C7D3E3')};
  }

  &:hover {
    span {
      color: #5284ff;
    }
    path {
      fill: #5284ff;
    }
  }
`

class SideNav extends Component {
  render() {
    const { path } = this.props.match
    const { isMenuOpen } = this.props
    return (
      <SideNavContainer isMenuOpen={isMenuOpen}>
        <NetworkInformation />
        <ul>
          <li>
            <NavLink active={path === '/favourites'} to="/favourites">
              <Heart active={path === '/favourites'} />
              <span>Favourites</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink active={path === '/my-bids'} to="/my-bids">
              <DogTag active={path === '/my-bids'} />
              <span>My Bids</span>
            </NavLink>
          </li> */}
          <li>
            <NavLink active={path === '/about'} to="/about">
              <SpeechBubble active={path === '/about'} />
              <span>About</span>
            </NavLink>
          </li>
        </ul>
      </SideNavContainer>
    )
  }
}
export default withRouter(SideNav)

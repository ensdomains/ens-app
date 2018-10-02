import React, { Component } from 'react'
import styled from 'react-emotion'
import NetworkInformation from '../NetworkInformation/NetworkInformation'
import Heart from '../Icons/Heart'
import SpeechBubble from '../Icons/SpeechBubble'
// import DogTag from '../Icons/DogTag'
import { Link, withRouter } from 'react-router-dom'

const SideNavContainer = styled('nav')`
  margin-top: 50px;
  width: 165px;
  position: fixed;
  z-index: 1;
  left: 35px;
  top: 100px;
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
  font-weight: 200;
  font-size: 22px;
  color: ${p => (p.active ? '#5284FF' : '#C7D3E3')};

  &:visited {
    color: #c7d3e3;
  }

  &:hover {
    color: #5284ff;
  }

  span {
    margin-left: 15px;
    color: ${p => (p.active ? '#5284FF' : '#C7D3E3')};
  }
`

class SideNav extends Component {
  render() {
    const { path } = this.props.match
    return (
      <SideNavContainer>
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

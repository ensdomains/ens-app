import React, { Component } from 'react'
import styled from 'react-emotion'
import NetworkInformation from '../NetworkInformation/NetworkInformation'
import Heart from '../Icons/Heart'
import SpeechBubble from '../Icons/SpeechBubble'
import QuestionMark from '../Icons/QuestionMark'
import DogTag from '../Icons/DogTag'
import { Link, withRouter } from 'react-router-dom'

const SideNavContainer = styled('nav')`
  li {
    list-style: none;
  }
`

const NavLink = styled(Link)`
  font-weight: 200;
  color: ${p => (p.active ? '#5284FF' : '#C7D3E3')};
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
              <Heart active={path === '/favourites'} />Favourites
            </NavLink>
          </li>
          <li>
            <NavLink active={path === '/my-bids'} to="/my-bids">
              <DogTag active={path === '/my-bids'} />My Bids
            </NavLink>
          </li>
          <li>
            <NavLink active={path === '/about'} to="/about">
              <SpeechBubble active={path === '/about'} />About
            </NavLink>
          </li>
          <li>
            <NavLink active={path === '/how-it-works'} to="/how-it-works">
              <QuestionMark active={path === '/how-it-works'} />How it works
            </NavLink>
          </li>
        </ul>
      </SideNavContainer>
    )
  }
}
export default withRouter(SideNav)

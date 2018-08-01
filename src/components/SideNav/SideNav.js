import React, { Component } from 'react'
import styled from 'react-emotion'
import NetworkInformation from '../NetworkInformation/NetworkInformation'
import Heart from '../Icons/Heart'
import SpeechBubble from '../Icons/SpeechBubble'
import QuestionMark from '../Icons/QuestionMark'
import DogTag from '../Icons/DogTag'
import { Link } from 'react-router-dom'

const SideNavContainer = styled('nav')`
  li {
    list-style: none;
  }

  a {
    font-weight: 200;
    color: #adbbcd;
  }
`

class SideNav extends Component {
  render() {
    return (
      <SideNavContainer>
        <NetworkInformation />
        <ul>
          <li>
            <Link to="/favourites">
              <Heart />Favourites
            </Link>
          </li>
          <li>
            <Link to="/my-bids">
              <DogTag active={true} />My Bids
            </Link>
          </li>
          <li>
            <Link to="/about">
              <SpeechBubble />About
            </Link>
          </li>
          <li>
            <Link to="/how-it-works">
              <QuestionMark />How it works
            </Link>
          </li>
        </ul>
      </SideNavContainer>
    )
  }
}
export default SideNav

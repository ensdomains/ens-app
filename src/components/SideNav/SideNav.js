import React, { Component } from 'react'
import styled from 'react-emotion'
import Heart from '../Icons/Heart'
import SpeechBubble from '../Icons/SpeechBubble'
import QuestionMark from '../Icons/QuestionMark'
import DogTag from '../Icons/DogTag'
import { Link } from 'react-router-dom'

const SideNavContainer = styled('nav')``

class SideNav extends Component {
  render() {
    return (
      <SideNavContainer>
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

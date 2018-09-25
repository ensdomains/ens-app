import React, { Component, Fragment } from 'react'
import styled from 'react-emotion'

import { Title } from '../Typography/Basic'
import DefaultFavourite from '../AddFavourite/Favourite'
import NameDetails from './NameDetails'
import NameAuction from './NameAuction'

const NameContainer = styled('div')`
  background: white;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 6px;
  margin-bottom: 60px;
`

const TopBar = styled('div')`
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ededed;
  box-shadow: 0 2px 4px 0 rgba(181, 177, 177, 0.2);
`

const RightBar = styled('div')``

const Favourite = styled(DefaultFavourite)``

class Name extends Component {
  render() {
    const { details, name, pathname } = this.props
    console.log(details)
    return (
      <NameContainer>
        <TopBar>
          <Title>{name}</Title>
          <RightBar>
            <Favourite domain={details} />
          </RightBar>
        </TopBar>
        {details.state === 'Auction' || details.state === 'Reveal' ? (
          <NameAuction details={details} />
        ) : (
          <NameDetails details={details} pathname={pathname} name={name} />
        )}
      </NameContainer>
    )
  }
}

export default Name

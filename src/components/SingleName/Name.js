import React, { Component } from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import { Title } from '../Typography/Basic'
import DefaultFavourite from '../AddFavourite/Favourite'
import NameDetails from './NameDetails'
import NameAuction from './NameAuction'
import { getPercentTimeLeft, getTimeLeft } from '../../lib/utils'
import QueryAccount from '../QueryAccount'

const NameContainer = styled('div')`
  background: white;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 6px;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;

  &:before {
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    display: block;
    content: '';
    background: ${({ state }) => {
      switch (state) {
        case 'Owned':
          return '#CACACA'
        case 'Auction':
        case 'Reveal':
          return 'linear-gradient(-180deg, #42E068 0%, #52E5FF 100%)'
        case 'Yours':
          return '#52e5ff'
        default:
          return '#CACACA'
      }
    }};
    position: absolute;
  }
`

const TopBar = styled('div')`
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ededed;
  box-shadow: 0 2px 4px 0 rgba(181, 177, 177, 0.2);

  background: ${({ percentDone }) =>
    percentDone
      ? `
  linear-gradient(to right, rgba(128, 255, 128, 0.1) 0%, rgba(82,229,255, 0.1) ${percentDone}%,#ffffff ${percentDone}%)`
      : 'white'};
`

const Owner = styled('div')`
  color: #ccd4da;
  margin-right: 20px;
`

const RightBar = styled('div')`
  display: flex;
  align-items: center;
`

const ToggleLink = styled(Link)`
  font-size: 14px;
  background: ${({ active }) => (active ? '#5384FE' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#D2D2D2')};
  transform: scale(${({ active }) => (active ? '1.08' : '1')});
  transition: background 0.1s ease-out, transform 0.3s ease-out;
  padding: 10px 30px;
  border-radius: 90px;
`

const Toggle = styled('div')`
  display: flex;
  justify-content: flex-start;
  width: 240px;
  border: 1px solid #dfdfdf;
  border-radius: 90px;
`

const Favourite = styled(DefaultFavourite)``

class Name extends Component {
  render() {
    const { details: domain, name, pathname } = this.props
    const timeLeft = getTimeLeft(domain)
    const percentDone = getPercentTimeLeft(timeLeft, domain)
    return (
      <QueryAccount>
        {({ account }) => {
          const isOwner =
            domain.owner && domain.owner.toLowerCase() === account.toLowerCase()
          return (
            <NameContainer state={isOwner ? 'Yours' : domain.state}>
              <TopBar percentDone={percentDone}>
                <Title>{name}</Title>
                <RightBar>
                  {isOwner && <Owner>Owner</Owner>}
                  <Favourite domain={domain} />
                  {(domain.state !== 'Auction' ||
                    domain.state !== 'Reveal') && (
                    <Toggle>
                      <ToggleLink
                        active={pathname === `/name/${name}`}
                        to={`/name/${name}`}
                      >
                        Details
                      </ToggleLink>
                      <ToggleLink
                        active={pathname === `/name/${name}/subdomains`}
                        to={`/name/${name}/subdomains`}
                      >
                        Subdomains
                      </ToggleLink>
                    </Toggle>
                  )}
                </RightBar>
              </TopBar>
              {domain.state === 'Auction' || domain.state === 'Reveal' ? (
                <NameAuction domain={domain} timeLeft={timeLeft} />
              ) : (
                <NameDetails domain={domain} pathname={pathname} name={name} />
              )}
            </NameContainer>
          )
        }}
      </QueryAccount>
    )
  }
}

export default Name

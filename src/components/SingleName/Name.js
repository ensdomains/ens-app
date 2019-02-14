import React from 'react'
import styled from 'react-emotion'

import mq, { useMediaMin } from 'mediaQuery'
import { getPercentTimeLeft, getTimeLeft } from '../../utils/dates'
import { EMPTY_ADDRESS } from '../../utils/records'
import { REGISTER_TESTDOMAIN } from '../../graphql/mutations'
import { Mutation } from 'react-apollo'

import { Title } from '../Typography/Basic'
import DefaultFavourite from '../AddFavourite/Favourite'
import NameDetails from './NameDetails'
import NameAuction from './NameAuction'
import Tabs from './Tabs'
import QueryAccount from '../QueryAccount'
import Button from '../Forms/Button'

const NameContainer = styled('div')`
  background: white;
  box-shadow: 3px 4px 6px 0 rgba(229, 236, 241, 0.3);
  border-radius: 0;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;

  ${mq.small`
    border-radius: 6px;
  `}

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
        case 'Open':
          return '#42E068'
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

const BottomBar = styled('div')`
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-top: 1px solid #ededed;
  box-shadow: 0 2px 4px 0 rgba(181, 177, 177, 0.2);
`

const Note = styled('p')`
`

const Tld = styled('pre')`
  display:inline;
  background-color: #eee;
  padding: 3px;
`

const Owner = styled('div')`
  color: #ccd4da;
  margin-right: 20px;
`

const RightBar = styled('div')`
  display: flex;
  align-items: center;
`

const Favourite = styled(DefaultFavourite)``

function Name({ details: domain, name, pathname, refetch }) {
  const smallBP = useMediaMin('small')
  const timeLeft = getTimeLeft(domain)
  const percentDone = getPercentTimeLeft(timeLeft, domain)
  return (
    <QueryAccount>
      {({ account }) => {
        let isOwner = false
        if (domain.owner !== EMPTY_ADDRESS) {
          isOwner = domain.owner.toLowerCase() === account.toLowerCase()
        }
        return (
          <NameContainer state={isOwner ? 'Yours' : domain.state}>
            <TopBar percentDone={percentDone}>
              <Title>{name}</Title>
              <RightBar>
                {isOwner && <Owner>Owner</Owner>}
                <Favourite domain={domain} />
                {smallBP && <Tabs pathname={pathname} domain={domain} />}
              </RightBar>
            </TopBar>
            {!smallBP && <Tabs pathname={pathname} domain={domain} />}
            {domain.state === 'Auction' || domain.state === 'Reveal' ? (
              <NameAuction domain={domain} timeLeft={timeLeft} />
            ) : (
              <NameDetails
                domain={domain}
                pathname={pathname}
                name={name}
                isOwner={isOwner}
                refetch={refetch}
                account={account}
              />
            )}
            {parseInt(domain.owner) === 0 && domain.name.match(/\.test$/) ? (
              <BottomBar>
              <Mutation
                mutation={REGISTER_TESTDOMAIN}
                onCompleted={data => {
                  // startPending(Object.values(data)[0])
                  refetch()
                }}
              >
              {mutation => (
                <Button
                  onClick={() => {
                    mutation({
                      variables: {
                        label: domain.label
                      }
                    })
                  }
                    // toggleModal({
                    //   name: 'confirm',
                    //   mutation: mutation,
                    //   mutationButton: mutationButton,
                    //   value: value,
                    //   newValue: newValue,
                    //   cancel: () => {
                    //     toggleModal({ name: 'confirm' })
                    //   }
                    // })
                  }
                >
                Claim the test domain
                </Button>
              )}
              </Mutation>
              <Note>Note: <Tld>.test</Tld> domain allows anyone to claim an unused name for test purposes, which expires after 28 days</Note>
              </BottomBar>
            ) : null }
          </NameContainer>
        )
      }}
    </QueryAccount>
  )
}

export default Name

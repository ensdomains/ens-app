import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Bid from './Bid'

export const Open = ({ domainState }) => (
  <Fragment>
    <div>
      <Link to={`/name/${domainState.name}`}>{domainState.name}</Link> is
      available!
    </div>
    <Bid domainState={domainState} />
  </Fragment>
)

export const Auction = ({ domainState }) => (
  <div>
    {domainState.name} is under auction
    <Bid domainState={domainState} />
  </div>
)

export const Owned = ({ domainState, accounts }) => (
  <div>
    <Link to={`/name/${domainState.name}`}>{domainState.name}</Link> is owned by
    {accounts[0] === domainState.owner ? `you!` : domainState.owner}
  </div>
)

export const Forbidden = ({ domainState }) => (
  <div>{domainState.name} is Forbidden!</div>
)

export const Reveal = ({ domainState }) => (
  <div>{domainState.name} is in the reveal stage!</div>
)

export const NotYetAvailable = ({ domainState }) => (
  <div>{domainState.name} is not yet available</div>
)

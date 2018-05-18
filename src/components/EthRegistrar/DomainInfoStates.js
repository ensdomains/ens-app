import React from 'react'
export const Open = ({ domainState }) => (
  <div>{domainState.name} is available!</div>
)

export const Auction = () => <div>Auction</div>

export const Owned = ({ domainState }) => (
  <div>{domainState.name} is owned!</div>
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

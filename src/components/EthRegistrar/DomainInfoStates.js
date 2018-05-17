import React from 'react'
export const Open = ({ domainState }) => (
  <div>{domainState.name} is available!</div>
)

export const Auction = () => <div>Auction</div>

export const Owned = ({ domainState }) => (
  <div>{domainState.name} is owned!</div>
)

export const Forbidden = () => <div />

export const Reveal = () => <div />

export const NotYetAvailable = () => <div />

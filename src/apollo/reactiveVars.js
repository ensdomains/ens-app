import { makeVar } from '@apollo/client'

export const clientReactive = makeVar(null)

export const networkIdReactive = makeVar(1)
networkIdReactive.onNextChange(nextVal => {
  console.log('networkIdReactive: ', nextVal)
  //clientReactive().resetStore()
})

export const web3ProviderReactive = makeVar(null)

export const networkReactive = makeVar(null)
networkReactive.onNextChange(e => console.log('networkReactive: ', e))

export const reverseRecordReactive = makeVar(null)

export const accountsReactive = makeVar(null)
accountsReactive.onNextChange(nextVal => {
  console.log('accountsReactive: ', nextVal)
  //clientReactive().resetStore()
})

export const isReadOnlyReactive = makeVar(true)

export const isRunningAsSafeAppReactive = makeVar(false)

export const detailedNodeReactive = makeVar({
  name: null,
  revealDate: null,
  registrationDate: null,
  migrationStartDate: null,
  currentBlockDate: null,
  transferEndDate: null,
  gracePeriodEndDate: null,
  value: null,
  highestBid: null,
  state: null,
  stateError: null,
  label: null,
  decrypted: null,
  price: null,
  rent: null,
  referralFeePPM: null,
  available: null,
  contentType: null,
  expiryTime: null,
  isNewRegistrar: null,
  isDNSRegistrar: null,
  dnsOwner: null,
  deedOwner: null,
  registrant: null,
  auctionEnds: null
})

export const isENSReady = makeVar(false)

export const favouritesReactive = makeVar([])

export const subDomainFavouritesReactive = makeVar([])

export const isAppReadyReactive = makeVar(false)

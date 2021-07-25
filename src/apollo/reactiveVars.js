import { makeVar } from '@apollo/client'

export const networkIdReactive = makeVar(1)

export const clientReactive = makeVar(null)

export const web3Reactive = makeVar(null)

export const networkReactive = makeVar(null)

export const reverseRecordReactive = makeVar(null)

export const accountsReactive = makeVar(null)
accountsReactive.onNextChange(e => console.log('IIIII', e))

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

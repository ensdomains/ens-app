import { makeVar } from '@apollo/client'

export const clientReactive = makeVar(null)

export const networkIdReactive = makeVar(1)

export const web3ProviderReactive = makeVar(null)

export const networkReactive = makeVar(null)

export const reverseRecordReactive = makeVar(null)

export const accountsReactive = makeVar(null)

export const isReadOnlyReactive = makeVar(true)

export const isRunningAsSafeAppReactive = makeVar(false)

export const isENSReadyReactive = makeVar(false)

export const favouritesReactive = makeVar([])

export const subDomainFavouritesReactive = makeVar([])

export const isAppReadyReactive = makeVar(false)

export const globalErrorReactive = makeVar(null)

export const transactionHistoryReactive = makeVar({ transactionHistory: [] })

export const namesReactive = makeVar([])

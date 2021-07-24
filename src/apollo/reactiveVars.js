import { makeVar } from '@apollo/client'

export const networkIdReactive = makeVar(1)

export const clientReactive = makeVar(null)

export const web3Reactive = makeVar(null)

export const networkReactive = makeVar(null)

export const reverseRecordReactive = makeVar(null)

export const accountsReactive = makeVar(null)

accountsReactive.onNextChange(e => console.log('IIIII', e))

import React from 'react'
import { Redirect } from 'react-router-dom'

import { useAccount } from '../components/QueryAccount'
import Banner from '../components/Banner'
import { emptyAddress } from '../utils/utils'

export default function Renew(props) {
  const account = useAccount()
  if (account !== emptyAddress) {
    return <Redirect to={`/address/${account}?origin=renew`} />
  }
  return (
    <Banner>
      You are here because of a transaction you completed. The reason we sent
      the transaction is to remind you that your ANS names will be expiring
      soon. Please login to your wallet to be redirected to your list of names{' '}
    </Banner>
  )
}

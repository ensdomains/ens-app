import React from 'react'
import seed from '../testing-utils/seedAnalytics'
import Button from '../components/Forms/Button'

export default function TestAnalytics() {
  return <Button onClick={() => seed(10)}>Trigger test referrals</Button>
}

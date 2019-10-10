import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import mq from 'mediaQuery'
import { ExternalButtonLink } from '../Forms/Button'
import jsSHA3 from 'js-sha3'
import BigInt from 'big-integer'

const ShortNameContainer = styled('div')`
  padding: 20px;
  text-align: center;

  ${mq.medium`
    padding: 40px 40px;
  `}
`

const InnerWrapper = styled('div')`
  background: #f0f6fa;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  ${mq.medium`
    flex-direction: row;
    align-items: flex-start;
  `}
  p {
    text-align: left;
    max-width: 500px;
    font-weight: 300;
    line-height: 26px;
    font-size: 18px;
    margin-top: 0;
  }
  ${mq.small`
    padding: 40px 40px;
  `}
`

export default function ShortName({ name }) {
  const [urlReady, setUrlReady] = useState(false)
  const label = name.split('.')[0]
  const labelhash = `${jsSHA3.keccak256(label.toLowerCase())}`
  const bn = BigInt(labelhash, 16)
  const decimalLabelHash = bn.toString(10)
  const link = `https://opensea.io/assets/0xFaC7BEA255a6990f749363002136aF6556b31e04/${decimalLabelHash}`

  useEffect(() => {
    const api = `https://api.opensea.io/misc/ens_short_name_asset/${label}`
    fetch(api).then(() => {
      setUrlReady(true)
    })
  }, [label])

  function openSeaRedirect() {
    const api = `https://api.opensea.io/misc/ens_short_name_asset/${label}`
    fetch(api).then(res => {
      if (res.ok) {
        window.location.href = link
      }
    })
  }

  return (
    <ShortNameContainer>
      <InnerWrapper>
        <p>
          Short names are currently on auction at{' '}
          {urlReady ? (
            <a href={link}>OpenSea</a>
          ) : (
            // eslint-disable-next-line
            <a href="#" onClick={openSeaRedirect}>
              OpenSea
            </a>
          )}
          . 5+ letter auctions end 15-22 October, 4 letter auctions end 22-29
          October, and 3 letter auctions end 29 October - 5 November
        </p>
        {urlReady ? (
          <ExternalButtonLink href={link} type="hollow-primary">
            Bid Now
          </ExternalButtonLink>
        ) : (
          <ExternalButtonLink onClick={openSeaRedirect} type="hollow-primary">
            Bid Now
          </ExternalButtonLink>
        )}
      </InnerWrapper>
    </ShortNameContainer>
  )
}

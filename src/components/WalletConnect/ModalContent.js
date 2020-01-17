import qrImage from 'qr-image'
import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import WC_header_image from '../../assets/WC_header.svg'

const WCheader = styled.div`
  display: flex;

  > img {
    width: 100%;
    max-width: 320px;
    margin: 20px auto;
  }
`

const WCmain = styled.div`
  p {
    color: #7c828b;
    font-family: Avenir;
    font-size: 18px;
    text-align: center;
    margin: 0 auto;
    padding: 0 30px;
  }

  svg {
    width: 100%;
    padding: 30px;
  }
`

export const WCcontent = ({ uri }) => {
  const { size, path } = useMemo(() => qrImage.svgObject(uri), [uri])

  if (!size || !path) return null

  const viewBox = `0 0 ${size} ${size}`

  return (
    <>
      <WCheader>
        <img src={WC_header_image} alt="" />
      </WCheader>
      <WCmain>
        <div>
          <p>Scan QR code with a WalletConnect-compatible wallet</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
            <path d={path} />
          </svg>
        </div>
      </WCmain>
    </>
  )
}

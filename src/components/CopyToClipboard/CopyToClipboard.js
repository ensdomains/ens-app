import React, { useState } from 'react'
import styled from '@emotion/styled'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import copy from './copy.svg'

const HOVER_TIMEOUT = 1000

const CopyContainer = styled('span')`
  margin-left: 5px;
  position: relative;
  &:hover {
    cursor: pointer;
  }
`

const Copied = styled('span')`
  font-size: 16px;
`

export default function Copy({ value }) {
  const [copied, setCopied] = useState(false)
  return (
    <CopyContainer>
      {copied ? (
        <Copied>Copied</Copied>
      ) : (
        <CopyToClipboard
          text={value}
          onCopy={() => {
            setCopied(true)
            setTimeout(() => setCopied(false), HOVER_TIMEOUT)
          }}
        >
          <img src={copy} />
        </CopyToClipboard>
      )}
    </CopyContainer>
  )
}

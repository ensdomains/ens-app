import React, { useState } from 'react'
import styled from '@emotion/styled'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import copy from './copy.svg'

const HOVER_TIMEOUT = 1000

const CopyContainer = styled('div')`
  position: relative;
`

export default function Copy({ value }) {
  const [copied, setCopied] = useState(false)
  return (
    <CopyContainer>
      <CopyToClipboard
        text={value}
        onCopy={() => {
          setCopied(true)
          setTimeout(() => setCopied(false), HOVER_TIMEOUT)
        }}
      >
        <img src={copy} />
      </CopyToClipboard>

      {copied ? <span style={{ color: 'red' }}>Copied.</span> : null}
    </CopyContainer>
  )
}

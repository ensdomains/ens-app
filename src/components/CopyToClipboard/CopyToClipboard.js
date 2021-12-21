import React, { useState } from 'react'
import styled from '@emotion/styled/macro'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const HOVER_TIMEOUT = 1000

const CopyContainer = styled('span')`
  margin: 0 5px;
  position: relative;
  &:hover {
    cursor: pointer;
  }
`

const Copied = styled('span')`
  font-size: 16px;
`

export default function Copy({ value, iconColour }) {
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
          <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg">
            <g fill={iconColour ? iconColour : '#282929'} fillRule="nonzero">
              <path d="M11.937 16H.968C.444 16 0 15.56 0 15.004V.882C0 .392.381 0 .857 0h6.778c.38 0 .682.31.682.702a.687.687 0 01-.682.702h-6.27V14.63h10.27V5.176c0-.392.302-.703.682-.703.381 0 .683.31.683.703v9.746c-.016.588-.492 1.078-1.063 1.078z" />
              <path d="M7.926 6a.864.864 0 01-.64-.259C7.101 5.551 7 5.275 7 4.947V.907h.724H7c0-.155 0-.638.454-.845.169-.07.505-.156.875.207l4.376 4.212c.27.259.37.621.236.95-.118.327-.438.534-.825.534L7.926 6zm.504-3.625v2.14l2.222-.017L8.43 2.375z" />
            </g>
          </svg>
        </CopyToClipboard>
      )}
    </CopyContainer>
  )
}

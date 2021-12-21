import React from 'react'
import styled from '@emotion/styled/macro'

const SVG = styled('svg')``

const Registry = ({ className }) => (
  <SVG
    width="25"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g fill="none" fillRule="evenodd">
      <rect fill="#282929" width="16" height="20" rx="3" />
      <path
        d="M20 15.813a.41.41 0 0 0 .146.309l2 1.75A.537.537 0 0 0 22.5 18a.537.537 0 0 0 .354-.128l2-1.75a.41.41 0 0 0 .146-.31V4h-5v11.813zM22 0h1a2 2 0 0 1 2 2v1h-5V2a2 2 0 0 1 2-2z"
        fill="#282929"
      />
      <rect
        fill="#FFF"
        transform="matrix(1 0 0 -1 0 10)"
        x="2"
        y="4"
        width="8"
        height="2"
        rx="1"
      />
      <rect
        fill="#FFF"
        transform="matrix(1 0 0 -1 0 18)"
        x="2"
        y="8"
        width="8"
        height="2"
        rx="1"
      />
    </g>
  </SVG>
)

export default Registry

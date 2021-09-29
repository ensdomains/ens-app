import React from 'react'
import styled from '@emotion/styled/macro'

const LargeHeartContainer = styled('svg')``

const LargeHeart = () => (
  <LargeHeartContainer
    width="42"
    height="41"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.857 4.453C14.284.518 8.553.518 4.98 4.453l-.336.37C.452 9.44.452 16.984 4.642 21.598l16.16 17.8c.124.135.27.135.393-.001l16.16-17.799c4.194-4.617 4.193-12.156-.002-16.777l-.336-.37c-3.574-3.936-9.3-3.936-12.876 0l-1.373 1.512a2.372 2.372 0 0 1-3.538 0l-1.373-1.511z"
      stroke="#E7E7E7"
      strokeWidth="3"
      fill="none"
      fillRule="evenodd"
      opacity=".7"
    />
  </LargeHeartContainer>
)

export default LargeHeart

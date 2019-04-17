import React from 'react'
import styled from '@emotion/styled'

const LoaderContainer = styled('div')`
  ${p =>
    p.center &&
    `
    width: 100%;
    display: flex;
    justify-content: center;
  `}
  @-webkit-keyframes lds-dual-ring {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes lds-dual-ring {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  .lds-dual-ring {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .lds-dual-ring div {
    position: absolute;
    width: ${({ large }) => (large ? '60px' : '20px')};
    height: ${({ large }) => (large ? '60px' : '20px')};
    top: 0;
    left: 0;
    border-radius: 50%;
    border: ${({ large }) => (large ? '4px' : '2px')} solid #000;
    border-color: #5284ff transparent #5284ff transparent;
    -webkit-animation: lds-dual-ring 1.5s linear infinite;
    animation: lds-dual-ring 1.5s linear infinite;
  }
  .lds-dual-ring {
    width: 20px !important;
    height: 20px !important;
    -webkit-transform: translate(-100px, -100px) scale(1)
      translate(100px, 100px);
    transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
  }
`

const LoaderWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
`

const Loader = props => {
  const { withWrap } = props
  if (withWrap) {
    return (
      <LoaderWrapper>
        <LoaderContainer className="lds-css" {...props}>
          <div className="lds-dual-ring">
            <div />
          </div>
        </LoaderContainer>
      </LoaderWrapper>
    )
  }
  return (
    <LoaderContainer className="lds-css" {...props}>
      <div className="lds-dual-ring">
        <div />
      </div>
    </LoaderContainer>
  )
}

export default Loader

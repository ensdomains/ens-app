import { keyframes } from '@emotion/core'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'
import { Trans } from 'react-i18next'
import { showV3Banner } from 'utils/utils'
import UpRightArrow from './images/UpRightArrow'

const changeKeyframes = keyframes`
  to {
    background-position:
      top -700px left -350px,
      bottom -700px right -350px;
  }
`

const Container = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  --gradient-opacity: 0.15;

  &,
  &::before {
    background:
    /* blue */ radial-gradient(
          40% 40% at center,
          rgba(56, 137, 255, var(--gradient-opacity)),
          transparent
        )
        top -700px right -350px / 1000px 1000px no-repeat,
      /* green */
        radial-gradient(
          40% 40% at center,
          rgba(25, 156, 117, var(--gradient-opacity)),
          transparent
        )
        bottom -700px left -350px / 1000px 1000px no-repeat,
      #f6f6f6;
    animation: ${changeKeyframes} 5s ease-in-out infinite alternate;
  }

  &,
  &:visited {
    color: #262626;
  }

  padding: 16px;
  height: 52px;
  gap: 8px;
  font-weight: bold;

  & > div > b {
    color: #056aff;
  }

  & > svg {
    width: 16px;
    height: 16px;
  }

  position: ${p => (p.$isHome ? 'relative' : 'fixed')};
  z-index: 3;

  &,
  &::before,
  &::after {
    top: 0;
    width: 100%;
    transition: all 0.2s ease-in-out;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0;
  }

  &::before {
    --gradient-opacity: 0.35;
    height: 100%;
    z-index: -1;
  }

  &::after {
    content: '';
    height: 100vh;
    z-index: -2;
    pointer-events: none;
    touch-action: none;
    transition-duration: 0.1s;
    backdrop-filter: brightness(1) blur(0);
  }

  &:hover::before,
  &:hover::after {
    transition-duration: 0.35s;
    opacity: 1;
  }

  &:hover::after {
    transition-delay: 0.05s;
    backdrop-filter: brightness(0.8) blur(4px);
  }

  &:hover,
  &:hover > div > b {
    color: #3889ff;
  }

  ${mq.medium`
    padding: 24px;
    height: 68px;
  `}
`

export const V3BannerContainer = Container

export function V3Banner({ isHome }) {
  if (!showV3Banner) return null

  return (
    <Container $isHome={isHome} as="a" href="https://app.ens.domains">
      <div>
        <Trans
          i18nKey="banners.v3"
          components={{
            b: <b />
          }}
        />
      </div>
      <UpRightArrow />
    </Container>
  )
}

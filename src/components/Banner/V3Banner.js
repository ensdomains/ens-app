import { keyframes } from '@emotion/core'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'
import { Trans } from 'react-i18next'
import { V3_MANAGER_URL } from 'utils/utils'
import Exclamation from './images/Exclamation'
import Outlink from './images/Outlink'

const Container = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  background-color: #fff5cd;
  color: black !important;
  text-align: center;

  padding: 16px;
  gap: 8px;
  position: relative;

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

  &:vistied {
    color: black;
  }

  ${mq.large`
    padding: 24px;
    height: 68px;
    flex-direction: row
  `}
`

const LinkContainer = styled.div`
  & > svg {
    width: 16px;
    height: 16px;
    margin-top: -4px;
  }

  & > b {
    color: #056aff;
  }

  align-items: center;
  display: flex;
  gap: 4px;
`

const WarningContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;

  ${mq.large`
    flex-direction: row
  `}
`

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  flex-direction: column;

  ${mq.medium`
    flex-direction: row
  `}

  ${mq.large`
    flex-direction: row
  `}
`

export const V3BannerContainer = Container

export function V3Banner({ isHome }) {
  return (
    <Container $isHome={isHome} as="a" href={V3_MANAGER_URL}>
      <WarningContainer>
        <div style={{ minWidth: 20, minHeight: 20, marginBottom: -3 }}>
          <Exclamation />
        </div>
        <TextContainer>
          <Trans
            i18nKey="banners.v3.text"
            components={{
              b: <b />
            }}
          />
          {/* <Trans
          i18nKey="banners.v3.risk"
        /> */}
        </TextContainer>
      </WarningContainer>
      <LinkContainer>
        <Trans
          i18nKey="banners.v3.link"
          components={{
            b: <b />
          }}
        />
        <Outlink />
      </LinkContainer>
    </Container>
  )
}

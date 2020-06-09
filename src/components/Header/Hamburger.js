import React from 'react'
import styled from '@emotion/styled/macro'

const HamburgerContainer = styled('div')`
  background: white;
  ${p =>
    p.isMenuOpen
      ? `
    background: #121D46;
  `
      : ''}

  button {
    &:focus {
      outline: 0;
    }
  }

  .hamburger {
    padding: 8px 0 15px 15px;
    display: inline-block;
    cursor: pointer;
    transition-property: opacity, filter;
    transition-duration: 0.15s;
    transition-timing-function: linear;
    font: inherit;
    color: inherit;
    text-transform: none;
    background-color: transparent;
    border: 0;
    margin: 0;
    overflow: visible;
    &:is-active {
      padding-top: 15px;
    }
  }
  .hamburger:hover {
    opacity: 0.7;
  }

  .hamburger-box {
    width: 40px;
    height: 24px;
    display: inline-block;
    position: relative;
  }

  .hamburger-inner {
    display: block;
    top: 50%;
    margin-top: -2px;
  }
  .hamburger-inner,
  .hamburger-inner::before,
  .hamburger-inner::after {
    width: 30px;
    height: 1px;
    background-color: #000;
    border-radius: 4px;
    position: absolute;
    transition-property: transform;
    transition-duration: 0.15s;
    transition-timing-function: ease;
  }

  .hamburger-inner::before,
  .hamburger-inner::after {
    content: '';
    display: block;
  }

  .hamburger-inner::after {
    content: '';
    display: none;
  }

  .hamburger-inner::before {
    top: -10px;
  }
  .hamburger-inner::after {
    bottom: -10px;
  }

  .hamburger--collapse-r .hamburger-inner {
    top: auto;
    bottom: 0;
    transition-duration: 0.13s;
    transition-delay: 0.13s;
    transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  .hamburger--collapse-r .hamburger-inner::after {
    top: -20px;
    transition: top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1),
      opacity 0.1s linear;
  }
  .hamburger--collapse-r .hamburger-inner::before {
    transition: all 0.12s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1),
      transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  .hamburger--collapse-r.is-active .hamburger-inner {
    transform: translate3d(0, -10px, 0) rotate(45deg);
    transition-delay: 0.22s;
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  .hamburger--collapse-r.is-active .hamburger-inner::after {
    top: 0;
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
      opacity 0.1s 0.22s linear;
  }
  .hamburger--collapse-r.is-active .hamburger-inner::before {
    top: 0;
    transform: rotate(90deg);
    transition: all 0.1s 0.16s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
      transform 0.13s 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  .hamburger--collapse-r.is-active .hamburger-inner,
  .hamburger--collapse-r.is-active .hamburger-inner::after,
  .hamburger--collapse-r.is-active .hamburger-inner::before {
    background: #fff;
  }
`

const Hamburger = ({ isMenuOpen = false, openMenu }) => (
  <HamburgerContainer isMenuOpen={isMenuOpen}>
    <div className="mobile-nav">
      <button
        className={`hamburger hamburger--collapse-r ${
          isMenuOpen ? 'is-active' : ''
        }`}
        type="button"
        onClick={openMenu}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner" />
        </span>
      </button>
    </div>
  </HamburgerContainer>
)

export default Hamburger

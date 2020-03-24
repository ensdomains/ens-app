import React from 'react'
import styled from '@emotion/styled'

import mq from 'mediaQuery'

export const Tab = styled('div')`
  font-size: 14px;
  background: ${({ active }) => (active ? '#5384FE' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#D2D2D2')};
  transform: scale(${({ active }) => (active ? '1.02' : '1')});
  transition: background 0.1s ease-out, transform 0.3s ease-out;
  padding: 10px 30px;
  border-radius: 90px;
  &:hover,
  &:visited {
    cursor: pointer;
    color: ${({ active }) => (active ? 'white' : '#D2D2D2')};
  }
`

export const Tabs = styled('div')`
  display: flex;
  justify-content: flex-start;
  width: 240px;
  border: 1px solid #dfdfdf;
  border-radius: 90px;
`

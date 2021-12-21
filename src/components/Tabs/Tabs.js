import React from 'react'
import styled from '@emotion/styled/macro'

export const Tab = styled('div')`
  font-size: 14px;
  background: ${({ active }) => (active ? '#282929' : 'transparent')};
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

export const TabsContainer = styled('div')`
  display: inline-flex;
  justify-content: flex-start;
  border: 1px solid #dfdfdf;
  border-radius: 90px;
`

export const Tabs = props => {
  return (
    <div>
      <TabsContainer>{props.children}</TabsContainer>
    </div>
  )
}

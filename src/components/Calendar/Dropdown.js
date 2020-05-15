import React from 'react'
import { css } from 'emotion'

const dropdownStyles = css`
  position: absolute;
  bottom: 100%;
  left: 0;
  padding: 10px;
  border: 1px solid #e5e5e5;
  width: 150px;
  background-color: #fff;
  margin: 0 auto;
  margin-bottom: 10px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`

export default function Dropdown({ children }) {
  return <div className={dropdownStyles}>{children}</div>
}

import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { SingleNameBlockies } from '../SingleName/SingleNameBlockies'

const DomainLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 30px 0;
  color: #2b2b2b;
  font-size: 22px;
  font-weight: 100;
  border-bottom: 1px dashed #d3d3d3;

  &:last-child {
    border: none;
  }
`

export default function ChildDomainItem({
  name,
  labelhash,
  owner,
  labelName,
  parent
}) {
  return (
    <DomainLink key={name} to={`/name/${name}`}>
      <SingleNameBlockies imageSize={24} address={owner} />
      {labelName !== null
        ? `${name}`
        : `[unknown${labelhash.slice(2, 10)}].${parent}`}
    </DomainLink>
  )
}

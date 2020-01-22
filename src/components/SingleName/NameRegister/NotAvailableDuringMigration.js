import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as ExternalLinkIcon } from '../../Icons/externalLink.svg'

const NotAvailableContainer = styled('div')`
  padding: 30px 40px;
`

const EtherScanLinkContainer = styled('span')`
  display: inline-block;
  transform: translate(25%, 20%);
`
const LinkToLearnMore = styled('a')`
  margin-right: ${props => (props.outOfSync ? '' : '2em')};
  letter-spacing: 0.58px;
  float: right;
  min-width: 130px;
`

const Message = styled('div')`
  background: hsla(37, 91%, 55%, 0.1);
  color: #2b2b2b;
  font-size: 20px;
  padding: 20px;
  font-weight: 300;
`

export default function NotAvailable({ domain }) {
  return (
    <NotAvailableContainer>
      <Message>
        We are currently undergoing critical migration work and the registration
        of new names is disabled until the migration ends.
        <LinkToLearnMore href="" target="_blank">
          Learn More{' '}
          <EtherScanLinkContainer>
            <ExternalLinkIcon />
          </EtherScanLinkContainer>
        </LinkToLearnMore>
      </Message>
    </NotAvailableContainer>
  )
}

import React from 'react'
import styled from '@emotion/styled'
import { ExternalButtonLink } from '../Forms/Button'

const WarningBox = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 100;
  color: #2b2b2b;
  padding: 20px 35px;
  background: hsla(37, 91%, 55%, 0.1);
  margin-bottom: 20px;
`

const WarningContent = styled('div')`
  width: calc(100% - 150px);
`

const LearnMore = styled(ExternalButtonLink)`
  flex: 2 1 auto;
`

export default function MigrationWarning() {
  return (
    <WarningBox>
      <WarningContent>
        The parent of this subdomain (yourname.eth) needs to migrate their
        resolver. Until they do so, this name can not be used or traded.
      </WarningContent>
      <LearnMore type="hollow-primary" href="#">
        Learn More
      </LearnMore>
    </WarningBox>
  )
}

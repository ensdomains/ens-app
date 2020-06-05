import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

const Container = styled('div')`
  padding: 0;
  margin: 0 auto 0;

  ${mq.medium`
    padding: 0 40px 0;
  `}
`

export default Container

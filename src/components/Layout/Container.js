import styled from 'react-emotion'
import mq from '../../mediaQuery'

const Container = styled('div')`
  padding: 0;
  margin: 0 auto 0;

  ${mq.small`
    padding: 0 40px 0;
  `}
`

export default Container

import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'
import bg from '../../assets/background.png'

const Container = styled('div')`
  background: #00000000;
  padding: 0;
  margin: 0 auto 0;

  ${mq.medium`
    padding: 0 40px 0;
  `}
`

export default Container

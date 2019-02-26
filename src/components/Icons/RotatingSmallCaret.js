import styled from 'react-emotion'
import { ReactComponent as DefaultSmallCaret } from './SmallCaret.svg'

const RotatingSmallCaret = styled(DefaultSmallCaret)`
  flex-shrink: 0;
  transform: ${p => (p.rotated ? 'rotate(0)' : 'rotate(-90deg)')};
  transition: 0.2s;
`

export default RotatingSmallCaret

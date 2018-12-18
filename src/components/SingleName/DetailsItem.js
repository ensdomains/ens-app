import styled from 'react-emotion'
import mq from 'mediaQuery'

export const DetailsItem = styled('div')`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  margin-bottom: 20px;

  ${mq.small`
    margin-bottom: 10px;
  `}

  ${p =>
    p.uneditable
      ? mq.small`
    flex-direction: row;
  `
      : mq.small`flex-direction: column;`}
`

export const DetailsKey = styled('div')`
  color: ${({ greyed }) => (greyed ? '#CCD4DA' : '2b2b2b')};
  font-size: 14px;
  letter-spacing: 0px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 20px;
  flex-shrink: 0;

  ${mq.small`
    font-size: 16px;
    max-width: 220px;
    min-width: 180px;
  `}
`

export const DetailsValue = styled('div')`
  font-size: 14px;
  font-weight: 100;
  font-family: Overpass Mono;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${mq.small`
    font-size: 18px;
  `}
  ${p =>
    p.editable &&
    mq.small`
      padding-right: 150px;
    `}
  ${p => p.editableSmall && `padding-right: 50px;`}
`

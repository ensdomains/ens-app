import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

export const DetailsItem = styled('div')`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  margin-bottom: 20px;

  ${mq.small`
    align-items: center;
    margin-bottom: 20px;
  `}

  ${p =>
    p.uneditable
      ? mq.small`
    flex-direction: row;
  `
      : mq.small`flex-direction: row;`}
`

export const DetailsKey = styled('div')`
  color: ${({ greyed }) => (greyed ? '#CCD4DA' : '2b2b2b')};
  font-size: 14px;
  letter-spacing: 0px;
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;
  display: flex;
  margin-bottom: 20px;

  ${mq.small`
    align-items: center;
    margin-bottom: 0;
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
  display: inline-flex;
  text-overflow: ellipsis;
  ${mq.small`
    font-size: 18px;
    align-items: center;
  `}
  ${p =>
    p.editing &&
    p.editable &&
    mq.small`
      padding-right: 5px;
    `}

  a {
    display: flex;
    overflow: hidden;
  }
`
/* Container element for key/value */
export const DetailsContent = styled('div')`
  display: flex;
  justify-content: flex-start;
  position: relative;
  flex-direction: column;
  width: 100%;
  ${({ editing }) => editing && 'margin-bottom: 30px'};
  transition: 0.3s;
  ${mq.small`
    flex-direction: row;
    align-items: center;
  `}
`

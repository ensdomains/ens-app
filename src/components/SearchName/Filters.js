import React from 'react'
import styled from '@emotion/styled/macro'
import Checkbox from '../Forms/Checkbox'
import Radio from '../Forms/Radio'

const FiltersContainer = styled('div')`
  padding: 27px;
  transform-origin: top right;
  transform: ${props =>
    props.show ? 'scale(1) translate(0,0)' : 'scale(0.5) translate(0,-50px)'};
  opacity: ${props => (props.show ? '1' : '0')};
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
  background: white;
  border-radius: 10px;
  width: 300px;
  position: absolute;
  top: 100%;
  right: 162px;
  margin-top: 10px;
`

const H3 = styled('h3')`
  text-transform: uppercase;
  color: #b7c5d7;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 10px;
`

const Section = styled('section')`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`

function Filters() {
  return (
    <FiltersContainer show={this.props.show}>
      <Section>
        <H3>Search Domains</H3>
        <Checkbox name="top-level-names" checked={false}>
          Top level names
        </Checkbox>
        <Checkbox name="subdomains" checked={true}>
          subdomains
        </Checkbox>
      </Section>
      <Section>
        <H3>Unavailable Names</H3>
        <Radio name="Unavailable Names" options={['show', 'hide']} />
      </Section>
      <Section>
        <H3>Price</H3>
        <Radio name="Price" options={['all', 'free']} />
      </Section>
    </FiltersContainer>
  )
}

export default Filters

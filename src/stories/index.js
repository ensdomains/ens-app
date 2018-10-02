import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import '../globalStyles'

import { Button, Welcome } from '@storybook/react/demo'

import DomainItem from '../components/DomainItem/DomainItem'

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
))

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))

storiesOf('DomainItem', module)
  .add('Top Level Domain Available/Open', () => (
    <DomainItem
      domain={{
        name: 'vitalik.eth',
        state: 'Open'
      }}
    />
  ))
  .add('Top Level Domain Owned', () => (
    <DomainItem
      domain={{
        name: 'vitalik.eth',
        state: 'Owned'
      }}
    />
  ))
  .add('Top Level Domain Auction - Bidding', () => (
    <DomainItem
      domain={{
        name: 'vitalik.eth',
        state: 'Auction'
      }}
    />
  ))
  .add('Top Level Domain Auction - Reveal', () => (
    <DomainItem
      domain={{
        name: 'vitalik.eth',
        state: 'Reveal'
      }}
    />
  ))
  .add('Sub Domain Result', () => (
    <DomainItem
      domain={{
        name: 'awesome.vitalik.eth',
        state: 'Open',
        price: 0.2
      }}
      isSubdomain={true}
    />
  ))

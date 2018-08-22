import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import '../globalStyles'

import { Button, Welcome } from '@storybook/react/demo'

import DomainItem from '../components/Results/DomainItem'

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
  .add('Top Level Domain', () => (
    <DomainItem
      domain={{
        name: 'vitalik.eth',
        state: 'Available'
      }}
    />
  ))
  .add('Sub Domain Result', () => (
    <DomainItem
      domain={{
        name: 'awesome.vitalik.eth',
        state: 'Available',
        price: 0.2
      }}
      isSubdomain={true}
    />
  ))

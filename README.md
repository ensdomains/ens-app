# ENS Application

ENS Application

## Installation

```bash
yarn install
yarn start
```

Open your browser at localhost:3000 and open metamask

## Unit Testing

All tests are run with Jest for both the front-end application and testing blockchain functionality. For blockchain based tests it uses `ganache-cli` by default. If you want to see the transactions in the Ganache GUI, you can change the environment in the test file from `GANACHE_CLI` to `GANACHE`. Then you can open Ganache on your computer and test manually after the test runner deploys the contracts.

To run the tests:

```
npm test
```

To speed up the tests, the contracts are compiled before the tests. If you need to update the solidity code, you can run `npm run compile` to recompile the code. Alternatively you can uncomment the code that compiles the contracts in the tests, which will slow down the tests considerably.

### Troubleshooting tests

If you get this error:

```bash
$ npm test

> ens-app@0.1.0 test /Users/youruser/drive/projects/ens-app
> react-scripts test --env=jsdom

2018-05-23 09:17 node[85833] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
2018-05-23 09:17 node[85833] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
events.js:136
      throw er; // Unhandled 'error' event
      ^

Error: Error watching file for changes: EMFILE
    at _errnoException (util.js:999:13)
    at FSEvent.FSWatcher._handle.onchange (fs.js:1374:9)
npm ERR! Test failed.  See above for more details.
```

Try installing watchman on OSX by doing:

```bash
brew uninstall watchman
brew install watchman
```

## Styling

Styling in this app is done with Emotion, with `styled` components style CSS. We do not use `css` or classNames, unless we are [passing through the styles to a component](https://emotion.sh/docs/styled#styling-any-component)

### Media Queries

The main way to use media queries is with the helper function `mq` located in the root at `mediaQuery`. We have absolute URL support, so you can just import it directly as `mediaQuery`. It has properties for all the breakpoints supported by our app. We also have a `useMediaMin` hook, which we plan to roll out to replace the render prop version when we can convert all our components to functional components.

Currently supported breakpoints:

```js
const breakpoints = {
  small: 576,
  medium: 768,
  large: 992,
  xLarge: 1200
}
```

You can use it as follows:

```js
import styled from '@emotion/styled'
import mq from 'mediaQuery'

const SomeComponent = styled('div')`
  font-size: 14px;
  ${mq.small`
    font-size: 22px;
  `}
`
```

The second way is using hooks, which uses `useEffect` and `useState` underneath. This must be used with functional components.

```js
import { useMediaMin } from './mediaQuery'

function Component(){
  const mediumBP = useMediaMin('medium')
  return <>
    {mediumBP ? <LargeComponent /> : <SmallComponent />}
  <>
}
```

## Using the Address component

You can basically call it from any component as stand-alone on any app.

```js
import styled from '@emotion/styled'
import mq from 'mediaQuery'


const Blockies = styled(SingleNameBlockies)`
  position: absolute;
  top: 40%;
  left: -10px;
`

const AutoComplete = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  position: relative;
  z-index: 10000;
  height: 90px;

  ${mq.medium`
      width: calc(100% - 162px);
      font-size: 28px;
  `}
  input {
    padding: 20px 0 0 40px;
    width: 100%;
    border: none;
    border-radius: 0;
    font-size: 18px;
    font-family: Overpass;
    font-weight: 100;
    ${mq.medium`
      width: calc(100% - 20px);
      font-size: 28px;
    `}

    &:focus {
      outline: 0;
    }

    &::-webkit-input-placeholder {
      color: #ccd4da;
    }
  }

  .address,
  .searching {
    font-size: 18px;
    padding: 0 0 0 40px;
    font-family: Overpass;
    font-weight: 100;
  }
  .error {
    color: #cc0000;
    font-size: 18px;
    padding: 0 0 0 40px;
    font-family: Overpass;
    font-weight: 100;
  }
`

const className = {
  Blockies,
  AutoComplete,
}

<Address
  className={className}
  provider={web3.givenProvider}
  placeholder="Search with ETH Address and ENS Names"
  onComplete={msg => YourMethodHandler(msg)}/>

```

### Props definition

The provider is a web3 provider that is passed down to the Address component to use to resolve the inputs provided.

ClassName is used to pass styles down to the component from the parent component.
You can rewrite the css to suite your UI.
I highly recommend using styled-components so that you can have the elements named same as what we have here.

Placeholder is optional. If it is not provided, don't worry there is a default placeholder title.

The onComplete props is passed down to the Address Component so that the address component can send message back to the parent component as events happen

See localhost:<YOUR_PORT_NUMBER>/demo to view this component in action

## End to end Testing

The ENS app has end to end tests with Cypress. To run them you need to start ganache, run the seed script, run the app and then run cypress. This should start chrome and the Cypress GUI. Each time the test run, the script needs to be re-run and the app restarted for it to work.

```bash
ganache-cli
```

```bash
yarn run preTest
```

```bash
yarn start
```

```bash
yarn run cypress:open
```

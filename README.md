# ENS Application

ENS Application

## Installation

### Manual

```shell
$> git clone https://github.com/ensdomains/ens-app.git
$> cd ens-app
$> yarn install
$> yarn start
```

Open your browser at localhost:3000 and open metamask.

To start the ipfs-enabled build:

```bash
yarn start:ipfs
```

The main difference of the ipfs-build is that it uses HashRouter instead of BrowserRouter and makes sure all links are relative.

### Docker

Startup ganache

```bash
ganache-cli
```

Start docker

```
yarn docker:start
```

Open your browser to localhost:80 and open metamask

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

## End to end Testing

The main package for the E2E tests is `ensdomains/mock`, which exposes a script that will prepopulate ganache with ENS so you have everything setup to run Cypress on.

The ENS app has end to end tests with Cypress. To run them you need to start ganache, run the seed script, run the app and then run cypress. This should start chrome and the Cypress GUI. Each time the test run, the script needs to be re-run and the app restarted for it to work.

```bash
ganache-cli
```

```bash
yarn run preTest
```

This runs the app in local ganache mode:

```bash
yarn start:test
```

```bash
yarn run cypress:open
```

To test the ipfs-build use the respective ":ipfs"-variants of the scripts:

```bash
yarn start:test:ipfs
```

```bash
yarn run cypress:open:ipfs
```

## Setting up subgraph

Subgraph is used to list subdomains and all the names you have registered.

### Prerequisite

Get ens subgraph

```
git clone https://github.com/graphprotocol/ens-subgraph
cd ens-subgraph
yarn
```

Get graph-node

```
git clone https://github.com/graphprotocol/graph-node
```

From now on, we assume that `graph-node`, `ens-app`, and `ens-subgraph` all exist under the same directory

### Start ganache

```
ganache-cli
```

### Download and start docker

Download and start [docker](https://www.docker.com/) first

### Start thegraph node

This starts up docker with ipfs, postgresdb, and the-graph node.

```
cd graph-node/docker
docker-compose up
```

### Deploy ENS contracts and update subgraph.yml

```
cd ens-app
yarn preTest
yarn subgraph
```

`subgraph` job updates ENS contract addresses and updates environment from `mainnet` to `dev`

### Deploy ENS subgraph

### Generate deployment code

```
cd ../ens-subgraph
yarn
yarn codegen
```

### Deploy

```
yarn create-local
yarn deploy-local
```

NOTE: If it raises error, try to delete `graph-node/docker/data` and startup the docker again.

#### Confirm that you can query from browser

<img width="1000" alt="Screenshot 2019-07-17 at 11 34 59" src="https://user-images.githubusercontent.com/2630/61370435-4fd7b280-a88a-11e9-80e6-ba6d5e13d0ee.png">

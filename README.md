# ENS Application

ENS Application

## Installation

```bash
yarn install
yarn start
```

Open your browser at localhost:3000 and open metamask

## Testing

All tests are run with Jest for both the front-end application and testing blockchain functionality. For blockchain based tests it uses `ganache-cli` by default. If you want to see the transactions in the Ganache GUI, you can change the environment in the test file from `GANACHE_CLI` to `GANACHE`. Then you can open Ganache on your computer and test manually after the test runner deploys the contracts.

To run the tests:

```
npm test
```

To speed up the tests, the contracts are compiled before the tests. If you need to update the solidity code, you can run `npm run compile` to recompile the code. Alternatively you can uncomment the code that compiles the contracts in the tests, which will slow down the tests considerably.

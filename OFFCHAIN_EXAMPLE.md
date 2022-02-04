## Demo

https://offchainexample.surge.sh/name/offchainexample.eth/details

Please connect to Ropsten and you should see address, email, and description fetched from
https://offchain-resolver-example.uc.r.appspot.com/ . You can also see the same results fromits subdomains such as https://offchainexample.surge.sh/name/1.offchainexample.eth/details

## How to run it locally

1. Set up ENS app

```
git clone https://github.com/ensdomains/ens-contracts.git
cd ens-contracts && yarn && yarn link && yarn build && cd ..
git clone https://github.com/ensdomains/ui.git
cd ui && yarn && yarn link && yarn link @ensdomains/ens-contracts && yarn build && cd ..
git clone https://github.com/ensdomains/mock.git
cd mock && yarn && yarn link && yarn link @ensdomains/ens-contracts && yarn build && cd ..
git clone https://github.com/ensdomains/ens-app.git
cd ens-app && yarn && yarn link @ensdomains/ens-contracts @ensdomains/ui @ensdomains/mock
```

2. Setup local node

```
git clone https://github.com/ensdomains/offchain-resolver.git
cd offchain-resolver
cd packages/contracts
yarn
npx hardhat node
```

Take notes of ENS registry contract address and the private key of the first account

3. Start gateway server
   In differnt terminal

```
cd offchain-resolver
cd packages/gateway
yarn
```

Update .env with the following info

```
OFFCHAIN_DATA=src/offchainexample.eth.json
OFFCHAIN_PRIVATE_KEY=$PRIVATE_KEY_OF_THE_FIRST_ACCOUNT
OFFCHAIN_PORT=8000
OFFCHAIN_TTL=100000000
```

NOTE: Made OFFCHAIN_TTL super long to prevent timeout because our local app time trip to future when creating the seed data

Start the gateway server

```
yarn start
```

4. Run seed data and start server in local mode

```
cd .. && cd ens-app
yarn preTest
yarn start:test
```

5. Browse http://localhost:8000/name/1.offchainexample.eth/details

## How to deploy to hosted environment (on Google App Engine)

1. Deploy gateway server

```
cd offchain-resolver
cd packages/gateway
```

Update .env with the following info

```
OFFCHAIN_DATA=src/offchainexample.eth.json
OFFCHAIN_PRIVATE_KEY=$DEPLOYER_KEY
OFFCHAIN_PORT=8000
OFFCHAIN_TTL=300
```

After setup your Google app engine, run the followings

```
gcloud app deploy
```

Take notes of the deployment url

2. Deploy OffchainResolver contract

Edit `GATEWAY_HOST` at resolver/00_offchain_resolver.js to the url you just deployed

Deploy

```
cd ens-contracts
INFURA_ID=$INFURA_ID DEPLOYER_KEY=$DEPLOYER_KEY OWNER_KEY=$DEPLOYER_KEY npx hardhat --network ropsten deploy --tags offchainexample
```

Update `arguments.js` to the gateway url and verifier address (Use the address generated with the \$DEPLOYER_KEY)

Verify on etherscan

```
INFURA_ID=$INFURA_ID ETHERSCAN_API_KEY=$ETHERSCAN_API_KEY npx hardhat verify --constructor-args arguments.js --network ropsten $OFFCHAIN_RESOLVER_ADDRESS
```

# Reusable functions and components for the ENS apps

Most functions in this library are async functions and therefore return promises which can be awaited or chained with `.then`.

## Contents

- Registry and Resolvers

  - [setupENS()](#async-function-setupensoptions-void)
  - [getOwner()](#async-function-getownername-address)
  - [getResolver()](#async-function-getresolvername-address)
  - [getTTL()](#async-function-getttlname-number)
  - [getOwnerWithLabelhash()](#async-function-getownerwithlabelhashlabelhash-nodehash-address)
  - [getResolverWithLabelhash()](#async-function-getresolverwithlabelhashlabelhash-nodehash-address)
  - [getAddress()](#async-function-getaddressname-address)
  - [getAddr()](#async-function-getaddrname-key-address)
  - [getContent()](#async-function-getcontentname-contenthash)
  - [getText()](#async-function-gettextname-key-value)
  - [getName()](#async-function-getnameaddress-name)
  - [getSubdomains()](#async-function-getsubfomains-address)
  - [setSubnodeOwner()](#async-function-setsubnodeownername-newowner-transactionresponse)
  - [setSubnodeRecord()](#async-function-setsubnoderecordname-newowner-resolver-transactionresponse)
  - [setResolver()](#async-function-setresolvername-resolver-transactionresponse)
  - [setAddress()](#async-function-setaddressname-address-transactionresponse)
  - [setAddr()](#async-function-setaddrname-key-address-transactionresponse)
  - [setContent() DEPRECATED](#async-function-setcontentname-content-transactionresponse-deprecated)
  - [setContenthash()](#async-function-setcontenthashname-content-transactionresponse)
  - [setText()](#async-function-settextname-key-value-transactionresponse)
  - [checkSubdomain()](#async-function-checksubdomainlabel-name-boolean)
  - [createSubdomain()](#async-function-createsubdomainlabel-name-transactionresponse)
  - [deleteSubdomain()](#async-function-deletesubdomainlabel-name-transactionresponse)
  - [claimAndSetReverseRecord()](#async-function-claimandsetreverserecordnamename-transactionresponse)
  - [setReverseRecord](#async-function-setreverserecordnamename-transactionresponse)
  - [getDomainDetails](#async-function-getdomaindetailsname-transactionresponse)
  - [getSubdomains](#async-function-getsubdomainsname-arraysubdomain)

- [Transaction Response](#transaction-response)

## Setup

Setup for the library is done by calling the `setupENS` function. It can be optionally provided with a customProvider and an ENS address. Generally you won't need this unless you are running ganache.

It will return an object with the registrar and ens object. The ens object will deal with name resolution, reverse records and dealing with the registry. The registrar object has functions to interact the permanent registrar, legacy auction registrar and test registrar (just on test net)

```js
import { setupENS } from '@ensdomains/ui'

window.addEventListener('load', async () => {
  const { registrar, ens } = await setupENS()
  const owner = await ens.getOwner('resolver.eth')
  // will instantiate with window.web3/window.ethereum if found, read-only if not.
  // Once setup has finished you can now call functions off the library
})
```

## API

### `async function setupENS(options): void`

setupENS must be called before anything other function in this library. We recommend calling it in a window.load event to make sure that your web3 object has loaded. You can provide a custom provider yourself, but by default it will look for `window.web3` or `window.ethereum` if you do not give it a provider. We use the custom provider when we need to run automated tests with ganache. You can also it pass it the registry address, but by default it will derive the network you are on and instantiate ENS using that network's registry. You only need to provider it with an ens address if you are on a private network.

#### Arguments

```
options (object): {
  customProvider (object): Provider object from web3 (optional)
  ensAddress (String): Address of the ENS registry (optional)
}
```

#### Example

```js
import { setupENS } from '@ensdomains/ui'

window.addEventListener('load', async () => {
  const { ens, registrar } = await setupENS()
})
```

### `async function getOwner(name): Address`

#### Arguments

name (String): An ENS name (e.g: vitalik.eth)

#### Returns

owner (address): Ethereum address of the owner on the registry

#### Example

```js
const name = 'vitalik.eth'
const owner = await ens.getOwner(name)
// 0x123...
```

### `async function getResolver(name): Address`

#### Arguments

name (String): An ENS name (e.g: vitalik.eth)

#### Returns

owner (address): Ethereum address of the resolver contract

#### Example

```js
import ens from 'ens'
const owner = await ens.getResolver('vitalik.eth')
// 0x123...
```

### `async function getTTL(name): Number`

#### Arguments

name (String): An ENS name (e.g: vitalik.eth)

#### Returns

ttl (number): Returns the caching time-to-live of the name specified by node. Systems that wish to cache information about a name, including ownership, resolver address, and records, should respect this value. If TTL is zero, new data should be fetched on each query.

#### Example

```js
import ens from 'ens'
const ttl = await ens.getTTL('resolver.eth')
// 12345
```

### `async function getOwnerWithLabelHash(labelHash, nodeHash): Address`

#### Arguments

labelHash (String): Sha3 hash of the label e.g vitalik (vitalik.eth)
nodeHash (String): Namehash of the rest of the name (minus the label) e.g eth (vitalik.eth)

#### Returns

owner (address): Ethereum address of the resolver contract

#### Example

```js
import ens from 'ens'
const owner = await ens.getOwnerWithLabelHash(labelHash, nodeHash)
// 0x123...
```

### `async function getResolverWithLabelHash(labelHash, nodeHash): Address`

#### Arguments

labelHash (String): Hash of the label e.g vitalik (vitalik.eth)
nodeHash (String): Hash of the rest of the name (minus the library) e.g eth (vitalik.eth)

#### Returns

resolver (address): Ethereum address of the resolver contract

#### Example

```js
const resolver = await ens.getResolverWithLabelHash(labelHash, nodeHash)
// 0x123...
```

### `async function getAddress(name): Address`

This function will call the resolver to get the address, if it cannot find a resolver, it will return `0x000...` as a fallback

#### Arguments

name (String): An ENS name (e.g: vitalik.eth)

#### Returns

address (address): An Ethereum address that was set on the resolver

#### Example

```js
const addr = await ens.getAddress('vitalik.eth')
// 0x123...
```

### `async function getAddr(name, key): Address`

This function will call the resolver to get the address based on name and coin type of various blockchains, if it cannot find a resolver, it will return `0x000...` as a fallback

#### Arguments

name (String): An ENS name (e.g: vitalik.eth)
key (String): CoinType (e.g: ETH, EOS, ETC, specified in [address-encoder](https://github.com/ensdomains/address-encoder#supported-cryptocurrencies))

#### Returns

address (address): A blockchain address that was set on the resolver

#### Example

```js
const addr = await ens.getAddress('vitalik.eth', 'ETC')
// 0x123...
```

### `async function getContent(name): Contenthash`

This function will call the resolver to get the contentHash, if it cannot find a resolver, it will return `0x000...` as a fallback. Otherwise it will return a contenthash in text format, as defined by [EIP1577](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1577.md).

#### Arguments

name (String): An ENS name (e.g: vitalik.eth)

#### Returns

contentHash (String): A content hash String for IPFS or swarm

#### Example

```js
const content = await ens.getContent('vitalik.eth')
// ipfs://Qsxz...
```

### `async function getText(name, key): Value`

This function gets the reverse record of an address.

#### Arguments

name (String): ENS name
key (String): Any keys. Standard values for key

#### Returns

value (String): A value

#### Example

```js
const name = await ens.getText('vitalik.eth', 'url')
// https://vitalik.ca/
```

### `async function getName(address): Name`

This function gets the reverse record of an address.

#### Arguments

address (String): An Ethereum address

#### Returns

name (String): An ENS name

#### Example

```js
const name = await ens.getName('0x123abc...')
// vitalik.eth
```

### `async function getSubdomains(): [Address]`

This function gets the reverse record of an address.

#### Arguments

name (String): An ENS name

#### Returns

addresses (Array): An ENS name

#### Example

```js
const name = await ens.getSubdomains('vitalik.eth')
// ['0x123','0x123']
```

### `async function setOwner(name, newOwner): TransactionResponse`

#### Arguments

name (String): An ENS name
newOwner (String): An Ethereum address or contract

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setOwner('vitalik.eth', '0x123abc...')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function setSubnodeOwner(name, newOwner): TransactionResponse`

Can only be called by the controller of the parent name.

#### Arguments

name (String): An ENS name
newOwner (String): An Ethereum address or contract

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setSubnodeOwner('sub.vitalik.eth', '0x123abc')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function setSubnodeRecord(name, newOwner, resolver): TransactionResponse`

Sets the record for a subnode. Can only be called by the controller of the parent name.

#### Arguments

name (String): An ENS name
newOwner (String): An Ethereum address or contract
resolver (Address): Resolver

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setSubnodeRecord('subnode.resolver.eth', '0x134', '0x123')

console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function setResolver(name, resolver): TransactionResponse`

Can only be called by the controller of the name.

#### Arguments

name (String): An ENS name
resolver (String): An ENS [resolver contract](https://github.com/ensdomains/resolvers)

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setResolver('vitalik.eth', '0x123abc')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function setAddress(name, address): TransactionResponse`

Can only be called by the controller of the name.

#### Arguments

name (String): An ENS name
address (String): An Ethereum address

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setAddress('vitalik.eth', '0x123abc')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function setAddr(name, key, address): TransactionResponse`

Can only be called by the controller of the name.

#### Arguments

name (String): An ENS name
key (String): CoinType (e.g: ETH, EOS, ETC, specified in [address-encoder](https://github.com/ensdomains/address-encoder#supported-cryptocurrencies))
address (String): An Ethereum address

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setAddr(
  'vitalik.eth',
  'ETH',
  '0x0000000000000000000000000000000000012345'
)

console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function setContent(name, content): TransactionResponse (DEPRECATED)`

Can only be called by the controller of the name.

This function has been deprecated in favour of `setContenthash` which uses [EIP1577](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1577.md)

#### Arguments

name (String): An ENS name
content (String): A content hash

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setContent('vitalik.eth', '0x123abc')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function setContenthash(name, content): TransactionResponse`

Can only be called by the controller of the name.

#### Arguments

name (String): An ENS name
contenthash (String): A content hash defined by [EIP1577](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1577.md)

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setContent('vitalik.eth', '0x123abc')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function setText(name, key, value): TransactionResponse`

Sets text metadata for node with the unique key key to value, overwriting anything previously stored for node and key. To clear a text field, set it to the empty string.

#### Arguments

name (String): An ENS name
key (String): key
value (String): Value

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setText('vitalik.eth', 'url', 'vitalik.ca')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function createSubdomain(name): TransactionResponse`

Can only be called by the controller of the name. This is a simplified version of `setSubnodeOwner` which it uses underneath to create a subdomain. It will automatically set the owner to the parent's names owner. If you call this function on an existing subdomain, it will change its owner to the current parent owner.

#### Arguments

name (String): An ENS name (sub.vitalik.eth)

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.createSubdomain('sub', 'vitalik.eth')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function deleteSubdomain(label, name): TransactionResponse`

Can only be called by the controller of the name. This function will set the controller to `0x000...` and if it has a resolver, it will set the resolver `0x000...`, which will be a second transaction. Alternatively you can manually call `setSubnodeOwner` and set the controller to `0x000...`

#### Arguments

label (String): ENS Label e.g: sub (sub.vitalik.eth)
name (String): An ENS name

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.deleteSubdomain('sub', 'vitalik.eth')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function claimAndSetReverseRecordName(name): TransactionResponse`

This function will claim your Ethereum address on the reverse registrar, setup the reverse resolver and setup your name on the resolver all in one transaction. It can also be used to change your reverse record name to something else.

#### Arguments

name (String): An ENS name

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.claimAndSetReverseRecordName('vitalik.eth')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function setReverseRecordName(name): TransactionResponse`

This function will set your reverse record name given that a resolver is already present on your ethereum address reverse name e.g. `123456abcdef.addr.reverse`. This can be useful if you don't want to use `claimAndSetReverseRecordName` to setup the default reverse registrar

#### Arguments

name (String): An ENS name

#### Returns

transaction (object): [Transaction Response Object](#transaction-response)

#### Example

```js
const tx = await ens.setReverseRecordName('vitalik.eth')
console.log(tx.hash)
// 0x123456...
const receipt = await tx.wait() // Wait for transaction to be mined
// Transaction has been mined
```

### `async function getDomainDetails(name): DomainDetails`

This is a helper function to get all the details for a particular domain.

#### Arguments

name (String): An ENS name

#### Returns

```
DomainDetails (object): {
  name (String): ENS name
  label (String): label of the name
  labelhash (String): labelhash of the name
  owner (String): Address of the controller of the ENS name
  resolver (String): ENS resolver contract
  addr (String): Address the ENS name resolves to
  content (String): Contenthash the ENS name resolves to
}
```

#### Example

```js
const domainDetails = await ens.getDomainDetails('vitalik.eth')
console.log(domainDetails)
/* 
  {
    name: "vitalik.eth",
    label: "vitalik",
    labelhash: "0x123456abc...",
    owner: "0x123abcdef...",
    resolver: "0x1234abdef...",
    addr: "0xabcdef1234...",
    content: "bzz://Qra123..."
  }
*/
```

### `async function getSubdomains(name): Array<Subdomain>`

This is a helper function to get all the subdomains for a name. Internally it will search for events for the `NewOwner` and filter out duplicates.

#### Arguments

name (String): An ENS name

#### Returns

```
Subdomains (Array<Subdomain>): {
  name (String): ENS name
  label (String): label of the name
  labelhash: labelhash of the name
  owner (String): Address of the controller of the ENS name
  decrypted (boolean): Whether the label is known or not
}
```

#### Example

```js
const subdomains = await ens.getSubdomains('vitalik.eth')
console.log(subdomains)
/* 
  [{
    name: "vitalik.eth",
    label: "vitalik",
    labelhash: "0x123456abc...",
    owner: "0x123abcdef...",
    decrypted: true
  }, ...]
*/
```

## Transaction Response

The transaction response object gets returned by the promise of all state modifying functions of the library. The most important properties is the `wait` function which can be called by the initial response, before the transaction has been mined. You can await this promise and it will give you the transaction receipt. The transaction receipt, is the same as the transaction response object, except is has a `blockHash`, `blockNumber` and `timestamp` of the block the transaction has been included in.

```js
{
    // Only available for unmined transactions
    wait: function(){}, //this function is to wait for the transaction to be mined
    // Only available for mined transactions
    blockHash: "0x7f20ef60e9f91896b7ebb0962a18b8defb5e9074e62e1b6cde992648fe78794b",
    blockNumber: 3346463,
    timestamp: 1489440489,

    // Exactly one of these will be present (send vs. deploy contract)
    // They will always be a properly formatted checksum address
    creates: null,
    to: "0xc149Be1bcDFa69a94384b46A1F91350E5f81c1AB",

    // The transaction hash
    hash: "0xf517872f3c466c2e1520e35ad943d833fdca5a6739cfea9e686c4c1b3ab1022e",

    // See above "Transaction Requests" for details
    data: "0x",
    from: "0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8",
    gasLimit: utils.bigNumberify("90000"),
    gasPrice: utils.bigNumberify("21488430592"),
    nonce: 0,
    value: utils.parseEther(1.0017071732629267),

    // The chain ID; 0 indicates replay-attack vulnerable
    // (eg. 1 = Homestead mainnet, 3 = Ropsten testnet)
    chainId: 1,

    // The signature of the transaction (TestRPC may fail to include these)
    r: "0x5b13ef45ce3faf69d1f40f9d15b0070cc9e2c92f3df79ad46d5b3226d7f3d1e8",
    s: "0x535236e497c59e3fba93b78e124305c7c9b20db0f8531b015066725e4bb31de6",
    v: 37,

    // The raw transaction (TestRPC may be missing this)
    raw: "0xf87083154262850500cf6e0083015f9094c149be1bcdfa69a94384b46a1f913" +
           "50e5f81c1ab880de6c75de74c236c8025a05b13ef45ce3faf69d1f40f9d15b0" +
           "070cc9e2c92f3df79ad46d5b3226d7f3d1e8a0535236e497c59e3fba93b78e1" +
           "24305c7c9b20db0f8531b015066725e4bb31de6",
}
```

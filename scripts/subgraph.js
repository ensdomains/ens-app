#!/usr/bin/env node
yaml = require('js-yaml')
fs = require('fs')
var fileName = '../ens-subgraph-ghsa-m9g2-g2hw-pq94/subgraph.yaml'
var doc = yaml.safeLoad(fs.readFileSync(fileName))
var addresses = JSON.parse(fs.readFileSync('./cypress.env.json', 'utf8'))
let name, address
doc.dataSources.forEach(s => {
  switch (s.name) {
    case 'OldENSRegistry':
      name = 'oldEnsAddress'
      break
    case 'OldBaseRegistrar':
      name = 'oldBaseRegistrarAddress'
      break
    case 'OldEthRegistrarController':
      name = 'oldControllerAddress'
      break
    case 'AuctionRegistrar':
      name = 'legacyAuctionRegistrarAddress'
      break
    case 'ENSRegistryWithFallback':
      name = 'ensAddress'
      break
    case 'BaseRegistrar':
      name = 'baseRegistrarAddress'
      break
    case 'EthRegistrarController':
      name = 'controllerAddress'
      break
    default:
      name = null
  }
  if (name) {
    address = addresses[name]
    console.log(`${s.name} == ${name}(${address})`)
    s.source.address = address
  }
})
fs.writeFileSync(fileName, yaml.safeDump(doc))

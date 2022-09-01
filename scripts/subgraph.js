#!/usr/bin/env node
yaml = require('js-yaml')
fs = require('fs')
var fileName = '../ens-subgraph/subgraph.yaml'
var doc = yaml.safeLoad(fs.readFileSync(fileName))
var addresses = JSON.parse(fs.readFileSync('./cypress.env.json', 'utf8'))
let name, address
doc.dataSources.forEach(s => {
  switch (s.name) {
    case 'ENSRegistry':
      s.source.address = addresses.ensAddress
      s.source.startBlock = 0
      break
    case 'ENSRegistryOld':
      s.source.address = addresses.oldEnsAddress
      s.source.startBlock = 0
      break
    case 'AuctionRegistrar':
      s.source.address = addresses.legacyAuctionRegistrarAddress
      s.source.startBlock = 0
      break
    case 'BaseRegistrar':
      s.source.address = addresses.baseRegistrarAddress
      s.source.startBlock = 0
      break
    case 'EthRegistrarController':
      s.source.address = addresses.controllerAddress
      s.source.startBlock = 0
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

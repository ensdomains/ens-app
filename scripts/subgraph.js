#!/usr/bin/env node
yaml = require('js-yaml')
fs = require('fs')
var fileName = '../ans-subgraph/subgraph.yaml'
var doc = yaml.safeLoad(fs.readFileSync(fileName))
var addresses = JSON.parse(fs.readFileSync('./cypress.env.json', 'utf8'))
let name, address
doc.dataSources.forEach(s => {
  switch (s.name) {
    case 'ENSRegistry':
      s.source.address = addresses.ensAddress
      break
    case 'ENSRegistryOld':
      s.source.address = addresses.oldEnsAddress
      break
    case 'AuctionRegistrar':
      s.source.address = addresses.legacyAuctionRegistrarAddress
      break
    case 'BaseRegistrar':
      s.source.address = addresses.baseRegistrarAddress
      break
    case 'EthRegistrarController':
      s.source.address = addresses.controllerAddress
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

#!/usr/bin/env node
yaml = require('js-yaml')
fs = require('fs')
var fileName = '../ens-subgraph/subgraph.yaml'
var doc = yaml.safeLoad(fs.readFileSync(fileName))
var addresses = JSON.parse(fs.readFileSync('./cypress.env.json', 'utf8'))

doc.dataSources.forEach(s => {
  s.network = 'dev'
  switch (s.name) {
    case 'ENSRegistry':
      s.source.address = addresses.ensAddress
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
  }
})
fs.writeFileSync(fileName, yaml.safeDump(doc))

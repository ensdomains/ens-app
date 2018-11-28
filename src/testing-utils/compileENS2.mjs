import fs from 'fs'
import solc from 'solc'

let Registry = fs.readFileSync(
  './node_modules/@ensdomains/ens/contracts/ENSRegistry.sol',
  'utf8'
)

let ensInterface = fs.readFileSync(
  './node_modules/@ensdomains/ens/contracts/ENS.sol',
  'utf8'
)

let PublicResolver = fs.readFileSync(
  './node_modules/@ensdomains/ens/contracts/PublicResolver.sol',
  'utf8'
)

let ReverseRegistrar = fs.readFileSync(
  './node_modules/@ensdomains/ens/contracts/ReverseRegistrar.sol',
  'utf8'
)

let compiled = solc.compile(
  {
    sources: {
      'ENS.sol': ensInterface,
      'ENSRegistry.sol': Registry,
      'PublicResolver.sol': PublicResolver,
      'ReverseRegistrar.sol': ReverseRegistrar
    }
  },
  1
)

console.log(compiled)
fs.writeFile('./src/testing-utils/ENS.json', JSON.stringify(compiled), err => {
  if (err) throw err
  console.log('The file has been saved!')
})

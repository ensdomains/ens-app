import subDomainRegistrarContract from './contracts/subDomainRegistrarContract.json'
import getWeb3 from './web3'
let domains
let subDomainRegistrars = {}

const defaultAddress = '0x0b07463b30b302a98407d3e3df85ebc073b0dbd1'

const getSubDomainRegistrar = async address => {
  const { web3 } = await getWeb3()

  if (!address && !subDomainRegistrars[defaultAddress]) {
    subDomainRegistrars[defaultAddress] = web3.eth
      .contract(subDomainRegistrarContract)
      .at(defaultAddress)
    return subDomainRegistrars[defaultAddress]
  }

  if (address && !subDomainRegistrars[address]) {
    subDomainRegistrars[address] = web3.eth
      .contract(subDomainRegistrarContract)
      .at(address)
    return subDomainRegistrars[address]
  } else {
    return subDomainRegistrars[address]
  }

  return subDomainRegistrars[defaultAddress]
}

export const query = async (label, subdomain, address) => {
  const Registrar = await getSubDomainRegistrar(address)
  console.log(Registrar)
  return new Promise((resolve, reject) => {
    Registrar.query(label, subdomain, (err, entry) => {
      console.log(err, entry)
      if (err) {
        reject(err)
      } else {
        resolve(entry)
      }
    })
  })
}

async function test() {
  const { web3 } = await getWeb3()
  console.log('heretest')
  const labelHash = web3.sha3('gimmethe')
  console.log(labelHash)
  const node = await query(labelHash, 'account')
  node.forEach(e => console.log(e.toString()))
}

test()

import subDomainRegistrarContract from './contracts/subDomainRegistrarContract.json'
import getWeb3 from './web3'
import domains from '../lib/domains.json'
let subDomainRegistrars = {}

const defaultAddress = '0x0b07463b30b302a98407d3e3df85ebc073b0dbd1'

const getSubDomainRegistrar = async address => {
  const { web3 } = await getWeb3()

  if (subDomainRegistrars[address]) {
    return subDomainRegistrars[address]
  } else {
    subDomainRegistrars[address] = web3.eth
      .contract(subDomainRegistrarContract)
      .at(address)
    return subDomainRegistrars[address]
  }

  // if (
  //   address === undefined &&
  //   !subDomainRegistrars[defaultAddress] === undefined
  // ) {
  //   console.log('first if')
  //   subDomainRegistrars[defaultAddress] = web3.eth
  //     .contract(subDomainRegistrarContract)
  //     .at(defaultAddress)
  //   return subDomainRegistrars[defaultAddress]
  // }

  // if (address && subDomainRegistrars[address] === undefined) {
  //   console.log('here in alternative address')
  //   subDomainRegistrars[address] = web3.eth
  //     .contract(subDomainRegistrarContract)
  //     .at(address)
  //   return subDomainRegistrars[address]
  // } else {
  //   console.log('second else')
  //   return subDomainRegistrars[address]
  // }

  // return subDomainRegistrars[defaultAddress]
}

export const query = async (subdomain, label, address) => {
  const Registrar = await getSubDomainRegistrar(address)
  const { web3 } = await getWeb3()
  return new Promise((resolve, reject) => {
    Registrar.query(web3.sha3(subdomain), label, (err, entry) => {
      console.log(err, entry)
      if (err) {
        reject(err)
      } else {
        resolve(entry)
      }
    })
  })
}

export const queryAll = async label => {
  console.log(domains)
  return domains.map(domain => {
    if (domain.registrar) {
      return query(domain.name, label, domain.registrar)
    }
    console.log('outside if')
    return query(domain.name, label, defaultAddress)
  })
}

// async function test() {
//   // const node = await query('gimmethe', 'awesome')
//   // console.log(node)
//   const nodes = await queryAll('helloooo12345')
//   nodes.map(promise =>
//     promise.then(node => node.forEach(e => console.log(e.toString())))
//   )
// }

// test()

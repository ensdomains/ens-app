import subDomainRegistrarContract from './contracts/subDomainRegistrarContract.json'
import getWeb3 from './web3'
import domains from '../lib/domains.json'
let subDomainRegistrars = {}

const defaultAddress = '0x0b07463b30b302a98407d3e3df85ebc073b0dbd1'

const getSubDomainRegistrar = async address => {
  async function instantiateContract(address) {
    const { web3 } = await getWeb3()
    return (subDomainRegistrars[address] = web3.eth
      .contract(subDomainRegistrarContract)
      .at(address))
  }

  if (address) {
    if (subDomainRegistrars[address]) {
      return subDomainRegistrars[address]
    } else {
      subDomainRegistrars[address] = await instantiateContract(address)
      return subDomainRegistrars[address]
    }
  }

  if (subDomainRegistrars[defaultAddress]) {
    return subDomainRegistrars[defaultAddress]
  } else {
    subDomainRegistrars[defaultAddress] = await instantiateContract(
      defaultAddress
    )
    return subDomainRegistrars[defaultAddress]
  }
}

export const query = async (domain, label, address = defaultAddress) => {
  const Registrar = await getSubDomainRegistrar(address)
  const { web3 } = await getWeb3()
  return new Promise((resolve, reject) => {
    Registrar.query(web3.sha3(domain), label, (err, node) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          label,
          domain,
          price: node[1].toString(),
          rent: node[2].toString(),
          referralFeePPM: node[3].toString(),
          available: node[0].length !== 0
        })
      }
    })
  })
}

export const queryAll = async label => {
  return domains.map(domain => {
    if (domain.registrar) {
      return query(domain.name, label, domain.registrar)
    }
    return query(domain.name, label)
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

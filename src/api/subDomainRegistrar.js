import subDomainRegistrarContract from './contracts/subDomainRegistrarContract.json'
import getWeb3 from './web3'
let domains
let subDomainRegistrars = {}

const defaultAddress = '0x0b07463b30b302a98407d3e3df85ebc073b0dbd1'

const getSubDomainRegistrar = (address) => {
  const { web3 } = await getWeb3()

  if(!address && !subDomainRegistrars[defaultAddress]) {
    subDomainRegistars[defaultAddress] = web3.eth.contract(subDomainRegistrarContract).at(address)
    return subDomainRegistars[defaultAddress]
  }

  if(address && !subDomainRegistars[address]){
    subDomainRegistars[address] = web3.eth.contract(subDomainRegistrarContract).at(address)
    return subDomainRegistars[address]
  } else {
    return subDomainRegistars[address]
  }

  return subDomainRegistars[defaultAddress]
}

export const query = (label, domain) => {
  
}

export let 
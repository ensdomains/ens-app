import getWeb3 from './web3'
import getWeb31, { getNetworkId } from './web31'
import web3Constructor from 'web3-1.0'
import ensContract from './contracts/ensContract.json'
import reverseRegistrarContract from './contracts/reverseRegistrarContract.json'
import resolverContract from './contracts/resolverContract.json'
import fifsRegistrarContract from './contracts/fifsRegistrarContract.json'
import ENSconstructor from 'ethereum-ens'

var contracts = {
  1: {
    registry: '0x314159265dd8dbb310642f98f50c066173c1259b'
  },
  3: {
    registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010'
  }
}

let ENS
let _ENS

async function getNamehash(name) {
  const web3 = await getWeb31()
  let node =
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  if (name !== '') {
    let labels = name.split('.')
    for (let i = labels.length - 1; i >= 0; i--) {
      node = web3.utils.sha3(node + web3.utils.sha3(labels[i]).slice(2), {
        encoding: 'hex'
      })
    }
  }
  return node.toString()
}

async function getNamehashWithLabelHash(labelHash, nodeHash) {
  const web3 = await getWeb31()
  let node = web3.utils.sha3(nodeHash + labelHash.slice(2), { encoding: 'hex' })
  return node.toString()
}

async function getReverseRegistrarContract() {
  const ENS = await ENS()
  const web3 = await getWeb31()
  const reverseRegistrarAddr = await ENS.owner('addr.reverse').call()
  return {
    reverseRegistrar: new web3.eth.Contract(
      reverseRegistrarContract,
      reverseRegistrarAddr
    ),
    web3
  }
}

async function getResolverContract(addr) {
  const web3 = await getWeb31()
  const resolver = new web3.eth.Contract(resolverContract, addr)
  return resolver.methods
}

async function getENSContract() {
  const web3 = await getWeb31()
  const networkId = await getNetworkId()
  return new web3.eth.Contract(ensContract, contracts[networkId].registry)
}

async function getFifsRegistrarContract() {
  const { ENS, web3 } = await getENS()

  const fifsRegistrarAddr = await ENS.owner('test').call()

  return {
    registrar: new web3.eth.Contract(fifsRegistrarContract, fifsRegistrarAddr),
    web3
  }
}

const getENS = async (ensAddress, web3Instance) => {
  const web3 = await getWeb3()
  const ens = await getENSContract()
  const networkId = await getNetworkId()

  if (!ENS) {
    if (!ensAddress) {
      ensAddress = contracts[networkId].registry
    }
    ENS = ens.methods
    _ENS = ens
    contracts[networkId] = {}
    contracts[networkId].registry = ensAddress
  }

  return { ENS, web3, _ENS: ens }
}

async function getENSEvent(event, params) {
  const { _ENS } = await getENS()
  console.log('here')
  return _ENS.getPastEvents(event, params)
}

const watchEvent = (
  { contract, addr, eventName },
  filter,
  params,
  callback
) => {
  function eventFactory(contract, eventName, filter, params, callback) {
    const myEvent = contract[eventName](filter, params)
    myEvent.watch((error, log) => {
      //console.log(event, `here in the ${contract} Event`, log)
      if (error) {
        console.error(error)
      } else {
        callback(error, log, myEvent)
      }
    })
    return myEvent
  }

  switch (contract) {
    case 'ENS':
      return getENSContract().then(({ ens }) => {
        eventFactory(ens, eventName, filter, params, callback)
      })
    case 'Resolver':
      return getResolverContract(addr).then(({ resolver }) => {
        eventFactory(resolver, eventName, filter, params, callback)
      })
    default:
      throw new Error('Unrecognised contract')
  }
}

export default getENS
export {
  getReverseRegistrarContract,
  getENSContract,
  getENSEvent,
  getNamehash,
  getNamehashWithLabelHash,
  getResolverContract,
  watchEvent,
  getFifsRegistrarContract
}

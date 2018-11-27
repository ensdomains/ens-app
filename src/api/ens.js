import getWeb3, { getWeb3Read, getNetworkId } from './web3'
import ensContract from './contracts/ensContract.json'
import reverseRegistrarContract from './contracts/reverseRegistrarContract.json'
import resolverContract from './contracts/resolverContract.json'
import fifsRegistrarContract from './contracts/fifsRegistrarContract.json'

var contracts = {
  1: {
    registry: '0x314159265dd8dbb310642f98f50c066173c1259b'
  },
  3: {
    registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010'
  }
}

let ENS
let readENS

async function getNamehash(unsanitizedName) {
  const web3 = await getWeb3()
  const name = unsanitizedName.toLowerCase()
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
  const web3 = await getWeb3()
  let node = web3.utils.sha3(nodeHash + labelHash.slice(2), { encoding: 'hex' })
  return node.toString()
}

async function getReverseRegistrarContract() {
  const { ENS } = await getENS()
  const web3 = await getWeb3()
  const namehash = await getNamehash('addr.reverse')
  const reverseRegistrarAddr = await ENS.owner(namehash).call()
  const reverseRegistrar = new web3.eth.Contract(
    reverseRegistrarContract,
    reverseRegistrarAddr
  )
  return {
    reverseRegistrar: reverseRegistrar.methods,
    _reverseRegistrar: reverseRegistrar
  }
}

async function getResolverContract(addr) {
  const web3 = await getWeb3()

  const Resolver = new web3.eth.Contract(resolverContract, addr)
  return {
    Resolver: Resolver.methods,
    _Resolver: Resolver
  }
}

async function getResolverReadContract(addr) {
  const web3 = await getWeb3Read()
  const Resolver = new web3.eth.Contract(resolverContract, addr)
  return {
    Resolver: Resolver.methods,
    _Resolver: Resolver
  }
}

async function getENSContract() {
  const web3 = await getWeb3()
  const web3Read = await getWeb3Read()
  const networkId = await getNetworkId()

  return {
    readENS: new web3Read.eth.Contract(
      ensContract,
      contracts[networkId].registry
    ),
    ENS: new web3.eth.Contract(ensContract, contracts[networkId].registry)
  }
}

async function getFifsRegistrarContract() {
  const { ENS, web3 } = await getENS()

  const fifsRegistrarAddr = await ENS.owner('test').call()

  return {
    registrar: new web3.eth.Contract(fifsRegistrarContract, fifsRegistrarAddr),
    web3
  }
}

const getENS = async ensAddress => {
  const networkId = await getNetworkId()

  if (!ENS) {
    if (!ensAddress) {
      ensAddress = contracts[networkId].registry
    }
    contracts[networkId] = {}
    contracts[networkId].registry = ensAddress
  } else {
    return {
      ENS: ENS.methods,
      _ENS: ENS,
      readENS: readENS.methods,
      _readENS: readENS
    }
  }

  const { ENS: ENSContract, readENS: readENSContract } = await getENSContract()
  ENS = ENSContract
  readENS = readENSContract

  return {
    ENS: ENSContract.methods,
    _ENS: ENSContract,
    readENS: readENS.methods,
    _readENS: readENS
  }
}

async function getENSEvent(event, params) {
  const { _ENS } = await getENS()
  return _ENS.getPastEvents(event, params)
}

async function watchEvent(
  { contract, addr, eventName },
  filter,
  params,
  callback
) {
  function eventFactory(contract, eventName, filter, params, callback) {
    const myEvent = contract.events[eventName](
      { filter, ...params },
      (error, log) => {
        //console.log(event, `here in the ${contract} Event`, log)
        if (error) {
          console.error(error)
        } else {
          callback(error, log, myEvent)
        }
      }
    )
    return myEvent
  }

  switch (contract) {
    case 'ENS':
      const { _ENS } = await getENS()
      console.log(_ENS)
      return eventFactory(_ENS, eventName, filter, params, callback)
    case 'Resolver':
      const { _Resolver } = await getResolverContract(addr)

      return eventFactory(_Resolver, eventName, filter, params, callback)
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
  getResolverReadContract,
  watchEvent,
  getFifsRegistrarContract
}

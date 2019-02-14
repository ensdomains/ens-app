import _ from 'lodash'
import getWeb3, { getWeb3Read, getNetworkId } from './web3'
import { abi as ensContract } from '@ensdomains/ens/build/contracts/ENS.json'
import { abi as reverseRegistrarContract } from '@ensdomains/ens/build/contracts/ReverseRegistrar.json'
import { abi as resolverContract } from '@ensdomains/resolver/build/contracts/PublicResolver.json'
import { abi as oldResolverContract } from '@ensdomains/ens-022/build/contracts/PublicResolver.json'

import { abi as fifsRegistrarContract } from '@ensdomains/ens/build/contracts/FIFSRegistrar.json'

oldResolverContract.forEach((old, i) => {
  if (
    !resolverContract
      .map(n => {
        return n.name
      })
      .includes(old.name)
  ) {
    resolverContract.push(old)
  }
})

var contracts = {
  1: {
    registry: '0x314159265dd8dbb310642f98f50c066173c1259b'
  },
  3: {
    registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010'
  },
  4: {
    registry: '0xe7410170f87102df0055eb195163a03b7f2bff4a'
  },
  5: {
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

  const readENS = new web3Read.eth.Contract(
    ensContract,
    contracts[networkId].registry
  )
  const writeENS = new web3.eth.Contract(
    ensContract,
    contracts[networkId].registry
  )
  return {
    readENS: readENS,
    ENS: writeENS
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

  if (process.env.REACT_APP_ENS_ADDRESS && networkId > 4) {
    ensAddress = process.env.REACT_APP_ENS_ADDRESS
  }

  const hasRegistry = _.has(contracts[networkId], 'registry')

  if (!ENS) {
    if (!hasRegistry && !ensAddress) {
      throw new Error(`Unsupported network ${networkId}`)
    }

    if (contracts[networkId]) {
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

export default getENS
export {
  getReverseRegistrarContract,
  getENSContract,
  getENSEvent,
  getNamehash,
  getNamehashWithLabelHash,
  getResolverContract,
  getResolverReadContract,
  getFifsRegistrarContract
}

import getWeb3 from './web3'
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

function getNamehash(name) {
  return getWeb3().then(({ web3 }) => {
    var node =
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    if (name !== '') {
      var labels = name.split('.')
      for (var i = labels.length - 1; i >= 0; i--) {
        node = web3.sha3(node + web3.sha3(labels[i]).slice(2), {
          encoding: 'hex'
        })
      }
    }
    return node.toString()
  })
}

function getNamehashWithLabelHash(labelHash, nodeHash) {
  return getWeb3().then(({ web3 }) => {
    let node = web3.sha3(nodeHash + labelHash.slice(2), { encoding: 'hex' })
    return node.toString()
  })
}

let ensContract = [
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'resolver',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'label',
        type: 'bytes32'
      },
      {
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'setSubnodeOwner',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'ttl',
        type: 'uint64'
      }
    ],
    name: 'setTTL',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'ttl',
    outputs: [
      {
        name: '',
        type: 'uint64'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'resolver',
        type: 'address'
      }
    ],
    name: 'setResolver',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'setOwner',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: 'label',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'NewOwner',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'resolver',
        type: 'address'
      }
    ],
    name: 'NewResolver',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'ttl',
        type: 'uint64'
      }
    ],
    name: 'NewTTL',
    type: 'event'
  }
]

let resolverContract = [
  {
    constant: true,
    inputs: [
      {
        name: 'interfaceID',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'contentTypes',
        type: 'uint256'
      }
    ],
    name: 'ABI',
    outputs: [
      {
        name: 'contentType',
        type: 'uint256'
      },
      {
        name: 'data',
        type: 'bytes'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'x',
        type: 'bytes32'
      },
      {
        name: 'y',
        type: 'bytes32'
      }
    ],
    name: 'setPubkey',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'content',
    outputs: [
      {
        name: 'ret',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'addr',
    outputs: [
      {
        name: 'ret',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'contentType',
        type: 'uint256'
      },
      {
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'setABI',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'name',
    outputs: [
      {
        name: 'ret',
        type: 'string'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'name',
        type: 'string'
      }
    ],
    name: 'setName',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'hash',
        type: 'bytes32'
      }
    ],
    name: 'setContent',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    name: 'pubkey',
    outputs: [
      {
        name: 'x',
        type: 'bytes32'
      },
      {
        name: 'y',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'node',
        type: 'bytes32'
      },
      {
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'setAddr',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    inputs: [
      {
        name: 'ensAddr',
        type: 'address'
      }
    ],
    payable: false,
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'a',
        type: 'address'
      }
    ],
    name: 'AddrChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'hash',
        type: 'bytes32'
      }
    ],
    name: 'ContentChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'name',
        type: 'string'
      }
    ],
    name: 'NameChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      },
      {
        indexed: true,
        name: 'contentType',
        type: 'uint256'
      }
    ],
    name: 'ABIChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'node',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'x',
        type: 'bytes32'
      },
      {
        indexed: false,
        name: 'y',
        type: 'bytes32'
      }
    ],
    name: 'PubkeyChanged',
    type: 'event'
  }
]

let reverseRegistrarContract = [
  {
    constant: false,
    inputs: [
      {
        name: 'owner',
        type: 'address'
      },
      {
        name: 'resolver',
        type: 'address'
      }
    ],
    name: 'claimWithResolver',
    outputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'claim',
    outputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ens',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'defaultResolver',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'node',
    outputs: [
      {
        name: 'ret',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'name',
        type: 'string'
      }
    ],
    name: 'setName',
    outputs: [
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    inputs: [
      {
        name: 'ensAddr',
        type: 'address'
      },
      {
        name: 'resolverAddr',
        type: 'address'
      }
    ],
    payable: false,
    type: 'constructor'
  }
]

const fifsRegistrarContract = [
  {
    constant: true,
    inputs: [],
    name: 'ens',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'expiryTimes',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'subnode',
        type: 'bytes32'
      },
      {
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'register',
    outputs: [],
    payable: false,
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'rootNode',
    outputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    inputs: [
      {
        name: 'ensAddr',
        type: 'address'
      },
      {
        name: 'node',
        type: 'bytes32'
      }
    ],
    type: 'constructor'
  }
]

const getReverseRegistrarContract = () => {
  return getENS().then(async ({ ENS, web3 }) => {
    let reverseRegistrarAddr = await ENS.owner('addr.reverse')
    return {
      reverseRegistrar: web3.eth
        .contract(reverseRegistrarContract)
        .at(reverseRegistrarAddr),
      web3
    }
  })
}

const getResolverContract = addr => {
  return getWeb3().then(({ web3, networkId }) => {
    return {
      resolver: web3.eth.contract(resolverContract).at(addr),
      web3
    }
  })
}

const getENSContract = () => {
  return getWeb3().then(({ web3, networkId }) => {
    return {
      ens: web3.eth.contract(ensContract).at(contracts[networkId].registry),
      web3
    }
  })
}

const getFifsRegistrarContract = () => {
  return getENS().then(async ({ ENS, web3 }) => {
    let fifsRegistrarAddr = await ENS.owner('test')
    return {
      registrar: web3.eth.contract(fifsRegistrarContract).at(fifsRegistrarAddr),
      web3
    }
  })
}

const getENS = async () => {
  let { web3, networkId } = await getWeb3()

  if (!ENS) {
    ENS = new ENSconstructor(web3, contracts[networkId].registry)
  }

  return { ENS, web3 }
}

const getENSEvent = (event, filter, params) =>
  getENSContract().then(({ ens }) => {
    const myEvent = ens[event](filter, params)

    return new Promise(function(resolve, reject) {
      myEvent.get(function(error, logs) {
        console.log(logs)
        if (error) {
          reject(error)
        } else {
          resolve(logs)
        }
      })
    })
  })

const watchEvent = (
  { contract, addr, eventName },
  filter,
  params,
  callback
) => {
  console.log('WATCH EVENT', contract, addr, eventName)
  function eventFactory(contract, eventName, filter, params, callback) {
    const myEvent = contract[eventName](filter, params)
    console.log(myEvent)
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
      console.log('Resolver ENS WATCH')
      return getResolverContract(addr).then(({ resolver }) => {
        eventFactory(resolver, eventName, filter, params, callback)
      })
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

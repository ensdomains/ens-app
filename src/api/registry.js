import getENS, {
  getNamehash,
  getENSEvent,
  getReverseRegistrarContract,
  getResolverContract,
  getTestRegistrarContract,
  getResolverReadContract,
  getNamehashWithLabelHash,
  normalize
} from './ens'
import { decryptHashes } from './preimage'
import { uniq, ensStartBlock, checkLabels, mergeLabels } from '../utils/utils'
import getWeb3, { getAccount } from './web3'

export async function getOwner(name) {
  const { readENS: ENS } = await getENS()
  const namehash = getNamehash(name)
  const owner = await ENS.owner(namehash).call()
  return owner
}

export async function getResolver(name) {
  const namehash = getNamehash(name)
  const { readENS: ENS } = await getENS()
  return ENS.resolver(namehash).call()
}

export async function getResolverWithNameHash(label, node, name) {
  let { readENS: ENS } = await getENS()
  let nodeHash = await getNamehashWithLabelHash(label, node)
  return ENS.resolver(nodeHash).call()
}

export async function registerTestdomain(label) {
  const { registrar } = await getTestRegistrarContract()
  const web3 = await getWeb3()
  const namehash = await web3.utils.sha3(label)
  const account = await getAccount()
  return () => registrar.register(namehash, account).send({ from: account })
}

export async function expiryTimes(label, owner) {
  const { registrar } = await getTestRegistrarContract()
  const web3 = await getWeb3()
  const namehash = await web3.utils.sha3(label)
  const result = await registrar.expiryTimes(namehash).call()
  if (result > 0) {
    return new Date(result * 1000)
  }
}

export async function getAddr(name) {
  const resolverAddr = await getResolver(name)
  if (parseInt(resolverAddr, 16) === 0) {
    return '0x00000000000000000000000000000000'
  }
  const namehash = getNamehash(name)
  try {
    const { Resolver } = await getResolverReadContract(resolverAddr)
    const addr = await Resolver.addr(namehash).call()
    return addr
  } catch (e) {
    console.warn(
      'Error getting addr on the resolver contract, are you sure the resolver address is a resolver contract?'
    )
    return '0x00000000000000000000000000000000'
  }
}

export async function getContent(name) {
  const resolverAddr = await getResolver(name)
  if (parseInt(resolverAddr, 16) === 0) {
    return '0x00000000000000000000000000000000'
  }
  try {
    const namehash = getNamehash(name)
    const { Resolver } = await getResolverReadContract(resolverAddr)
    const web3 = await getWeb3()
    const contentHashSignature = web3.utils
      .sha3('contenthash(bytes32)')
      .slice(0, 10)

    const isContentHashSupported = await Resolver.supportsInterface(
      contentHashSignature
    ).call()

    if (isContentHashSupported) {
      return {
        value: await Resolver.contenthash(namehash).call(),
        contentType: 'contenthash'
      }
    } else {
      const value = await Resolver.content(namehash).call()
      return {
        value,
        contentType: 'oldcontent'
      }
    }
  } catch (e) {
    const message =
      'Error getting content on the resolver contract, are you sure the resolver address is a resolver contract?'
    console.warn(message, e)
    return { value: message, contentType: 'error' }
  }
}

export async function getName(address) {
  const reverseNode = `${address.slice(2)}.addr.reverse`
  const reverseNamehash = getNamehash(reverseNode)
  const resolverAddr = await getResolver(reverseNode)
  if (parseInt(resolverAddr, 16) === 0) {
    return {
      name: null
    }
  }

  try {
    const { Resolver } = await getResolverReadContract(resolverAddr)
    const name = await Resolver.name(reverseNamehash).call()
    return {
      name
    }
  } catch (e) {
    console.log(`Error getting name for reverse record of ${address}`, e)
  }
}

export async function setOwner(name, newOwner) {
  const { ENS } = await getENS()
  const namehash = getNamehash(name)
  const account = await getAccount()
  return () => ENS.setOwner(namehash, newOwner).send({ from: account })
}

export async function setSubnodeOwner(unnormalizedLabel, node, newOwner) {
  const web3 = await getWeb3()
  const { ENS } = await getENS()
  const account = await getAccount()
  const label = normalize(unnormalizedLabel)
  const parentNamehash = getNamehash(node)
  return () =>
    ENS.setSubnodeOwner(parentNamehash, web3.utils.sha3(label), newOwner).send({
      from: account
    })
}

export async function setResolver(name, resolver) {
  const account = await getAccount()
  const namehash = getNamehash(name)
  const { ENS } = await getENS()
  return () => ENS.setResolver(namehash, resolver).send({ from: account })
}

export async function setAddress(name, address) {
  const account = await getAccount()
  const namehash = getNamehash(name)
  const resolverAddr = await getResolver(name)
  const { Resolver } = await getResolverContract(resolverAddr)
  return () => Resolver.setAddr(namehash, address).send({ from: account })
}

export async function setContent(name, content) {
  const account = await getAccount()
  const namehash = getNamehash(name)
  const resolverAddr = await getResolver(name)
  const { Resolver } = await getResolverContract(resolverAddr)
  const gas = await Resolver.setContent(namehash, content).estimateGas({from:account})
  return () =>
    Resolver.setContent(namehash, content).send({ from: account, gas })
}

export async function setContenthash(name, content) {
  const account = await getAccount()
  const namehash = getNamehash(name)
  const resolverAddr = await getResolver(name)
  const { Resolver } = await getResolverContract(resolverAddr)
  const tx = Resolver.setContenthash(namehash, content)
  const gas = await tx.estimateGas({from:account})
  return () => tx.send({ from: account, gas: gas })
}

export async function checkSubDomain(subDomain, domain) {
  const { ENS } = await getENS()
  return ENS.owner(subDomain + '.' + domain).call()
}

export async function buildSubDomain(label, node, owner) {
  const web3 = await getWeb3()
  const labelHash = web3.utils.sha3(label)
  const resolver = await getResolver(label + '.' + node)
  const subDomain = {
    resolver,
    labelHash,
    owner,
    label,
    node,
    name: label + '.' + node
  }

  if (parseInt(resolver, 16) === 0) {
    return subDomain
  } else {
    const resolverAndNode = await getResolverDetails(subDomain)
    return resolverAndNode
  }
}

export async function createSubdomain(subdomain, domain) {
  const account = await getAccount()
  try {
    return setSubnodeOwner(subdomain, domain, account)
  } catch (e) {
    console.log('error creating subdomain', e)
  }
}

export async function deleteSubdomain(subdomain, domain) {
  const name = subdomain + '.' + domain
  const resolver = await getResolver(name)
  const account = await getAccount()
  if (parseInt(resolver, 16) !== 0) {
    await setSubnodeOwner(subdomain, domain, account)
    await setResolver(name, 0)
  }
  try {
    const receipt = await setSubnodeOwner(
      subdomain,
      domain,
      '0x0000000000000000000000000000000000000000'
    )
    return receipt
  } catch (e) {
    console.log('error deleting subdomain', e)
  }
}

export async function getResolverDetails(node) {
  try {
    const addrPromise = getAddr(node.name)
    const contentPromise = getContent(node.name)
    const [addr, content] = await Promise.all([addrPromise, contentPromise])
    return {
      ...node,
      addr,
      content: content.value,
      contentType: content.contentType
    }
  } catch (e) {
    return {
      ...node,
      addr: '0x0',
      content: '0x0',
      contentType: 'error'
    }
  }
}

export async function claimAndSetReverseRecordName(name) {
  const { reverseRegistrar } = await getReverseRegistrarContract()
  const account = await getAccount()
  return () => reverseRegistrar.setName(name).send({ from: account })
}

export async function setReverseRecordName(name) {
  const account = await getAccount()
  const reverseNode = `${account.slice(2)}.addr.reverse`
  const resolverAddress = await getResolver(reverseNode)
  let { Resolver } = await getResolverContract(resolverAddress)
  let namehash = getNamehash(reverseNode)
  return () => Resolver.setName(namehash, name).send({ from: account })
}

export function getDomainDetails(name) {
  return Promise.all([getOwner(name), getResolver(name)])
    .then(([owner, resolver]) => ({
      name,
      label: name.split('.')[0],
      owner,
      resolver,
      subDomains: []
    }))
    .then(node => {
      let hasResolver = parseInt(node.resolver, 16) !== 0
      if (hasResolver) {
        return getResolverDetails(node)
      }
      return Promise.resolve({
        ...node,
        addr: null,
        content: null
      })
    })
}

export const getSubDomains = async name => {
  const startBlock = await ensStartBlock()
  const namehash = getNamehash(name)
  const rawLogs = await getENSEvent('NewOwner', {
    filter: { node: [namehash] },
    fromBlock: startBlock
  })
  const flattenedLogs = rawLogs.map(log => log.returnValues)
  flattenedLogs.reverse()
  const logs = uniq(flattenedLogs, 'label')
  const labelHashes = logs.map(log => log.label)
  const remoteLabels = await decryptHashes(...labelHashes)
  const localLabels = checkLabels(...labelHashes)
  const labels = mergeLabels(localLabels, remoteLabels)
  const ownerPromises = labels.map(label => getOwner(`${label}.${name}`))

  return Promise.all(ownerPromises).then(owners =>
    owners.map((owner, index) => {
      return {
        label: labels[index],
        labelHash: logs[index].label,
        decrypted: labels[index] !== null,
        node: name,
        name: `${labels[index] || logs[index].label}.${name}`,
        owner
      }
    })
  )
}

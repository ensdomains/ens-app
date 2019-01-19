import getENS, {
  getNamehash,
  getENSEvent,
  getReverseRegistrarContract,
  getResolverContract,
  getResolverReadContract,
  getNamehashWithLabelHash
} from './ens'
import { decryptHashes } from './preimage'
import { uniq, ensStartBlock, checkLabels, mergeLabels } from '../utils/utils'
import getWeb3, { getAccount } from './web3'

export async function getOwner(name) {
  const { readENS: ENS } = await getENS()
  const namehash = await getNamehash(name)
  const owner = await ENS.owner(namehash).call()
  return owner
}

export async function getResolver(name) {
  const namehash = await getNamehash(name)
  const { readENS: ENS } = await getENS()
  return ENS.resolver(namehash).call()
}

export async function getResolverWithNameHash(label, node, name) {
  let { readENS: ENS } = await getENS()
  let nodeHash = await getNamehashWithLabelHash(label, node)
  return ENS.resolver(nodeHash).call()
}

export async function getAddr(name) {
  const resolverAddr = await getResolver(name)
  if (parseInt(resolverAddr, 16) === 0) {
    return '0x00000000000000000000000000000000'
  }
  const namehash = await getNamehash(name)
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
  const namehash = await getNamehash(name)
  try {
    const { Resolver } = await getResolverReadContract(resolverAddr)
    return Resolver.contenthash(namehash).call()
  } catch (e) {
    console.warn(
      'Error getting content on the resolver contract, are you sure the resolver address is a resolver contract?'
    )
    return '0x00000000000000000000000000000000'
  }
}

export async function getName(address) {
  const reverseNode = `${address.slice(2)}.addr.reverse`
  const reverseNamehash = await getNamehash(reverseNode)
  const resolverAddr = await getResolver(reverseNode)
  if (parseInt(resolverAddr, 16) === 0) {
    return {
      name: null
    }
  }
  const { Resolver } = await getResolverReadContract(resolverAddr)
  try {
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
  const namehash = await getNamehash(name)
  const account = await getAccount()
  return () => ENS.setOwner(namehash, newOwner).send({ from: account })
}

export async function setSubnodeOwner(label, node, newOwner) {
  const web3 = await getWeb3()
  const { ENS } = await getENS()
  const account = await getAccount()
  const parentNamehash = await getNamehash(node)
  return () => ENS.setSubnodeOwner(
    parentNamehash,
    web3.utils.sha3(label),
    newOwner
  ).send({
    from: account
  })
}

export async function setResolver(name, resolver) {
  const account = await getAccount()
  const namehash = await getNamehash(name)
  const { ENS } = await getENS()
  return () => ENS.setResolver(namehash, resolver).send({ from: account })
}

export async function setAddress(name, address) {
  const account = await getAccount()
  const namehash = await getNamehash(name)
  const resolverAddr = await getResolver(name)
  const { Resolver } = await getResolverContract(resolverAddr)
  return () => Resolver.setAddr(namehash, address).send({ from: account })
}

export async function setContent(name, content) {
  const account = await getAccount()
  const namehash = await getNamehash(name)
  const resolverAddr = await getResolver(name)
  const { Resolver } = await getResolverContract(resolverAddr)
  return () => Resolver.setContenthash(namehash, content).send({ from: account })
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
      content
    }
  } catch (e) {
    return {
      ...node,
      addr: '0x0',
      content: '0x0'
    }
  }
}

export async function claimAndSetReverseRecordName(name, gasLimit = 0) {
  const { reverseRegistrar } = await getReverseRegistrarContract()
  const account = await getAccount()
  const gas = await reverseRegistrar.setName(name).estimateGas()
  return () => reverseRegistrar
    .setName(name)
    .send({ from: account, gas: gasLimit > gas ? gasLimit : gas })
}

export async function setReverseRecordName(name) {
  const account = await getAccount()
  const reverseNode = `${account.slice(2)}.addr.reverse`
  const resolverAddress = await getResolver(reverseNode)
  let { Resolver } = await getResolverContract(resolverAddress)
  let namehash = await getNamehash(reverseNode)
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
  const namehash = await getNamehash(name)
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

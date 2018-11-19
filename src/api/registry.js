import getENS, {
  getNamehash,
  getENSEvent,
  getReverseRegistrarContract,
  getResolverContract
} from './ens'
import { decryptHashes } from './preimage'
import { uniq, ensStartBlock, checkLabels, mergeLabels } from '../utils/utils'
import getWeb3, { getAccount } from '../api/web31'

export async function getOwner(name) {
  const { ENS } = await getENS()
  const namehash = await getNamehash(name)
  return ENS.owner(namehash).call()
}

export async function getResolver(name) {
  const namehash = await getNamehash(name)
  const { ENS } = await getENS()
  return ENS.resolver(namehash).call()
}

// export async function getResolverWithNameHash(label, node, name) {
//   let { ENS } = await getENS()
//   let nodeHash = await getNamehashWithLabelHash(label, node)
//   let registry = await ENS.registryPromise
//   return registry.resolverAsync(nodeHash)
// }

export async function getAddr(name) {
  const resolverAddr = await getResolver(name)
  const namehash = await getNamehash(name)
  const resolver = await getResolverContract(resolverAddr)
  return resolver.addr(namehash).call()
}

export async function getContent(name) {
  const resolverAddr = await getResolver(name)
  const namehash = await getNamehash(name)
  const resolver = await getResolverContract(resolverAddr)
  return resolver.content(namehash).call()
}

export async function getName(address) {
  const reverseNode = `${address.slice(2)}.addr.reverse`
  const reverseNameHash = await getNamehash(reverseNode)
  const resolverAddr = await getResolver(reverseNode)
  const resolver = await getResolverContract(resolverAddr)
  const name = await resolver.name(reverseNameHash).call()
  return {
    name
  }
}

export async function setOwner(name, newOwner) {
  const { ENS } = await getENS()
  const namehash = await getNamehash(name)
  const account = await getAccount()
  return ENS.setOwner(namehash, newOwner).send({ from: account })
}

export async function setSubnodeOwner(label, node, newOwner) {
  const { ENS } = await getENS()
  const account = await getAccount()
  return ENS.setSubnodeOwner(label + '.' + node, newOwner).send({
    from: account
  })
}

export async function setAddress(name, address) {
  const { ENS } = await getENS()
  const account = await getAccount()
  let resolver = await ENS.resolver(name)
  return resolver.setAddr(address).send({ from: account })
}

export async function setContent(name, content) {
  const { ENS } = await getENS()
  const account = await getAccount()
  let resolver = await ENS.resolver(name)
  return resolver.setContent(content).send({ from: account })
}

export async function setResolver(name, resolver) {
  const account = await getAccount()
  const { ENS } = await getENS()
  return ENS.setResolver(name, resolver).send({ from: account })
}

export async function checkSubDomain(subDomain, domain) {
  const { ENS } = await getENS()
  return ENS.owner(subDomain + '.' + domain).call()
}

export async function buildSubDomain(label, node, owner) {
  let { web3 } = await getWeb3()
  let labelHash = web3.sha3(label)
  let resolver = await getResolver(label + '.' + node)
  let subDomain = {
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
    let resolverAndNode = await getResolverDetails(subDomain)
    return resolverAndNode
  }
}

export async function createSubdomain(subDomain, domain) {
  const { ENS, web3 } = await getENS()
  const account = await getAccount()
  const namehash = await getNamehash(domain)
  return ENS.setSubnodeOwner(
    namehash,
    web3.utils.sha3(subDomain),
    account
  ).send({ from: account })
}

export async function deleteSubDomain(subDomain, domain) {
  const { ENS, web3 } = await getENS()
  const name = subDomain + '.' + domain
  const namehash = await getNamehash(domain)
  const resolver = await getResolver(name)
  const account = await getAccount()
  if (parseInt(resolver, 16) !== 0) {
    await setSubnodeOwner(subDomain, domain, account)
    await setResolver(name, 0)
  }
  return ENS.setSubnodeOwner(namehash, web3.utils.sha3(subDomain), 0).send({
    from: account
  })
}

export function getResolverDetails(node) {
  const addr = getAddr(node.name)
  const content = getContent(node.name)
  return Promise.all([addr, content]).then(([addr, content]) => ({
    ...node,
    addr,
    content
  }))
}

export async function claimReverseRecord(resolver) {
  let { reverseRegistrar } = await getReverseRegistrarContract()
  const account = await getAccount()
  return new Promise((resolve, reject) => {
    // reverseRegistrar.claim(accounts[0], { from: accounts[0] }, (err, txId) => {
    //   if (err) reject(err)
    //   resolve(txId)
    // })
    reverseRegistrar.claimWithResolver(
      account,
      resolver,
      { from: account },
      (err, txId) => {
        if (err) reject(err)
        resolve(txId)
      }
    )
  })
}

export async function getReverseRegistrarDefaultResolver(resolver) {
  let { reverseRegistrar } = await getReverseRegistrarContract()
  return new Promise((resolve, reject) => {
    reverseRegistrar.defaultResolver((err, resolver) => {
      if (err) reject(err)
      resolve(resolver)
    })
  })
}

export async function claim() {
  let { reverseRegistrar } = await getReverseRegistrarContract()
  const account = await getAccount()
  return reverseRegistrar.claim(account).send({ from: account })
}

export async function claimAndSetReverseRecordName(name) {
  let { reverseRegistrar } = await getReverseRegistrarContract()
  const account = await getAccount()
  return reverseRegistrar.setName(name).send({ from: account[0] })
}

export async function setReverseRecordName(name) {
  const account = await getAccount()
  const reverseNode = `${account.slice(2)}.addr.reverse`
  const resolverAddress = await getResolver(reverseNode)
  let { resolver } = await getResolverContract(resolverAddress)
  let namehash = await getNamehash(reverseNode)
  return resolver.setName(namehash, name).send({ from: account })
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
  let startBlock = await ensStartBlock()
  let namehash = await getNamehash(name)
  let rawLogs = await getENSEvent(
    'NewOwner',
    { node: namehash },
    { fromBlock: startBlock, toBlock: 'latest' }
  )
  let flattenedLogs = rawLogs.map(log => log.args)
  flattenedLogs.reverse()
  let logs = uniq(flattenedLogs, 'label')
  let labelHashes = logs.map(log => log.label)
  let remoteLabels = await decryptHashes(...labelHashes)
  let localLabels = checkLabels(...labelHashes)
  let labels = mergeLabels(localLabels, remoteLabels)
  let ownerPromises = labels.map(label => getOwner(`${label}.${name}`))

  return Promise.all(ownerPromises).then(owners =>
    owners.map((owner, index) => {
      let decrypted
      let label

      if (labels[index] === null) {
        label = 'unknown' + logs[index].label.slice(-6)
        decrypted = false
      } else {
        label = labels[index]
        decrypted = true
      }

      return {
        label,
        decrypted,
        node: name,
        name: `${labels[index]}.${name}`,
        owner
      }
    })
  )
}

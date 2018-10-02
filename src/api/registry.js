import getENS, {
  getNamehash,
  getNamehashWithLabelHash,
  getENSEvent,
  getReverseRegistrarContract,
  getResolverContract
} from './ens'
import { decryptHashes } from './preimage'
import { uniq, ensStartBlock, checkLabels, mergeLabels } from '../lib/utils'
import getWeb3, { getAccounts } from '../api/web3'

export async function getOwner(name) {
  let { ENS } = await getENS()
  return ENS.owner(name)
}

export async function getResolver(name) {
  let node = await getNamehash(name)
  let { ENS } = await getENS()
  let registry = await ENS.registryPromise
  return registry.resolverAsync(node)
}

export async function getResolverWithNameHash(label, node, name) {
  let { ENS } = await getENS()
  let nodeHash = await getNamehashWithLabelHash(label, node)
  let registry = await ENS.registryPromise
  return registry.resolverAsync(nodeHash)
}

export async function getAddr(name) {
  let { ENS } = await getENS()
  let resolver = await ENS.resolver(name)
  return resolver.addr()
}

export async function getContent(name) {
  let { ENS } = await getENS()
  let resolver = await ENS.resolver(name)
  return resolver.content()
}

export async function getName(address) {
  let { ENS } = await getENS()
  let reverseResolver = await ENS.reverse(address)
  let resolverAddr = await reverseResolver.resolverAddress()
  let name = await reverseResolver.name()
  return {
    name,
    resolverAddr
  }
}

export async function setAddr(name, address) {
  let { ENS } = await getENS()
  let accounts = await getAccounts()
  let resolver = await ENS.resolver(name)
  return resolver.setAddr(address, { from: accounts[0] })
}

export async function setContent(name, content) {
  let { ENS } = await getENS()
  let accounts = await getAccounts()
  let resolver = await ENS.resolver(name)
  return resolver.setContent(content, { from: accounts[0] })
}

export async function setResolver(name, resolver) {
  let accounts = await getAccounts()
  let { ENS } = await getENS()
  return ENS.setResolver(name, resolver, { from: accounts[0] })
}

export async function checkSubDomain(subDomain, domain) {
  let { ENS } = await getENS()
  return ENS.owner(subDomain + '.' + domain)
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

export async function createSubDomain(subDomain, domain) {
  let { ENS, web3 } = await getENS()
  let accounts = await getAccounts()
  let node = await getNamehash(domain)
  let registry = await ENS.registryPromise
  let txId = await registry.setSubnodeOwnerAsync(
    node,
    web3.sha3(subDomain),
    accounts[0],
    { from: accounts[0] }
  )
  return { txId, owner: accounts[0] }
}

export async function deleteSubDomain(subDomain, domain) {
  let { ENS, web3 } = await getENS()
  let name = subDomain + '.' + domain
  let node = await getNamehash(domain)
  let registry = await ENS.registryPromise
  let resolver = await getResolver(name)
  let accounts = await getAccounts()
  if (parseInt(resolver, 16) !== 0) {
    await setSubnodeOwner(subDomain, domain, accounts[0])
    await setResolver(name, 0)
  }
  return registry.setSubnodeOwnerAsync(node, web3.sha3(subDomain), 0, {
    from: accounts[0]
  })
}

export async function setNewOwner(name, newOwner) {
  let { ENS } = await getENS()
  let accounts = await getAccounts()
  return ENS.setOwner(name, newOwner, { from: accounts[0] })
}

export async function setSubnodeOwner(label, node, newOwner) {
  let { ENS } = await getENS()
  let accounts = await getAccounts()
  return ENS.setSubnodeOwner(label + '.' + node, newOwner, {
    from: accounts[0]
  })
}

export function getResolverDetails(node) {
  let addr = getAddr(node.name)
  let content = getContent(node.name)
  return Promise.all([addr, content]).then(([addr, content]) => ({
    ...node,
    addr,
    content
  }))
}

export async function claimReverseRecord(resolver) {
  let { reverseRegistrar } = await getReverseRegistrarContract()
  let accounts = await getAccounts()
  return new Promise((resolve, reject) => {
    // reverseRegistrar.claim(accounts[0], { from: accounts[0] }, (err, txId) => {
    //   if (err) reject(err)
    //   resolve(txId)
    // })
    reverseRegistrar.claimWithResolver(
      accounts[0],
      resolver,
      { from: accounts[0] },
      (err, txId) => {
        if (err) reject(err)
        resolve(txId)
      }
    )
  })
}

export async function claim() {
  let { reverseRegistrar } = await getReverseRegistrarContract()
  let accounts = await getAccounts()
  console.log('claim account', accounts[0])
  return new Promise((resolve, reject) => {
    reverseRegistrar.claim(accounts[0], { from: accounts[0] }, (err, txId) => {
      if (err) reject(err)
      resolve(txId)
    })
  })
}

export async function claimAndSetReverseRecordName(name) {
  let { reverseRegistrar } = await getReverseRegistrarContract()
  let accounts = await getAccounts()
  let node = await getNamehash(name)
  return new Promise((resolve, reject) => {
    reverseRegistrar.setName(node, { from: accounts[0] }, (err, txId) => {
      if (err) reject(err)
      resolve(txId)
    })
  })
}

export async function setReverseRecordName(account, resolverAddr, name) {
  let { resolver } = await getResolverContract(resolverAddr)
  let accounts = await getAccounts()
  let reverseAddress = `${account.slice(2)}.addr.reverse`
  let node = await getNamehash(reverseAddress)
  return new Promise((resolve, reject) => {
    resolver.setName(node, name, { from: accounts[0] }, function(err, txId) {
      if (err) reject(err)
      resolve(txId)
    })
  })
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

export const getSubdomainsDetails = async name => {
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
  let resolverPromises = logs.map((log, i) =>
    getResolverWithNameHash(log.label, log.node)
  )

  return Promise.all([
    Promise.all(ownerPromises),
    Promise.all(resolverPromises)
  ])
    .then(([owners, resolvers, addr, content]) => {
      /* Maps owner and resolver onto nodes */
      return logs
        .map((log, index) => {
          let label
          let owner
          let decrypted

          if (labels[index] === null) {
            label = 'unknown' + logs[index].label.slice(-6)
            owner = log.owner
            decrypted = false
          } else {
            label = labels[index]
            owner = owners[index]
            decrypted = true
          }

          return {
            decrypted,
            label,
            owner,
            labelHash: logs[index].label,
            node: name,
            name: label + '.' + name,
            resolver: resolvers[index],
            nodes: []
          }
        })
        .filter(node => parseInt(node.owner, 16) !== 0)
    })
    .then(nodes => {
      /* Gets Resolver information for node if they have a resolver */
      let nodePromises = nodes.map(node => {
        let hasResolver = parseInt(node.resolver, 16) !== 0
        if (hasResolver && node.decrypted) {
          return getResolverDetails(node)
        }
        return Promise.resolve(node)
      })
      return Promise.all(nodePromises)
    })
}

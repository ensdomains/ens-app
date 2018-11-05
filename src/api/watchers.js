import { getNamehash, watchEvent } from './ens'

export async function watchRegistryEvent(eventName, name, callback) {
  let namehash = await getNamehash(name)
  let event = await watchEvent(
    { contract: 'ENS', eventName },
    { node: namehash },
    { fromBlock: 'latest' },
    callback
  )
  return event
}

export async function watchResolverEvent(
  eventName,
  resolverAddr,
  name,
  callback
) {
  let namehash = await getNamehash(name)
  let event = await watchEvent(
    { contract: 'Resolver', eventName: eventName, addr: resolverAddr },
    { node: namehash },
    { fromBlock: 'latest' },
    callback
  )
  return event
}

export async function watchReverseRegistryEvent(eventName, name, callback) {
  let trimmed = name.slice(2)
  let namehash = await getNamehash(trimmed)
  let event = await watchEvent(
    { contract: 'ENS', eventName },
    { node: namehash },
    { fromBlock: 'latest' },
    callback
  )
  return event
}

export async function watchReverseResolverEvent(
  eventName,
  resolverAddr,
  name,
  callback
) {
  let trimmed = name.slice(2)
  let namehash = await getNamehash(trimmed)
  let event = await watchEvent(
    { contract: 'Resolver', eventName: eventName, addr: resolverAddr },
    { node: namehash },
    { fromBlock: 'latest' },
    callback
  )
  return event
}

import { getNamehash, watchEvent } from './ens'

export async function watchRegistryEvent(eventName, name, callback) {
  let namehash = await getNamehash(name)
  console.log(namehash)
  let event = await watchEvent(
    { contract: 'ENS', eventName },
    {},
    { fromBlock: 'latest' },
    callback
  )
  return event
}

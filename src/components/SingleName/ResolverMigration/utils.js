/* TODO add hardcoded resolver addresses */

const DEPRECATED_RESOLVERS = ['0x1', '0x2']
const OLD_RESOLVERS = ['0x3']

/* Deprecated resolvers are using the old registry and must be migrated */

export function isDeprecatedResolver(address) {
  return DEPRECATED_RESOLVERS.includes(address)
}

/* Old Public resolvers are using the new registry and can be continued to be used */

export function isOldPublicResolver(address) {
  return OLD_RESOLVERS.includes(address)
}

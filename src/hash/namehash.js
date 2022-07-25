import { validate } from '@ensdomains/ens-validation'
import { hash } from '@ensdomains/eth-ens-namehash'
import packet from 'dns-packet'

export function isValidName(name) {
  return validate(name)
}

export function namehash(name) {
  return hash(name)
}

export function dnsEncode(name) {
  return '0x' + packet.name.encode(name).toString('hex')
}

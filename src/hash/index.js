import { id } from '../../node_modules/@ethersproject/hash/lib/id.js'
import {
  hashMessage,
  messagePrefix
} from '../../node_modules/@ethersproject/hash/lib/message.js'
import { _TypedDataEncoder } from '../../node_modules/@ethersproject/hash/lib/typed-data.js'
import { dnsEncode, isValidName, namehash } from './namehash'

export {
  id,
  dnsEncode,
  namehash,
  isValidName,
  messagePrefix,
  hashMessage,
  _TypedDataEncoder
}

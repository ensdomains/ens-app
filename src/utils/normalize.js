import { createIntlSegmenterPolyfill } from 'intl-segmenter-polyfill/dist/bundled'
import { normalize as normalizeENS } from '@ensdomains/eth-ens-namehash'
import emojiRegex from 'emoji-regex'

const ZERO_WIDTH = ''
const zeroWidthPoints = new Set([
  '\u200b', // zero width space
  '\u200c', // zero width non-joiner
  '\u200d', // zero width joiner
  '\ufeff', // zero width no-break space
  '\u2028', // line separator
  '\u2029' // paragraph separator,
])

export async function normalize(name) {
  const Segmenter = await createIntlSegmenterPolyfill()
  let _name = normalizeENS(name)

  const segments = [...new Segmenter().segment(_name)]
    .map(({ segment }) => {
      // skip if segment is an emoji with or without ZWJ
      if (emojiRegex().test(segment)) return segment
      // check if segment has any ZWJ
      const hasZWJ = segment
        .split(ZERO_WIDTH)
        .some(point => zeroWidthPoints.has(point))
      return !hasZWJ ? segment : false
    })
    .filter(Boolean) // filter out ZWJ part
  return segments.join(ZERO_WIDTH)
}

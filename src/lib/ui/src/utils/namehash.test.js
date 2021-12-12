import { namehash } from './namehash'

test('test namehash', () => {
  expect(
    namehash(
      '[663072b30dcab381fd7418a1cbe2746c2dd42d79b3d0982109e624ff5d8d1d8d].eth'
    )
  ).toBe('0x89e11c9f4e589de37ebe0ea626ffdcefaca07d90bac8e1e89db3661f43da0346')

  expect(namehash('arachnid.eth')).toBe(
    '0x89e11c9f4e589de37ebe0ea626ffdcefaca07d90bac8e1e89db3661f43da0346'
  )
})

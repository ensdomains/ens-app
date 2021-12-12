import { validateName, namehash } from './'

test('validateName returns true for valid names', () => {
  expect(validateName('vitalik')).toBe('vitalik')
  expect(validateName('Vitalik')).toBe('vitalik')
  expect(validateName('Vitalik.eth')).toBe('vitalik.eth')
  expect(validateName('sub.Vitalik.eth')).toBe('sub.vitalik.eth')
})

test('validateName returns false for invalid names', () => {
  expect(() => validateName('$vitalik')).toThrowError('Illegal char $')
  expect(() => validateName('#vitalik')).toThrowError('Illegal char #')
  expect(() => validateName('vitalik ')).toThrowError('Illegal char ')
})

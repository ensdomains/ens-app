import { validateName } from '../utils'

test('test valid names', () => {
  expect(validateName('vitalik')).toBe('vitalik')
  expect(validateName('Vitalik')).toBe('vitalik')
  expect(validateName('Vitalik.eth')).toBe('vitalik.eth')
  expect(validateName('sub.Vitalik.eth')).toBe('sub.vitalik.eth')
})

test('test invalid names', () => {
  expect(() => validateName('$vitalik')).toThrowError('Illegal char $')
  expect(() => validateName('#vitalik')).toThrowError('Illegal char #')
  expect(() => validateName('vitalik ')).toThrowError('Illegal char ')
})

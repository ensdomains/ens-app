import { normalize } from './normalize'

describe('normalize ENS name', () => {
  it('should clean ZWJ from name', async () => {
    const name = '‌‌‌‌0.eth' // name with ZWJ prefix;
    const normalizedName = await normalize(name)
    expect(normalizedName).not.toEqual(name)
  })

  it('should keep compound emojis as it is (astronout)', async () => {
    const name = '👩‍🚀👩‍🚀👩‍🚀.eth' // name with compound emoji (glued with ZWJ); 👩 + ZWJ + 🚀 = 👩‍🚀
    const normalizedName = await normalize(name)
    expect(normalizedName).toEqual(name)
  })

  it('should keep compound emojis as it is (flag)', async () => {
    const name = '🏳‍🌈🏳‍🌈🏳‍🌈.eth' // name with compound emoji (glued with ZWJ); 🏳️ + ZWJ + 🌈 = 🏳‍🌈
    const normalizedName = await normalize(name)
    expect(normalizedName).toEqual(name)
  })

  it('should keep symbols as it is', async () => {
    const name = '♥♥♥.eth' // name with heart symbol
    const normalizedName = await normalize(name)
    expect(normalizedName).toEqual(name)
  })

  it('should not let ZWJ as prefixed to symbols', async () => {
    const name = '‍♥♥♥.eth' // name with heart symbol, ZWJ prefixed
    const normalizedName = await normalize(name)
    expect(normalizedName).not.toEqual(name)
  })

  it('should not let ZWJ as prefixed to latin characters', async () => {
    const name = '‍nick.eth' // name with latin chars, ZWJ prefixed
    const normalizedName = await normalize(name)
    expect(normalizedName).not.toEqual(name)
  })

  it('should not let ZWJ as mixed into latin characters', async () => {
    const name = 'nic‍k.eth' // name with latin chars, ZWJ prefixed
    const normalizedName = await normalize(name)
    expect(normalizedName).not.toEqual(name)
  })
})

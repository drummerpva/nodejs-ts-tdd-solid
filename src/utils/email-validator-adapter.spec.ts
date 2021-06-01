import faker from 'faker'
import { EmailValidatorAdapter } from './email-validator-adapter'
describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid(faker.random.words(2))
    expect(isValid).toBe(false)
  })
})

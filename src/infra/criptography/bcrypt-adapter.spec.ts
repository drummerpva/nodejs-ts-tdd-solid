import faker from 'faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const makeSut = (salt: number | string): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('BCrypt Adaper', () => {
  test('Should call bcrypt only once', async () => {
    const sut = makeSut(12)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const passwordFake = faker.internet.password()
    await sut.encrypt(passwordFake)
    expect(hashSpy).toBeCalledTimes(1)
  })
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut(12)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const passwordFake = faker.internet.password()
    await sut.encrypt(passwordFake)
    expect(hashSpy).toHaveBeenCalledWith(passwordFake, 12)
  })
})

import faker from 'faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const makeSut = (salt: number | string): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('BCrypt Adaper', () => {
  test('Should call bcrypt only once', async () => {
    const salt = 12
    const sut = makeSut(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const passwordFake = faker.internet.password()
    await sut.encrypt(passwordFake)
    expect(hashSpy).toBeCalledTimes(1)
  })
  test('Should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = makeSut(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const passwordFake = faker.internet.password()
    await sut.encrypt(passwordFake)
    expect(hashSpy).toHaveBeenCalledWith(passwordFake, salt)
  })
  test('Should return a hash on success', async () => {
    const salt = 12
    const sut = makeSut(salt)
    const hash = await sut.encrypt(faker.internet.password())
    expect(hash).toBeTruthy()
  })
})

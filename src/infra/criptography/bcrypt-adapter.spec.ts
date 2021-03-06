import faker from 'faker'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const hashFake = faker.datatype.uuid()
jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return hashFake
  }
}))

const makeSut = (salt: number | string = 12): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('BCrypt Adaper', () => {
  test('Should call bcrypt only once', async () => {
    const sut = makeSut()
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
    const sut = makeSut()
    const hash = await sut.encrypt(faker.internet.password())
    expect(hash).toBe(hashFake)
  })
  test('Should trows if bcrypt throws', async () => {
    const sut = makeSut()
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementationOnce(async () => await Promise.reject(new Error()))
    const promise = sut.encrypt(faker.internet.password())
    await expect(promise).rejects.toThrow()
  })
})

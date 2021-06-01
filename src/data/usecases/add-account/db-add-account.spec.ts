import faker from 'faker'
import { AddAccountModel, Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve(faker.datatype.uuid())
    }
  }
  return new EncrypterStub()
}
type SutTypes = {
  sut: DbAddAccount
  encrypterStub: Encrypter
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)
  return { sut, encrypterStub }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const passwordFake = faker.internet.password()
    const accountData: AddAccountModel = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: passwordFake
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(passwordFake)
  })
  test('Should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const passwordFake = faker.internet.password()
    const accountData: AddAccountModel = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: passwordFake
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})

import faker from 'faker'
import {
  AddAccountModel,
  Encrypter,
  AccountModel,
  AddAccountRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const fakeAccount: AccountModel = {
  id: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email()
}
const hashedPasswordFake = faker.datatype.uuid()
const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve(hashedPasswordFake)
    }
  }
  return new EncrypterStub()
}
const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountRepositoryStub()
}
type SutTypes = {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
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
  test('Should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData: AddAccountModel = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: hashedPasswordFake
    })
  })
})

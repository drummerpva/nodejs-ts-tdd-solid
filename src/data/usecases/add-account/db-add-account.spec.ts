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
const addAccountDataFake: AddAccountModel = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
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
    const accountData: AddAccountModel = Object.assign({}, addAccountDataFake, {
      password: passwordFake
    })
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(passwordFake)
  })
  test('Should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(addAccountDataFake)
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(addAccountDataFake)
    expect(addSpy).toHaveBeenCalledWith({
      ...addAccountDataFake,
      password: hashedPasswordFake
    })
  })
  test('Should throw if AddACcountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(addAccountDataFake)
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account on succes', async () => {
    const { sut } = makeSut()
    const account = await sut.add(addAccountDataFake)
    expect(account).toEqual(fakeAccount)
  })
})

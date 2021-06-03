import faker from 'faker'
import { AddAccountRepository, AddAccountModel } from './account-protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const fakeAddAccount: AddAccountModel = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}

const makeSut = (): AddAccountRepository => {
  const sut = new AccountMongoRepository()
  return sut
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('Should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add(fakeAddAccount)
    expect(account).toBeTruthy()
    expect(account.name).toBe(fakeAddAccount.name)
    expect(account.email).toBe(fakeAddAccount.email)
    expect(account.id).toBeTruthy()
  })
})
